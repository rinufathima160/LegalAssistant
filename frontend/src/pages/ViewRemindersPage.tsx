import { useEffect, useState } from "react";
import { Home, Trash2 } from "lucide-react";
import { NotificationBell } from "../components/NotificationBell";
import { apiFetch } from "../lib/api";

type Reminder = {
  id: number;
  title: string;
  description?: string;
  remind_at: string;
};

export function ViewRemindersPage({ onNavigate }: { onNavigate: (p: string) => void }) {
  const [reminders, setReminders] = useState<Reminder[]>([]);

  // LOAD FROM DATABASE
  const loadReminders = async () => {
    const data = await apiFetch("/reminders/");
    setReminders(data);
  };

  useEffect(() => {
  const fetchData = async () => {
    await loadReminders();
  };

  fetchData();
}, []);
  // DELETE FROM DATABASE
  const remove = async (id: number) => {
    await apiFetch(`/reminders/${id}`, { method: "DELETE" });
    setReminders(reminders.filter((r) => r.id !== id));
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
          reminders.map((r) => {
            const date = new Date(r.remind_at);

            return (
              <div key={r.id} className="p-4 bg-white shadow mb-4 rounded flex justify-between">
                <div>
                  <p className="font-semibold">{r.title}</p>

                  <p className="text-sm text-gray-600">
                    {date.toLocaleDateString()} @ {date.toLocaleTimeString()}
                  </p>

                  {r.description && <p>{r.description}</p>}
                </div>

                <button onClick={() => remove(r.id)} className="text-red-600">
                  <Trash2 />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}