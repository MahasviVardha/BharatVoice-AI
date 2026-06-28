from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class RegisterRequest(BaseModel):
    name: str
    email: Optional[str] = None
    employee_id: Optional[str] = None
    password: str
    role: Optional[str] = "customer"  # customer | employee


class LoginRequest(BaseModel):
    email: Optional[str] = None
    employee_id: Optional[str] = None
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int
    name: str
    role: str
    employee_id: Optional[str] = None


class RecommendationStatusUpdate(BaseModel):
    status: str  # Generated | Accepted | Rejected | Implemented


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str


class ProductCreate(BaseModel):
    name: str
    category: Optional[str] = "General"


class ProductOut(BaseModel):
    id: int
    name: str
    category: str

    class Config:
        from_attributes = True


class FeedbackCreate(BaseModel):
    product_id: int
    language: str
    text: str
    category: str


class FeedbackOut(BaseModel):
    id: int
    product_id: int
    platform: Optional[str] = None
    product_name: Optional[str] = None
    image_path: Optional[str] = None
    original_text: str
    language: str
    translated_text: Optional[str]
    sentiment: Optional[str]
    category: Optional[str]
    priority: Optional[str]
    problem: Optional[str]
    recommendation: Optional[str]
    memory_note: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class InsightOut(BaseModel):
    problem: str
    category: Optional[str]
    frequency: int
    recommendation: Optional[str]
    impact_score: float

    class Config:
        from_attributes = True


class RuntimeLogOut(BaseModel):
    task: str
    model: str
    reason: str
    cost: float
    cost_saved: float
    created_at: datetime

    class Config:
        from_attributes = True
