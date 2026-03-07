from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import SessionLocal
from ..models.transaction import Transaction
from ..schemas.transaction_schema import TransactionCreate
from ..auth import get_current_user

router = APIRouter(prefix="/transactions", tags=["Transactions"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/create")
def create_transaction(
    data: TransactionCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    transaction = Transaction(
        agent_id=current_user.id,
        customer_phone=data.customer_phone,
        network=data.network,
        data_plan=data.data_plan,
        amount=data.amount
    )

    db.add(transaction)
    db.commit()
    db.refresh(transaction)

    return {
        "message": "Transaction recorded",
        "transaction_id": transaction.id
    }
