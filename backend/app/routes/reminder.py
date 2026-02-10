from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.database.models import Reminder
from app.schemas import ReminderCreate
from app.routes.chat import get_current_user
from app.database.models import User
from datetime import datetime, timedelta

router = APIRouter()

# =====================================
# ➕ ADD REMINDER
# =====================================
@router.post("/")
def create_reminder(
    data: ReminderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    reminder = Reminder(
        title=data.title,
        description=data.description,
        remind_at=data.remind_at,
        user_id=current_user.id
    )

    db.add(reminder)
    db.commit()
    db.refresh(reminder)

    return reminder


# =====================================
# 📋 VIEW ALL REMINDERS
# =====================================
@router.get("/")
def get_reminders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    reminders = (
        db.query(Reminder)
        .filter(Reminder.user_id == current_user.id)
        .order_by(Reminder.remind_at.asc())
        .all()
    )

    return reminders


# =====================================
# 🔔 UPCOMING (next 24 hours)
# =====================================
@router.get("/upcoming")
def upcoming_reminders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    now = datetime.utcnow()
    tomorrow = now + timedelta(hours=24)

    reminders = (
        db.query(Reminder)
        .filter(
            Reminder.user_id == current_user.id,
            Reminder.remind_at >= now,
            Reminder.remind_at <= tomorrow
        )
        .order_by(Reminder.remind_at.asc())
        .all()
    )

    return reminders
