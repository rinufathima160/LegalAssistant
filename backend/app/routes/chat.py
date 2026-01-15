from fastapi import APIRouter
from app.rag.rag_pipeline import answer_query
from app.memory.session_store import memory

router = APIRouter()

@router.post("/chat")
def chat_with_lawyer(data: dict):
    session_id = data.get("session_id", "default")
    user_message = data.get("message")

    if not user_message:
        return {"reply": "No message received."}

    # store user message
    memory.add_message(session_id, "user", user_message)

    # get AI response
    bot_reply = answer_query(user_message)

    # store AI response
    memory.add_message(session_id, "assistant", bot_reply)

    return {
        "reply": bot_reply
    }
