import { useState } from "react";
import { Home, Send, Plus } from "lucide-react";
import { loadLocal, saveLocal, type Chat, type Message } from "../lib/mockDatas";
import { NotificationBell } from "../components/NotificationBell";

export function ChatPage({ onNavigate }: { onNavigate: (p: string) => void }) {
  const [chats, setChats] = useState<Chat[]>(() => loadLocal("chats"));
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const createChat = () => {
    const newChat: Chat = {
      id: crypto.randomUUID(),
      title: "New Chat",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const updated = [newChat, ...chats];
    saveLocal("chats", updated);
    setChats(updated);
  };

const sendMessage = async () => {
  if (!input || !currentChatId) return;

  // USER MESSAGE
  const userMsg: Message = {
    id: crypto.randomUUID(),
    chat_id: currentChatId,
    role: "user",
    content: input,
    created_at: new Date().toISOString(),
  };

  const updated = [...messages, userMsg];
  setMessages(updated);
  saveLocal(`chat-${currentChatId}`, updated);

  const userInput = input;
  setInput("");
  setLoading(true);

  try {
    const res = await fetch("http://127.0.0.1:8000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: userInput,          // ✅ FIX 1
        session_id: currentChatId    // ✅ FIX 2 (context memory)
      }),
    });

    const data = await res.json();
    console.log("Backend response:", data);

    const aiMsg: Message = {
      id: crypto.randomUUID(),
      chat_id: currentChatId,
      role: "assistant",
      content: data.reply || "No response received.", // ✅ FIX 3
      created_at: new Date().toISOString(),
    };

    const updated2 = [...updated, aiMsg];
    setMessages(updated2);
    saveLocal(`chat-${currentChatId}`, updated2);

  } catch (error) {
    console.error(error);

    const errorMsg: Message = {
      id: crypto.randomUUID(),
      chat_id: currentChatId,
      role: "assistant",
      content: "⚠️ Error connecting to AI server",
      created_at: new Date().toISOString(),
    };

    const updatedErr = [...updated, errorMsg];
    setMessages(updatedErr);
    saveLocal(`chat-${currentChatId}`, updatedErr);
  } finally {
    setLoading(false);
  }
};

  const openChat = (id: string) => {
    setCurrentChatId(id);
    setMessages(loadLocal(`chat-${id}`));
  };

  return (
    <div className="h-screen flex flex-col">
      <nav className="p-4 flex justify-between bg-white border-b">
        <button onClick={() => onNavigate("home")}><Home /></button>
        <NotificationBell />
      </nav>

      <div className="flex flex-1">
        {/* SIDEBAR */}
        <div className="w-64 border-r bg-white">
          <button onClick={createChat} className="w-full p-3 bg-blue-500 text-white">
            <Plus /> New Chat
          </button>

          {chats.map((c) => (
            <button
              key={c.id}
              onClick={() => openChat(c.id)}
              className="block w-full p-3 border-b text-left hover:bg-gray-100"
            >
              {c.title}
            </button>
          ))}
        </div>

        {/* CHAT AREA */}
        <div className="flex-1 flex flex-col bg-gray-50">
          <div className="flex-1 p-4 overflow-y-auto space-y-2">
            {messages.map((m) => (
              <div key={m.id} className={m.role === "user" ? "text-right" : "text-left"}>
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
