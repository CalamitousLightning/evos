from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Wallet, User
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
