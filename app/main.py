from fastapi import FastAPI
from sqlalchemy.orm import Session
from .database import engine, Base, SessionLocal
from .models import User
from .auth import hash_password
from .routes import auth_routes
from .routes import founder_routes
from .routes import order_routes
from .routes import transaction_routes
from .routes import admin_routes
from .routes import wallet_routes
from .routes import provider_routes

from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAP


app = FastAPI(
    title="EVOS Data Services API",
    version="1.0"
)
app.state.limiter = limiter
app.add_middleware(SlowAPIMiddleware)



# Create database tables
Base.metadata.create_all(bind=engine)






# Register routes
app.include_router(auth_routes.router)
app.include_router(founder_routes.router)
app.include_router(order_routes.router)
app.include_router(transaction_routes.router)
app.include_router(admin_routes.router)
app.include_router(wallet_routes.router)
app.include_router(provider_routes.router)




def create_founder():
    db: Session = SessionLocal()

    try:
        founder = db.query(User).filter(User.role == "founder").first()

        if not founder:
            founder_user = User(
                username="founder",
                full_name="EVOS Founder",
                phone="0000000000",
                password_hash=hash_password("Evos123"),
                role="founder",
                status="active"
            )

            db.add(founder_user)
            db.commit()

    finally:
        db.close()


# Run founder creation when server starts
@app.on_event("startup")
def startup_event():
    create_founder()


@app.get("/")
def root():
    return {"message": "EVOS Data Services Running"}
