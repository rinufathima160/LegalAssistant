import { useState, useEffect } from "react";
import { Home, Send, Plus } from "lucide-react";
import { loadLocal, saveLocal,type Chat,type Message } from "../lib/mockDatas";
import { NotificationBell } from "../components/NotificationBell";

export function ChatPage({ onNavigate }: { onNavigate: (p: string) => void }) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [input, setInput] = useState("");

  useEffect(() => {
    setChats(loadLocal("chats"));
  }, []);

  const createChat = () => {
    const newChat: Chat = {
      id: crypto.randomUUID(),
      title: "New Chat",
      updated_at: new Date().toISOString(),
    };

    const updated = [newChat, ...chats];
    saveLocal("chats", updated);
    setChats(updated);
  };

  const sendMessage = () => {
    if (!input || !currentChatId) return;

    const newMsg: Message = {
      id: crypto.randomUUID(),
      chat_id: currentChatId,
      role: "user",
      content: input,
      created_at: new Date().toISOString(),
    };

    const updated = [...messages, newMsg];
    setMessages(updated);
    saveLocal(`chat-${currentChatId}`, updated);

    setInput("");

    // mock AI reply
    setTimeout(() => {
      const reply: Message = {
        id: crypto.randomUUID(),
        chat_id: currentChatId,
        role: "assistant",
        content: "This is a mock AI reply.",
        created_at: new Date().toISOString(),
      };

      const updated2 = [...updated, reply];
      setMessages(updated2);
      saveLocal(`chat-${currentChatId}`, updated2);
    }, 800);
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
        <div className="w-64 border-r bg-white">
          <button onClick={createChat} className="w-full p-3 bg-blue-500 text-white">
            <Plus /> New Chat
          </button>

          {chats.map((c) => (
            <button key={c.id} onClick={() => openChat(c.id)}
              className="block w-full p-3 border-b text-left hover:bg-gray-100">
              {c.title}
            </button>
          ))}
        </div>

        <div className="flex-1 flex flex-col bg-gray-50">
          <div className="flex-1 p-4 overflow-y-auto space-y-2">
            {messages.map((m) => (
              <div key={m.id} className={m.role === "user" ? "text-right" : "text-left"}>
                <span className={`px-3 py-2 rounded inline-block ${
                  m.role === "user" ? "bg-blue-500 text-white" : "bg-white border"
                }`}>
                  {m.content}
                </span>
              </div>
            ))}
          </div>

          {currentChatId && (
            <div className="p-3 bg-white flex gap-2">
              <input value={input} onChange={(e) => setInput(e.target.value)}
                className="flex-1 border p-2 rounded" />
              <button onClick={sendMessage} className="bg-blue-500 text-white px-4 rounded">
                <Send />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
