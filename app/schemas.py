from pydantic import BaseModel

class UserCreate(BaseModel):
    username: str
    full_name: str
    phone: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str
