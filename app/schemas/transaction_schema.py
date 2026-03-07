from pydantic import BaseModel
from datetime import datetime

class TransactionCreate(BaseModel):
    customer_phone: str
    network: str
    data_plan: str
    amount: float

class TransactionResponse(BaseModel):
    id: int
    customer_phone: str
    network: str
    data_plan: str
    amount: float
    created_at: datetime

    class Config:
        from_attributes = True
