import { useEffect, useState } from "react";
import { Home, Trash2 } from "lucide-react";
import { NotificationBell } from "../components/NotificationBell";
import { loadLocal, saveLocal, type Reminder } from "../lib/mockDatas";

export function ViewRemindersPage({ onNavigate }: { onNavigate: (p: string) => void }) {
  const [reminders, setReminders] = useState<Reminder[]>([]);

  useEffect(() => {
    setReminders(loadLocal("reminders"));
  }, []);

  const remove = (id: string) => {
    const updated = reminders.filter((r) => r.id !== id);
    saveLocal("reminders", updated);
    setReminders(updated);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="flex justify-between p-4 bg-white border-b">
        <button onClick={() => onNavigate("home")}>
          <Home />
        </button>
        <NotificationBell />
      </nav>

      <div className="max-w-3xl mx-auto p-6">
        <h2 className="text-3xl font-bold mb-6">My Reminders</h2>

        {reminders.length === 0 ? (
          <p className="text-gray-600">No reminders created yet.</p>
        ) : (
          reminders.map((r) => (
            <div key={r.id} className="p-4 bg-white shadow mb-4 rounded flex justify-between">
              <div>
                <p className="font-semibold">{r.title}</p>
                <p className="text-sm text-gray-600">{r.date} @ {r.time}</p>
                {r.description && <p>{r.description}</p>}
              </div>
              <button onClick={() => remove(r.id)} className="text-red-600">
                <Trash2 />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
