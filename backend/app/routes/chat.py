from fastapi import APIRouter
from app.rag.rag_pipeline import answer_query
from app.memory.session_store import memory

router = APIRouter()

@router.post("/chat")
def chat_with_lawyer(data: dict):
    session_id = data.get("session_id", "default")
    user_message = data["message"]

    # Add message to memory
    memory.add_message(session_id, "user", user_message)

    # Get context history
    history = memory.get_history(session_id)

    # Combine history text for AI
    context_text = "\n".join([msg["role"] + ": " + msg["content"] for msg in history])

    # Pass only latest question into RAG pipeline
    bot_reply = answer_query(user_message)

    # Save bot response in memory
    memory.add_message(session_id, "assistant", bot_reply)

    return {
        "reply": bot_reply,
        "history": history
    }
