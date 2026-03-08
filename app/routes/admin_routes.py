from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import SessionLocal
from ..models import Transaction, User
from ..auth import get_current_user

from ..models import Transaction, User
from ..auth import get_current_user
from fastapi import HTTPException, Depends
from sqlalchemy.orm import Session
router = APIRouter(prefix="/admin", tags=["Admin"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/all-transactions")
def get_all_transactions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    if current_user.role != "founder":
        raise HTTPException(status_code=403, detail="Not authorized")

    transactions = db.query(Transaction).all()

    return transactions


@router.get("/analytics")
def get_platform_analytics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    if current_user.role not in ["founder", "admin"]:
        raise HTTPException(status_code=403, detail="Not authorized")

    total_transactions = db.query(Transaction).count()

    transactions = db.query(Transaction).all()

    total_revenue = sum(t.amount for t in transactions)

    return {
        "total_transactions": total_transactions,
        "total_revenue": total_revenue
    }
