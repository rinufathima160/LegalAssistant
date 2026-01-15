from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.chat import router as chat_router
from app.rag.rag_pipeline import initialize_rag

app = FastAPI(title="Personal AI Legal Advisor")

# ✅ Initialize RAG at startup
@app.on_event("startup")
def startup_event():
    print("🔄 Initializing RAG system...")
    initialize_rag()
    print("✅ RAG ready")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router)
