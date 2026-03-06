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

    created_at = Column(DateTime(timezone=True), server_default=func.now())
