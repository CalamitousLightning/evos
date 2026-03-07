from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from datetime import datetime
from ..database import Base

class Transaction(Base):

    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    agent_id = Column(Integer, ForeignKey("users.id"))

    customer_phone = Column(String)
    network = Column(String)
    data_plan = Column(String)

    amount = Column(Float)

    created_at = Column(DateTime, default=datetime.utcnow)


