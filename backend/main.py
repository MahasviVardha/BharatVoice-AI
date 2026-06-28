import os
import uuid

from fastapi import FastAPI, Depends, HTTPException, Form, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime

import models
import schemas
import auth
import ai_agents
import employee
from database import engine, get_db, Base
from config import UPLOAD_DIR, MAX_UPLOAD_BYTES, CORS_ORIGINS

Base.metadata.create_all(bind=engine)

UPLOAD_DIR = os.getenv("UPLOAD_DIR", "/tmp/uploads")

app = FastAPI(title="BharatVoice AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=CORS_ORIGINS != ["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")
app.include_router(employee.router)


@app.get("/")
def root():
    return {"status": "BharatVoice AI backend running"}


# --- Auth ---------------------------------------------------------------

@app.post("/register", response_model=schemas.TokenResponse)
def register(payload: schemas.RegisterRequest, db: Session = Depends(get_db)):
    role = payload.role if payload.role in ("customer", "employee") else "customer"

    if role == "employee":
        employee_id = payload.employee_id or f"EMP{1000 + db.query(func.count(models.User.id)).filter(models.User.role == 'employee').scalar() + 1}"
        if db.query(models.User).filter(models.User.employee_id == employee_id).first():
            raise HTTPException(400, "Employee ID already registered")
        user = models.User(
            name=payload.name, employee_id=employee_id,
            password=auth.hash_password(payload.password), role=role,
        )
    else:
        if not payload.email:
            raise HTTPException(400, "Email is required for customer accounts")
        if db.query(models.User).filter(models.User.email == payload.email).first():
            raise HTTPException(400, "Email already registered")
        user = models.User(
            name=payload.name, email=payload.email,
            password=auth.hash_password(payload.password), role=role,
        )

    db.add(user)
    db.commit()
    db.refresh(user)
    token = auth.create_token(user.id, user.role)
    return schemas.TokenResponse(
        access_token=token, user_id=user.id, name=user.name, role=user.role, employee_id=user.employee_id,
    )


@app.post("/login", response_model=schemas.TokenResponse)
def login(payload: schemas.LoginRequest, db: Session = Depends(get_db)):
    query = db.query(models.User)
    if payload.employee_id:
        user = query.filter(models.User.employee_id == payload.employee_id).first()
    elif payload.email:
        user = query.filter(models.User.email == payload.email).first()
    else:
        raise HTTPException(400, "Email or Employee ID is required")

    if not user or not auth.verify_password(payload.password, user.password):
        raise HTTPException(401, "Invalid credentials")
    token = auth.create_token(user.id, user.role)
    return schemas.TokenResponse(
        access_token=token, user_id=user.id, name=user.name, role=user.role, employee_id=user.employee_id,
    )


@app.post("/change-password")
def change_password(payload: schemas.ChangePasswordRequest, db: Session = Depends(get_db),
                     user: models.User = Depends(auth.get_current_user)):
    if not auth.verify_password(payload.current_password, user.password):
        raise HTTPException(401, "Current password is incorrect")
    user.password = auth.hash_password(payload.new_password)
    db.commit()
    return {"status": "Password updated"}


# --- Products -------------------------------------------------------------

@app.get("/products", response_model=list[schemas.ProductOut])
def list_products(db: Session = Depends(get_db)):
    return db.query(models.Product).all()


@app.post("/products", response_model=schemas.ProductOut)
def create_product(payload: schemas.ProductCreate, db: Session = Depends(get_db),
                    user: models.User = Depends(auth.get_current_user)):
    existing = db.query(models.Product).filter(models.Product.name == payload.name).first()
    if existing:
        return existing
    product = models.Product(name=payload.name, category=payload.category)
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


# --- Feedback --------------------------------------------------------------

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}


@app.post("/feedback", response_model=schemas.FeedbackOut)
def submit_feedback(
    product_id: int = Form(...),
    language: str = Form(...),
    text: str = Form(...),
    category: str = Form(...),
    product_name: str | None = Form(None),
    image: UploadFile | None = File(None),
    db: Session = Depends(get_db),
    user: models.User = Depends(auth.get_current_user),
):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(404, "Product not found")

    if not category or not category.strip():
        raise HTTPException(400, "Feedback category is required")

    image_path = None
    if image is not None and image.filename:
        if image.content_type not in ALLOWED_IMAGE_TYPES:
            raise HTTPException(400, "Proof photo must be a JPEG, PNG, WEBP or GIF image")
        contents = image.file.read(MAX_UPLOAD_BYTES + 1)
        if len(contents) > MAX_UPLOAD_BYTES:
            raise HTTPException(400, f"Proof photo must be under {MAX_UPLOAD_BYTES // (1024 * 1024)}MB")
        ext = os.path.splitext(image.filename)[1] or ".jpg"
        filename = f"{uuid.uuid4().hex}{ext}"
        with open(os.path.join(UPLOAD_DIR, filename), "wb") as f:
            f.write(contents)
        image_path = f"/uploads/{filename}"

    # Create the row first so AI pipeline runtime logs can reference its id.
    feedback = models.Feedback(
        user_id=user.id,
        product_id=product.id,
        product_name=product_name.strip() if product_name else None,
        image_path=image_path,
        original_text=text,
        language=language,
    )
    db.add(feedback)
    db.commit()
    db.refresh(feedback)

    # The customer-selected category is treated as ground truth and flows into
    # every downstream agent: it overrides the rule-based category guess,
    # becomes part of the Hindsight memory key, and is what trend analytics
    # and category insights group by in the Employee Portal.
    result = ai_agents.run_pipeline(db, text, language, product.id, customer_category=category)

    memory_note = ai_agents.hindsight_memory_agent(
        db, product.id, result["problem"], result["category"],
        recommendation="", feedback_id=feedback.id,
    )
    recommendation = ai_agents.recommendation_agent(result["problem"], memory_note, db, feedback.id)

    feedback.translated_text = result["translated_text"]
    feedback.sentiment = result["sentiment"]
    feedback.category = result["category"]
    feedback.priority = result["priority"]
    feedback.problem = result["problem"]
    feedback.recommendation = recommendation
    feedback.memory_note = memory_note
    db.commit()
    db.refresh(feedback)

    _update_ai_insight(db, product.id, result["problem"], result["category"], recommendation)

    return feedback


@app.get("/feedback/history", response_model=list[schemas.FeedbackOut])
def feedback_history(db: Session = Depends(get_db), user: models.User = Depends(auth.get_current_user)):
    return (
        db.query(models.Feedback)
        .filter(models.Feedback.user_id == user.id)
        .order_by(models.Feedback.created_at.desc())
        .all()
    )


@app.get("/feedback/{feedback_id}", response_model=schemas.FeedbackOut)
def get_feedback(feedback_id: int, db: Session = Depends(get_db),
                  user: models.User = Depends(auth.get_current_user)):
    fb = db.query(models.Feedback).filter(models.Feedback.id == feedback_id).first()
    if not fb:
        raise HTTPException(404, "Feedback not found")
    return fb


# --- Product insights --------------------------------------------------

def _update_ai_insight(db: Session, product_id: int, problem: str, category: str, recommendation: str):
    insight = db.query(models.AIInsight).filter(
        models.AIInsight.product_id == product_id, models.AIInsight.problem == problem
    ).first()
    if insight:
        insight.frequency += 1
        insight.recommendation = recommendation
        insight.impact_score = min(100.0, insight.frequency * 5.0)
        insight.updated_at = datetime.utcnow()
    else:
        insight = models.AIInsight(
            product_id=product_id, problem=problem, category=category,
            frequency=1, recommendation=recommendation, impact_score=5.0,
        )
        db.add(insight)
    db.commit()


@app.get("/product/insights")
def product_insights(product_id: int, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(404, "Product not found")

    feedbacks = db.query(models.Feedback).filter(models.Feedback.product_id == product_id).all()
    total = len(feedbacks)
    sentiment_counts = {"Positive": 0, "Negative": 0, "Neutral": 0}
    for f in feedbacks:
        if f.sentiment in sentiment_counts:
            sentiment_counts[f.sentiment] += 1

    insights = (
        db.query(models.AIInsight)
        .filter(models.AIInsight.product_id == product_id)
        .order_by(models.AIInsight.frequency.desc())
        .all()
    )

    satisfaction = 0
    if total:
        satisfaction = round((sentiment_counts["Positive"] + 0.5 * sentiment_counts["Neutral"]) / total * 100)

    language_counts = {}
    for f in feedbacks:
        language_counts[f.language] = language_counts.get(f.language, 0) + 1

    return {
        "product": {"id": product.id, "name": product.name, "category": product.category},
        "total_feedback": total,
        "sentiment_counts": sentiment_counts,
        "satisfaction_score": satisfaction,
        "language_breakdown": language_counts,
        "top_complaints": [
            {
                "problem": i.problem,
                "category": i.category,
                "frequency": i.frequency,
                "recommendation": i.recommendation,
                "impact_score": i.impact_score,
            }
            for i in insights
        ],
    }


# --- AI Runtime Monitor (cascadeflow) --------------------------------------

@app.get("/ai/runtime")
def ai_runtime(db: Session = Depends(get_db)):
    logs = db.query(models.RuntimeLog).order_by(models.RuntimeLog.created_at.desc()).limit(100).all()
    total_cost = db.query(func.sum(models.RuntimeLog.cost)).scalar() or 0.0
    total_saved = db.query(func.sum(models.RuntimeLog.cost_saved)).scalar() or 0.0
    requests_processed = db.query(func.count(models.RuntimeLog.id)).scalar() or 0

    model_usage = {}
    for log in db.query(models.RuntimeLog).all():
        model_usage[log.model] = model_usage.get(log.model, 0) + 1

    return {
        "requests_processed": requests_processed,
        "total_cost": round(total_cost, 4),
        "total_cost_saved": round(total_saved, 4),
        "model_usage": model_usage,
        "recent_logs": [
            {
                "task": l.task, "model": l.model, "reason": l.reason,
                "cost": l.cost, "cost_saved": l.cost_saved, "created_at": l.created_at,
            }
            for l in logs
        ],
    }
