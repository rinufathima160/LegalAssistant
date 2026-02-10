from pydantic import BaseModel
from uuid import UUID
from datetime import datetime

# =========================
# 🔔 CREATE REMINDER
# =========================
class ReminderCreate(BaseModel):
    title: str
    description: str | None = None
    remind_at: datetime


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
