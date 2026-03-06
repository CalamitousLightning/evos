from fastapi import FastAPI
from .database import engine, Base

app = FastAPI(
    title="EVOS Data Services API",
    version="1.0"
)

Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {"message": "EVOS Data Services Running"}
