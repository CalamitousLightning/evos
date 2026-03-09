from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..models import Transaction, Wallet
from ..database import SessionLocal
from ..schemas import TransactionCreate
from ..services.provider_service import purchase_data
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
    current_user=Depends(get_current_user)
):

    # Duplicate transaction protection
    existing = db.query(Transaction).filter(
        Transaction.customer_phone == data.customer_phone,
        Transaction.data_plan == data.data_plan,
        Transaction.amount == data.amount
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Duplicate transaction detected"
        )

    # Create transaction
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
    db.add(transaction)

success = purchase_data(
    data.customer_phone,
    data.network,
    data.data_plan
)

if success:
    transaction.status = "successful"
else:
    transaction.status = "failed"

db.commit()

    # Commission calculation
    if success:

    commission_rate = 0.20
    commission = transaction.amount * commission_rate

    wallet = db.query(Wallet).filter(
        Wallet.user_id == transaction.agent_id
    ).first()

    if not wallet:
        wallet = Wallet(user_id=transaction.agent_id, balance=0)
        db.add(wallet)
        db.commit()
        db.refresh(wallet)

    wallet.balance += commission
    wallet.total_commission += commission

    db.commit()

    return {
        "message": "Transaction recorded",
        "transaction_id": transaction.id,
        "commission_earned": commission
    }

@router.get("/my-sales")
def get_my_sales(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    transactions = db.query(Transaction).filter(
        Transaction.agent_id == current_user.id
    ).all()

    return transactions


