import { useState, useEffect } from "react";
import { HomePage } from "./pages/HomePage";
import { ChatPage } from "./pages/ChatPage";
import { AddReminderPage } from "./pages/AddReminderPage";
import { ViewRemindersPage } from "./pages/ViewRemindersPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";

export default function App() {
  const [page, setPage] = useState<"login" | "register" | "home" | "chat" | "add-reminder" | "view-reminders">("login");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  // 🔐 Check token once when app loads
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsAuthenticated(true);
      setPage("home");
    } else {
      setIsAuthenticated(false);
      setPage("login");
    }

    setLoading(false);
  }, []);

  // ⏳ prevent UI flicker while checking token
  if (loading) return <div className="p-10 text-center">Loading...</div>;

  // =====================================================
  // 🚫 NOT LOGGED IN → ONLY LOGIN / REGISTER
  // =====================================================
  if (!isAuthenticated) {
    if (page === "register") {
      return <RegisterPage onRegister={() => setPage("login")} />;
    }

    return (
      <LoginPage
        onLogin={() => {
          setIsAuthenticated(true);
          setPage("home");
        }}
        goToRegister={() => setPage("register")}
      />
    );
  }

  // =====================================================
  // ✅ LOGGED IN → APP PAGES
  // =====================================================
  const navigate = (newPage: string) => setPage(newPage as "login" | "register" | "home" | "chat" | "add-reminder" | "view-reminders");
  
  if (page === "home") return <HomePage onNavigate={navigate} />;
  if (page === "chat") return <ChatPage onNavigate={navigate} />;
  if (page === "add-reminder") return <AddReminderPage onNavigate={navigate} />;
  if (page === "view-reminders") return <ViewRemindersPage onNavigate={navigate} />;

  return <HomePage onNavigate={navigate} />;
}
