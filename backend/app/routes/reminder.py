from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.database.models import Reminder
from app.schemas import ReminderCreate
from app.routes.chat import get_current_user
from app.database.models import User
from datetime import datetime, timedelta
from uuid import UUID
import pytz
router = APIRouter()
IST = pytz.timezone("Asia/Kolkata")

# =====================================
# ➕ ADD REMINDER
# =====================================
@router.post("/")
def create_reminder(
    data: ReminderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    local_time = IST.localize(data.remind_at)

    reminder = Reminder(
        title=data.title,
        description=data.description,
        remind_at=local_time,
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

    now = datetime.now(IST)
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
# 🔔 GET TRIGGERED NOTIFICATIONS
@router.get("/notifications")
def get_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    reminders = db.query(Reminder).filter(
        Reminder.user_id == current_user.id,
        Reminder.is_triggered == True,
        Reminder.is_read == False
    ).all()

   
    return reminders
@router.delete("/{reminder_id}")
def delete_reminder(
    reminder_id: UUID,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    reminder = db.query(Reminder).filter(
        Reminder.id == reminder_id,
        Reminder.user_id == current_user.id
    ).first()

    if not reminder:
        raise HTTPException(status_code=404, detail="Reminder not found")

    db.delete(reminder)
    db.commit()

    return {"message": "Reminder deleted"}
@router.post("/notifications/read")
def mark_notifications_read(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    reminders = db.query(Reminder).filter(
        Reminder.user_id == current_user.id,
        Reminder.is_triggered == True,
        Reminder.is_read == False
    ).all()

    for r in reminders:
        r.is_read = True

    db.commit()
    return {"message": "Notifications marked as read"}