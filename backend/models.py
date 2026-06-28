from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=True)
    employee_id = Column(String, unique=True, index=True, nullable=True)
    password = Column(String, nullable=False)
    role = Column(String, default="customer")  # customer | employee | admin
    created_at = Column(DateTime, default=datetime.utcnow)

    feedbacks = relationship("Feedback", back_populates="user")


class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    category = Column(String, default="General")

    feedbacks = relationship("Feedback", back_populates="product")


class Feedback(Base):
    __tablename__ = "feedback"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    original_text = Column(Text, nullable=False)
    language = Column(String, nullable=False)
    product_name = Column(String)  # customer-typed specific item/product name, distinct from the platform
    image_path = Column(String)  # optional proof photo, relative path under /uploads
    translated_text = Column(Text)
    sentiment = Column(String)
    category = Column(String)
    priority = Column(String)
    problem = Column(String)
    recommendation = Column(Text)
    memory_note = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="feedbacks")
    product = relationship("Product", back_populates="feedbacks")

    @property
    def platform(self):
        return self.product.name if self.product else None


class AIInsight(Base):
    __tablename__ = "ai_insights"
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    problem = Column(String, nullable=False)
    category = Column(String)
    frequency = Column(Integer, default=1)
    recommendation = Column(Text)
    impact_score = Column(Float, default=0.0)
    status = Column(String, default="Generated")  # Generated | Accepted | Rejected | Implemented
    updated_at = Column(DateTime, default=datetime.utcnow)

    product = relationship("Product")


class MemoryRecord(Base):
    """Hindsight-style long term memory of feedback patterns per product+problem."""
    __tablename__ = "memory_records"
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    problem_key = Column(String, nullable=False)
    category = Column(String)
    occurrences = Column(Integer, default=1)
    last_recommendation = Column(Text)
    trend_note = Column(Text)
    first_seen = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)


class RuntimeLog(Base):
    """cascadeflow-style runtime decision log: which model was routed to which task and why."""
    __tablename__ = "runtime_logs"
    id = Column(Integer, primary_key=True, index=True)
    task = Column(String, nullable=False)
    model = Column(String, nullable=False)
    reason = Column(String, nullable=False)
    cost = Column(Float, default=0.0)
    cost_saved = Column(Float, default=0.0)
    feedback_id = Column(Integer, ForeignKey("feedback.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
