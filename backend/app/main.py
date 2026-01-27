from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.auth import router as auth_router
from app.routes.chat import router as chat_router
from app.database.database import engine, Base
from app.rag.rag_pipeline import initialize_rag

app = FastAPI(title="Personal AI Legal Advisor")

# ======================================
# STARTUP EVENT
# ======================================
@app.on_event("startup")
def startup_event():
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)

    print("Initializing RAG system...")
    initialize_rag()

    print("System Ready")


# ======================================
# CORS
# ======================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ======================================
# ROUTERS
# ======================================
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(chat_router, prefix="/chat", tags=["Chat"])
