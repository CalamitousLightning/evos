from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from .database import Base
class User(Base):

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True)
    full_name = Column(String)
    phone = Column(String)
    password_hash = Column(String)

    role = Column(String, default="agent")
    status = Column(String, default="pending")

    invited_by = Column(String, nullable=True)

from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship

class Order(Base):

    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)

    agent_id = Column(Integer, ForeignKey("users.id"))

    customer_phone = Column(String)

    network = Column(String)

    bundle = Column(String)

    amount = Column(Float)

    status = Column(String, default="pending")

    agent = relationship("User")
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())


from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from datetime import datetime

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)

    agent_id = Column(Integer, ForeignKey("users.id"))

    customer_phone = Column(String)
    network = Column(String)
    data_plan = Column(String)

    amount = Column(Float)

    created_at = Column(DateTime, default=datetime.utcnow)

class Wallet(Base):
    __tablename__ = "wallets"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    balance = Column(Float, default=0.0)
    total_commission = Column(Float, default=0.0)


