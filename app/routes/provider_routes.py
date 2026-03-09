from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Transaction

router = APIRouter(prefix="/provider", tags=["Provider"])


@router.post("/webhook")
def provider_webhook(
    data: dict,
    db: Session = Depends(get_db)
):

    transaction_id = data.get("transaction_id")
    status = data.get("status")

    transaction = db.query(Transaction).filter(
        Transaction.id == transaction_id
    ).first()

    if not transaction:
        return {"message": "Transaction not found"}

    transaction.status = status

    db.commit()

    return {"message": "Webhook processed"}
