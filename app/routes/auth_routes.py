from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User
from ..schemas import UserCreate
from ..auth import hash_password

router = APIRouter()

@router.post("/apply-agent")
def apply_agent(user: UserCreate, db: Session = Depends(get_db)):

    existing = db.query(User).filter(User.username == user.username).first()
    if existing:
        return {"error": "Username already exists"}

    new_user = User(
        username=user.username,
        full_name=user.full_name,
        phone=user.phone,
        password_hash=hash_password(user.password),
        role="agent",
        status="pending"
    )

    db.add(new_user)
    db.commit()

    return {"message": "Application submitted. Await founder approval."}


from ..schemas import UserLogin
from ..auth import verify_password

@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):

    db_user = db.query(User).filter(User.username == user.username).first()

    if not db_user:
        return {"error": "Invalid credentials"}

    if not verify_password(user.password, db_user.password_hash):
        return {"error": "Invalid credentials"}

    if db_user.status != "active":
        return {"error": "Account not approved yet"}

    return {
        "message": "Login successful",
        "role": db_user.role,
        "username": db_user.username
    }
