// Reminder type
export interface Reminder {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  status: string; // "upcoming" | "past"
}

// Chat type
export interface Chat {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

// Message type
export interface Message {
  id: string;
  chat_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

// Load data from localStorage
export function loadLocal(key: string) {
  return JSON.parse(localStorage.getItem(key) || "[]");
}

// Save data to localStorage
export function saveLocal<T>(key: string, data: T): void {
  localStorage.setItem(key, JSON.stringify(data));
}
