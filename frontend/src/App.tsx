import { useState } from "react";
import { HomePage } from "./pages/HomePage";
import { ChatPage } from "./pages/ChatPage";
import { AddReminderPage } from "./pages/AddReminderPage";
import { ViewRemindersPage } from "./pages/ViewRemindersPage";

export default function App() {
  const [page, setPage] = useState("home");

  if (page === "home") return <HomePage onNavigate={setPage} />;
  if (page === "chat") return <ChatPage onNavigate={setPage} />;
  if (page === "add-reminder") return <AddReminderPage onNavigate={setPage} />;
  if (page === "view-reminders") return <ViewRemindersPage onNavigate={setPage} />;

  return <HomePage onNavigate={setPage} />;
}
