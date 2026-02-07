from pydantic import BaseModel
from uuid import UUID


class UserCreate(BaseModel):
    email: str
    password: str

###################################################################

class UserLogin(BaseModel):
    email: str
    password: str

###################################################################

class ChatCreate(BaseModel):
    title: str

###################################################################

class ChatRequest(BaseModel):
    chat_id: UUID
    message: str
