from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Order

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.post("/create")
def create_order(
    agent_id: int,
    customer_phone: str,
    network: str,
    bundle: str,
    amount: float,
    db: Session = Depends(get_db)
):

    order = Order(
        agent_id=agent_id,
        customer_phone=customer_phone,
        network=network,
        bundle=bundle,
        amount=amount
    )

    db.add(order)
    db.commit()

    return {"message": "Order created successfully"}

@router.get("/agent/{agent_id}")
def get_agent_orders(agent_id: int, db: Session = Depends(get_db)):

    orders = db.query(Order).filter(Order.agent_id == agent_id).all()

    return orders
