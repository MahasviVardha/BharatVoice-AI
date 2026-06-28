"""Seed sample data so the demo has history/memory on first run.
Run with: python seed.py

SECURITY NOTE: in production (ENV=production), the well-known demo passwords
("demo1234" / "employee123") are never used — a random password is generated
instead and printed ONCE so you can capture it. Anyone who deploys this app
publicly with the well-known demo credentials intact is handing out a free
account, so don't skip this.
"""
import secrets

from database import engine, SessionLocal, Base
from config import ENV
import models
import auth
import ai_agents

Base.metadata.create_all(bind=engine)
db = SessionLocal()

PRODUCT_NAMES = ["Amazon", "Flipkart", "Swiggy", "Zomato", "PhonePe", "Netflix", "Ola", "Uber"]

products = {}
for name in PRODUCT_NAMES:
    p = db.query(models.Product).filter(models.Product.name == name).first()
    if not p:
        p = models.Product(name=name, category="E-commerce/Services")
        db.add(p)
        db.commit()
        db.refresh(p)
    products[name] = p

is_prod = ENV == "production"
demo_customer_password = secrets.token_urlsafe(9) if is_prod else "demo1234"
demo_employee_password = secrets.token_urlsafe(9) if is_prod else "employee123"

demo_user = db.query(models.User).filter(models.User.email == "demo@bharatvoice.ai").first()
created_demo_customer = demo_user is None
if not demo_user:
    demo_user = models.User(
        name="Demo User", email="demo@bharatvoice.ai",
        password=auth.hash_password(demo_customer_password), role="customer",
    )
    db.add(demo_user)
    db.commit()
    db.refresh(demo_user)

employee_user = db.query(models.User).filter(models.User.employee_id == "EMP1001").first()
created_demo_employee = employee_user is None
if not employee_user:
    employee_user = models.User(
        name="Priya Sharma", employee_id="EMP1001",
        password=auth.hash_password(demo_employee_password), role="employee",
    )
    db.add(employee_user)
    db.commit()

# (product, language, text, customer-selected category)
SAMPLE_FEEDBACK = [
    ("Swiggy", "English", "Delivery is very slow during rain and packaging quality should improve", "Delivery"),
    ("Swiggy", "Hindi", "Delivery bahut der se aata hai jab baarish hoti hai", "Delivery"),
    ("Swiggy", "Telugu", "Delivery rain time lo late avutundi", "Delivery"),
    ("Swiggy", "English", "Food packaging was damaged on arrival", "Packaging"),
    ("Zomato", "English", "Payment failed twice but money was deducted", "Payment"),
    ("PhonePe", "Hindi", "Payment fail ho gaya transaction ke baad bhi paisa kat gaya", "Payment"),
    ("PhonePe", "English", "Login OTP never arrives, authentication keeps failing", "Website/App"),
    ("Amazon", "English", "Great fast delivery this time, very happy with service", "Delivery"),
    ("Amazon", "English", "Product quality is excellent and matches the description perfectly", "Product Quality"),
    ("Flipkart", "English", "Product quality is great, excellent build and very happy with the purchase", "Product Quality"),
    ("Netflix", "English", "Excellent content library, love the recommendations, amazing experience", "Product Quality"),
    ("Flipkart", "English", "Customer support was rude and unhelpful during refund request", "Staff Behaviour"),
    ("Ola", "English", "App crashes every time I try to book a ride", "Website/App"),
    ("Uber", "Marathi", "App khup slow aahe aani crash hote", "Website/App"),
    ("Netflix", "English", "Prices are too expensive compared to other apps", "Pricing"),
    ("Zomato", "Telugu", "Delivery rain time lo chala late avutundi", "Delivery"),
    ("Swiggy", "Bengali", "Delivery khub late hocche abar", "Delivery"),
    ("Ola", "English", "App crashes again, very frustrating experience", "Website/App"),
]

for product_name, lang, text, category in SAMPLE_FEEDBACK:
    product = products[product_name]
    fb = models.Feedback(user_id=demo_user.id, product_id=product.id, original_text=text, language=lang)
    db.add(fb)
    db.commit()
    db.refresh(fb)

    result = ai_agents.run_pipeline(db, text, lang, product.id, customer_category=category)
    memory_note = ai_agents.hindsight_memory_agent(
        db, product.id, result["problem"], result["category"], "", feedback_id=fb.id,
    )
    recommendation = ai_agents.recommendation_agent(result["problem"], memory_note, db, fb.id)

    fb.translated_text = result["translated_text"]
    fb.sentiment = result["sentiment"]
    fb.category = result["category"]
    fb.priority = result["priority"]
    fb.problem = result["problem"]
    fb.recommendation = recommendation
    fb.memory_note = memory_note
    db.commit()

    insight = db.query(models.AIInsight).filter(
        models.AIInsight.product_id == product.id, models.AIInsight.problem == result["problem"]
    ).first()
    if insight:
        insight.frequency += 1
        insight.recommendation = recommendation
        insight.impact_score = min(100.0, insight.frequency * 5.0)
    else:
        insight = models.AIInsight(
            product_id=product.id, problem=result["problem"], category=result["category"],
            frequency=1, recommendation=recommendation, impact_score=5.0,
        )
        db.add(insight)
    db.commit()

print("Seed complete.")
if is_prod:
    if created_demo_customer:
        print(f"Customer demo login: demo@bharatvoice.ai / {demo_customer_password}  (SAVE THIS — shown once)")
    else:
        print("Customer demo account already existed — password unchanged, not reprinted.")
    if created_demo_employee:
        print(f"Employee demo login: Employee ID EMP1001 / {demo_employee_password}  (SAVE THIS — shown once)")
    else:
        print("Employee demo account already existed — password unchanged, not reprinted.")
else:
    print("Customer demo login: demo@bharatvoice.ai / demo1234")
    print("Employee demo login: Employee ID EMP1001 / employee123")
db.close()
