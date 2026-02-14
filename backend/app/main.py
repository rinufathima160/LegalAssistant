from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.routes.auth import router as auth_router
from app.routes.chat import router as chat_router
from app.routes.reminder import router as reminder_router

from app.database.database import engine, Base
from app.rag.rag_pipeline import initialize_rag
from app.services.reminder_scheduler import start_scheduler


# ======================================
# LIFESPAN (Correct startup handler)
# ======================================
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("\n========== SYSTEM STARTING ==========")

    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)

    print("Initializing RAG system...")
    initialize_rag()

    print("Starting Reminder Scheduler...")
    start_scheduler()

    print("System Ready")
    print("=====================================\n")

    yield  # Application runs here

    print("Shutting down system...")


# ======================================
# APP
# ======================================
app = FastAPI(
    title="Personal AI Legal Advisor",
    lifespan=lifespan
)


# ======================================
# CORS (Allow frontend React)
# ======================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ======================================
# ROUTERS
# ======================================
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(chat_router, prefix="/chat", tags=["Chat"])
app.include_router(reminder_router, prefix="/reminders", tags=["Reminders"])