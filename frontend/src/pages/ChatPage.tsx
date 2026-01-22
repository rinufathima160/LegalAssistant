import { useState, useEffect } from "react";
import { Home, Send, Plus } from "lucide-react";
import { NotificationBell } from "../components/NotificationBell";

type Chat = {
  id: string;
  title: string;
  created_at: string;
};

type Message = {
  id: string;
  chat_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
};

export function ChatPage({ onNavigate }: { onNavigate: (p: string) => void }) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  /* ===========================
     LOAD USER CHATS
  =========================== */
  useEffect(() => {
    if (!token) return;
    const fetchChats = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/chat/chats", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        setChats(data);
      } catch (error) {
        console.error("Error loading chats:", error);
      }
    };

    fetchChats();
  }, []);

  /* ===========================
     CREATE NEW CHAT
  =========================== */
  const createChat = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/chat/chats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const newChat = await res.json();
      setChats((prev) => [newChat, ...prev]);
      setCurrentChatId(newChat.id);
      setMessages([]);
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  };

  /* ===========================
     LOAD MESSAGES
  =========================== */
  const openChat = async (chatId: string) => {
    setCurrentChatId(chatId);

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/chat/chats/${chatId}/messages`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = await res.json();
      setMessages(data);
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  /* ===========================
     SEND MESSAGE
  =========================== */
 const sendMessage = async () => {
  if (!input || !currentChatId) return;

  const userMsg: Message = {
    id: crypto.randomUUID(),
    chat_id: currentChatId,
    role: "user",
    content: input,
    created_at: new Date().toISOString(),
  };

  setMessages((prev) => [...prev, userMsg]);

  const userInput = input;
  setInput("");
  setLoading(true);

  try {
    // 🔥 CORRECT ENDPOINT
    const res = await fetch("http://127.0.0.1:8000/chat/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        message: userInput,
        chat_id: currentChatId,
      }),
    });

    if (!res.ok) throw new Error("Server error");

    const data = await res.json();

    const aiMsg: Message = {
      id: crypto.randomUUID(),
      chat_id: currentChatId,
      role: "assistant",
      content: data.reply,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, aiMsg]);

  } catch (error) {
    console.error(error);

    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        chat_id: currentChatId,
        role: "assistant",
        content: "⚠️ AI server error",
        created_at: new Date().toISOString(),
      },
    ]);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="h-screen flex flex-col">
      <nav className="p-4 flex justify-between bg-white border-b">
        <button onClick={() => onNavigate("home")}>
          <Home />
        </button>
        <NotificationBell />
      </nav>

      <div className="flex flex-1">
        {/* SIDEBAR */}
        <div className="w-64 border-r bg-white">
          <button
            onClick={createChat}
            className="w-full p-3 bg-blue-500 text-white"
          >
            <Plus /> New Chat
          </button>

          {chats.map((c) => (
            <button
              key={c.id}
              onClick={() => openChat(c.id)}
              className="block w-full p-3 border-b text-left hover:bg-gray-100"
            >
              {c.title || "Untitled Chat"}
            </button>
          ))}
        </div>

        {/* CHAT AREA */}
        <div className="flex-1 flex flex-col bg-gray-50">
          <div className="flex-1 p-4 overflow-y-auto space-y-2">
            {messages.map((m) => (
              <div
                key={m.id}
                className={m.role === "user" ? "text-right" : "text-left"}
              >
                <span
                  className={`px-3 py-2 rounded inline-block ${
                    m.role === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-white border"
                  }`}
                >
                  {m.content}
                </span>
              </div>
            ))}

            {loading && (
              <div className="text-left text-gray-500 italic">
                AI is typing...
              </div>
            )}
          </div>

          {currentChatId && (
            <div className="p-3 bg-white flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 border p-2 rounded"
                placeholder="Ask a legal question..."
              />
              <button
                onClick={sendMessage}
                className="bg-blue-500 text-white px-4 rounded"
                disabled={loading}
              >
                <Send />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
