from fastapi import APIRouter
from app.rag.rag_pipeline import answer_query

router = APIRouter()

@router.get("/ask")
def ask_question(q: str):
    answer = answer_query(q)
    return {"question": q, "answer": answer}
