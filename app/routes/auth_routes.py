from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User
from ..schemas import UserCreate
from ..auth import hash_password
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.auth import hash_password
from slowapi.util import get_remote_address
from slowapi import Limiter
from fastapi import Request
from ..limiter import limiter


router = APIRouter(prefix="/auth")

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
@limiter.limit("5/minute")
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


@router.post("/register")
@limiter.limit("3/minute")
def register(username: str, full_name: str, phone: str, password: str, invited_by: str = None, db: Session = Depends(get_db)):

    user = User(
        username=username,
        full_name=full_name,
        phone=phone,
        password_hash=hash_password(password),
        role="agent",
        status="pending",
        invited_by=invited_by
    )

    db.add(user)
    db.commit()

    return {"message": "Registration successful. Await founder approval."}
