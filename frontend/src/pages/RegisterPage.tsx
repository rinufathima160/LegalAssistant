import { useState } from "react";

export function RegisterPage({ onRegister }: { onRegister: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      // ✅ SUCCESS
      if (res.ok) {
        alert("Registration successful! Please login.");
        onRegister();
      }
      // ❌ EMAIL EXISTS OR VALIDATION ERROR
      else {
        alert(data.detail || "Registration failed");
      }
    } catch {
      alert("Server not running");
    }

    setLoading(false);
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="bg-white p-6 shadow rounded w-80">
        <h2 className="text-xl mb-4 text-center">Register</h2>

        <input
          placeholder="Email"
          className="border p-2 w-full mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleRegister}
          disabled={loading}
          className="bg-green-500 text-white w-full p-2 rounded"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </div>
    </div>
  );
}
