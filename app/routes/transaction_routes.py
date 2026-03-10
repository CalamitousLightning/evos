from fastapi import APIRouter, Depends, HTTPException
from fastapi import Request
from sqlalchemy.orm import Session
from ..models import Transaction, Wallet
from ..database import SessionLocal
from ..schemas import TransactionCreate
from ..services.provider_service import purchase_data
from ..auth import get_current_user
from ..main import limiter
from fastapi import Request
import uuid


router = APIRouter(prefix="/transactions", tags=["Transactions"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/create")
@limiter.limit("20/minute")
def create_transaction(
    data: TransactionCreate,
    request: Request,
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
    transaction_reference=str(uuid.uuid4()),
    agent_id=current_user.id,
    customer_phone=data.customer_phone,
    network=data.network,
    data_plan=data.data_plan,
    amount=data.amount,
    status="pending"
)
    db.add(transaction)
    db.commit()
    db.refresh(transaction)

    # Call provider API
    success = purchase_data(
        data.customer_phone,
        data.network,
        data.data_plan
    )

    if not success:
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
    "message": "Transaction successful",
    "transaction_reference": transaction.transaction_reference,
    "commission_earned": commission
}

    return {
        "message": "Transaction failed",
        "transaction_id": transaction.id
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

@router.post("/provider-webhook")
async def provider_webhook(request: Request, db: Session = Depends(get_db)):

    payload = await request.json()

    reference = payload.get("transaction_reference")
    status = payload.get("status")

    transaction = db.query(Transaction).filter(
        Transaction.transaction_reference == reference
    ).first()

    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")

    if status == "successful":
        transaction.status = "successful"
    else:
        transaction.status = "failed"

    db.commit()

    return {"message": "Webhook processed"}
