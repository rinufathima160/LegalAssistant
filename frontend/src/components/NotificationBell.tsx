import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { loadLocal } from "../lib/mockDatas";
import type { Reminder } from "../lib/mockDatas";

export function NotificationBell() {
  const [upcoming, setUpcoming] = useState<Reminder[]>([]);
  const [show, setShow] = useState(false);

  const refresh = () => {
    const reminders: Reminder[] = loadLocal("reminders");
    const today = new Date().toISOString().split("T")[0];
    const nextOnes = reminders.filter((r) => r.date >= today && r.status === "upcoming");
    setUpcoming(nextOnes);
  };

  useEffect(() => {
    refresh();
    const timer = setInterval(refresh, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => setShow(!show)}
        className="relative p-2 hover:bg-gray-200 rounded-full"
      >
        <Bell className="w-6 h-6 text-gray-700" />
        {upcoming.length > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            {upcoming.length}
          </span>
        )}
      </button>

      {show && (
        <div className="absolute right-0 mt-2 w-72 bg-white shadow-md rounded-md border">
          <div className="p-3 font-semibold border-b">Upcoming Reminders</div>
          <div className="max-h-64 overflow-y-auto">
            {upcoming.length === 0 ? (
              <p className="p-4 text-gray-500 text-center">No upcoming reminders</p>
            ) : (
              upcoming.map((r) => (
                <div key={r.id} className="p-3 border-b hover:bg-gray-50">
                  <p className="font-medium">{r.title}</p>
                  <p className="text-sm text-gray-600">
                    {r.date} at {r.time}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
