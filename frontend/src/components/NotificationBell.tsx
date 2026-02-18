import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { apiFetch } from "../lib/api";

type ReminderNotification = {
  id: string;
  title: string;
  description?: string;
};

export function NotificationBell() {
  const [notifications, setNotifications] = useState<ReminderNotification[]>([]);
  const [open, setOpen] = useState(false);

  // 🔁 Poll server every 5 sec
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        if (!open) {
          const res = await apiFetch("/reminders/notifications");
          setNotifications(res);
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [open]);

  // 🔔 When user clicks bell
  const toggleBell = async () => {
    const newOpen = !open;
    setOpen(newOpen);

    if (newOpen) {
      const res = await apiFetch("/reminders/notifications");
      setNotifications(res);

      if (res.length > 0) {
        await apiFetch("/reminders/notifications/read", { method: "POST" });
      }
    }
  };

  return (
    <div className="relative">
      <button onClick={toggleBell} className="relative">
        <Bell />

        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg border rounded-lg p-3 z-50">
          <h3 className="font-bold mb-2">Reminders</h3>

          {notifications.length === 0 ? (
            <p className="text-sm text-gray-500">No new notifications</p>
          ) : (
            notifications.map((n) => (
              <div key={n.id} className="border-b py-2 text-sm">
                🔔 {n.title}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}