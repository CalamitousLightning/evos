from pydantic import BaseModel
from datetime import datetime


# -------------------------
# USER SCHEMAS
# -------------------------

class UserCreate(BaseModel):
    username: str
    full_name: str
    phone: str
    password: str


class UserLogin(BaseModel):
    username: str
    password: str


# -------------------------
# TRANSACTION SCHEMAS
# -------------------------

class TransactionCreate(BaseModel):
    customer_phone: str
    network: str
    data_plan: str
    amount: float


class TransactionResponse(BaseModel):
    id: int
    transaction_reference: str
    customer_phone: str
    network: str
    data_plan: str
    amount: float
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
