from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Wallet, Withdrawal, User
from ..auth import get_current_user

router = APIRouter(prefix="/wallet", tags=["Wallet"])


@router.get("/me")
def get_my_wallet(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    wallet = db.query(Wallet).filter(Wallet.user_id == current_user.id).first()

    if not wallet:
        wallet = Wallet(user_id=current_user.id)
        db.add(wallet)
        db.commit()
        db.refresh(wallet)

    return wallet


@router.post("/withdraw")
def request_withdrawal(
    amount: float,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    wallet = db.query(Wallet).filter(Wallet.user_id == current_user.id).first()

    if not wallet or wallet.balance < amount:
        raise HTTPException(status_code=400, detail="Insufficient balance")

    withdrawal = Withdrawal(
        user_id=current_user.id,
        amount=amount
    )

    db.add(withdrawal)
    db.commit()
    db.refresh(withdrawal)

    return {
        "message": "Withdrawal request submitted",
        "withdrawal_id": withdrawal.id
    }
