from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..models import Withdrawal
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

@router.post("/approve-withdrawal/{withdrawal_id}")
def approve_withdrawal(
    withdrawal_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    if current_user.role not in ["founder", "admin"]:
        raise HTTPException(status_code=403, detail="Not authorized")

    withdrawal = db.query(Withdrawal).filter(
        Withdrawal.id == withdrawal_id
    ).first()

    if not withdrawal:
        raise HTTPException(status_code=404, detail="Withdrawal not found")

    wallet = db.query(Wallet).filter(
        Wallet.user_id == withdrawal.user_id
    ).first()

    wallet.balance -= withdrawal.amount
    withdrawal.status = "approved"

    db.commit()

    return {"message": "Withdrawal approved"}



@router.get("/withdrawals")
def get_withdrawals(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    if current_user.role not in ["admin", "founder"]:
        raise HTTPException(status_code=403, detail="Not authorized")

    withdrawals = db.query(Withdrawal).all()

    return withdrawals


@router.post("/update-transaction/{transaction_id}")
def update_transaction_status(
    transaction_id: int,
    status: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    if current_user.role not in ["admin", "founder"]:
        raise HTTPException(status_code=403, detail="Not authorized")

    transaction = db.query(Transaction).filter(
        Transaction.id == transaction_id
    ).first()

    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")

    transaction.status = status
    db.commit()

    return {"message": "Transaction status updated"}
