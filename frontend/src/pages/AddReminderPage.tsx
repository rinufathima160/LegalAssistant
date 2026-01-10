import { useState } from "react";
import { Home } from "lucide-react";
import { NotificationBell } from "../components/NotificationBell";
import { loadLocal, saveLocal, type Reminder } from "../lib/mockDatas";

export function AddReminderPage({ onNavigate }: { onNavigate: (p: string) => void }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [description, setDesc] = useState("");
  const [showSuccess, setSuccess] = useState(false);

  const handleSubmit = (e: any) => {
    e.preventDefault();

    const reminders: Reminder[] = loadLocal("reminders");

    reminders.push({
      id: crypto.randomUUID(),
      title,
      date,
      time,
      description,
      status: "upcoming",
    });

    saveLocal("reminders", reminders);
    setSuccess(true);

    setTimeout(() => {
      setSuccess(false);
      onNavigate("view-reminders");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="flex justify-between p-4 bg-white border-b">
        <button onClick={() => onNavigate("home")}>
          <Home />
        </button>
        <NotificationBell />
      </nav>

      <div className="max-w-xl mx-auto p-6 bg-white shadow-md mt-8 rounded-xl">
        <h2 className="text-2xl font-bold mb-4">Add Reminder</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="w-full p-3 border rounded" placeholder="Title"
            value={title} onChange={(e) => setTitle(e.target.value)} required />

          <input className="w-full p-3 border rounded" type="date"
            value={date} onChange={(e) => setDate(e.target.value)} required />

          <input className="w-full p-3 border rounded" type="time"
            value={time} onChange={(e) => setTime(e.target.value)} required />

          <textarea className="w-full p-3 border rounded" placeholder="Description"
            value={description} onChange={(e) => setDesc(e.target.value)} />

          <button className="w-full bg-green-500 text-white py-3 rounded">Add Reminder</button>
        </form>

        {showSuccess && (
          <p className="text-green-600 mt-4">Reminder added successfully!</p>
        )}
      </div>
    </div>
  );
}
