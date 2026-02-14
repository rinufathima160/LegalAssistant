from apscheduler.schedulers.asyncio import AsyncIOScheduler
from datetime import datetime
import pytz

from app.database.database import SessionLocal
from app.database.models import Reminder

# use IST timezone
IST = pytz.timezone("Asia/Kolkata")

scheduler = AsyncIOScheduler(timezone=IST)


def check_due_reminders():
    db = SessionLocal()

    # IMPORTANT: use IST current time
    now = datetime.now(IST)

    reminders = db.query(Reminder).filter(
        Reminder.remind_at <= now,
        Reminder.is_triggered == False
    ).all()

    for r in reminders:
        print(f"🔔 Reminder Triggered: {r.title} at {now}")
        r.is_triggered = True

    db.commit()
    db.close()


def start_scheduler():
    scheduler.add_job(check_due_reminders, "interval", seconds=5)  # faster for testing
    scheduler.start()