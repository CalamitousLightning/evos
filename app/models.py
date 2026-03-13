from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from datetime import datetime

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



class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    transaction_reference = Column(String, unique=True, index=True)

    agent_id = Column(Integer, ForeignKey("users.id"))

    customer_phone = Column(String)
    network = Column(String)
    data_plan = Column(String)
    status = Column(String, default="pending")

    amount = Column(Float)

    created_at = Column(DateTime, default=datetime.utcnow)

class Wallet(Base):
    __tablename__ = "wallets"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    balance = Column(Float, default=0.0)
    total_commission = Column(Float, default=0.0)

class Withdrawal(Base):
    __tablename__ = "withdrawals"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    amount = Column(Float)
    status = Column(String, default="pending")

class WalletLedger(Base):

    __tablename__ = "wallet_ledger"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"))

    transaction_type = Column(String)  
    # deposit, purchase, commission, withdrawal

    amount = Column(Float)

    reference = Column(String)

    balance_after = Column(Float)

    created_at = Column(DateTime, default=datetime.utcnow)