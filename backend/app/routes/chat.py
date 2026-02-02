from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from app.database.database import get_db
from app.database.models import User, Chat, Message
from app.schemas import ChatRequest
from app.rag.rag_pipeline import answer_query
from dotenv import load_dotenv
import os

load_dotenv()
###################################################################

router = APIRouter()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


# ======================================
# 🔐 GET CURRENT USER
# ======================================
def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")

        if email is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )

    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )

    user = db.query(User).filter(User.email == email).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )

    return user


# ======================================
# 1️⃣ CREATE NEW CHAT
# ======================================
@router.post("/chats")
def create_chat(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    new_chat = Chat(user_id=current_user.id)

    db.add(new_chat)
    db.commit()
    db.refresh(new_chat)

    return new_chat


# ======================================
# 2️⃣ GET USER CHATS
# ======================================
@router.get("/chats")
def get_user_chats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    chats = (
        db.query(Chat)
        .filter(Chat.user_id == current_user.id)
        .order_by(Chat.created_at.desc())
        .all()
    )

    return chats


# ======================================
# 3️⃣ GET CHAT MESSAGES
# ======================================
@router.get("/chats/{chat_id}/messages")
def get_chat_messages(
    chat_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    chat = db.query(Chat).filter(
        Chat.id == chat_id,
        Chat.user_id == current_user.id
    ).first()

    if not chat:
        raise HTTPException(
            status_code=404,
            detail="Chat not found"
        )

    messages = (
        db.query(Message)
        .filter(Message.chat_id == chat_id)
        .order_by(Message.created_at.asc())
        .all()
    )

    return messages


# ======================================
# 4️⃣ SEND MESSAGE
# ======================================
@router.post("/message")
def chat_with_lawyer(
    data: ChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    chat = db.query(Chat).filter(
        Chat.id == data.chat_id,
        Chat.user_id == current_user.id
    ).first()

    if not chat:
        raise HTTPException(
            status_code=404,
            detail="Chat not found"
        )

    # Save user message
    user_msg = Message(
        chat_id=chat.id,
        role="user",
        content=data.message
    )

    db.add(user_msg)
    db.commit()

    # Get last 3 messages
    last_messages = (
        db.query(Message)
        .filter(Message.chat_id == chat.id)
        .order_by(Message.created_at.desc())
        .limit(3)
        .all()
    )

    contextual_query = " ".join(
        [msg.content for msg in reversed(last_messages)]
    )

    bot_reply = answer_query(contextual_query)

    # Save bot reply
    bot_msg = Message(
        chat_id=chat.id,
        role="assistant",
        content=bot_reply
    )

    db.add(bot_msg)
    db.commit()

    return {"reply": bot_reply}
