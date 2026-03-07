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


@router.post("/update-status/{order_id}")
def update_order_status(
    order_id: int,
    status: str,
    db: Session = Depends(get_db)
):

    order = db.query(Order).filter(Order.id == order_id).first()

    if not order:
        return {"error": "Order not found"}

    order.status = status
    db.commit()

    return {"message": "Order status updated", "status": status}

@router.get("/agent-dashboard/{agent_id}")
def agent_dashboard(agent_id: int, db: Session = Depends(get_db)):

    orders = db.query(Order).filter(Order.agent_id == agent_id).all()

    total_orders = len(orders)

    successful_orders = len([o for o in orders if o.status == "successful"])

    pending_orders = len([o for o in orders if o.status == "pending"])

    failed_orders = len([o for o in orders if o.status == "failed"])

    earnings = sum(o.amount for o in orders if o.status == "successful")

    return {
        "total_orders": total_orders,
        "successful_orders": successful_orders,
        "pending_orders": pending_orders,
        "failed_orders": failed_orders,
        "earnings": earnings
    }



