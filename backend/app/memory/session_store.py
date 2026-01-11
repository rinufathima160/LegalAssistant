# app/memory/session_store.py

class SessionMemory:
    def __init__(self):
        self.sessions = {}  # session_id -> chat history list

    def add_message(self, session_id: str, role: str, content: str):
        if session_id not in self.sessions:
            self.sessions[session_id] = []

        self.sessions[session_id].append({
            "role": role,
            "content": content
        })

    def get_history(self, session_id: str):
        return self.sessions.get(session_id, [])

    def clear(self, session_id: str):
        if session_id in self.sessions:
            del self.sessions[session_id]


memory = SessionMemory()
