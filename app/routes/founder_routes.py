from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User

router = APIRouter(prefix="/founder", tags=["Founder"])


@router.get("/pending-agents")
def get_pending_agents(db: Session = Depends(get_db)):

    agents = db.query(User).filter(User.status == "pending").all()

    return agents


@router.post("/approve-agent/{user_id}")
def approve_agent(user_id: int, db: Session = Depends(get_db)):

    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        return {"error": "User not found"}

    user.status = "active"

    db.commit()

    return {"message": "Agent approved successfully"}


@router.post("/promote-admin/{user_id}")
def promote_admin(user_id: int, db: Session = Depends(get_db)):

    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        return {"error": "User not found"}

    user.role = "admin"

    db.commit()

    return {"message": "User promoted to admin"}
