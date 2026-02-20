///
import { useState } from "react";
import { Scale } from "lucide-react";

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

  if (res.ok) {
    alert("Registration successful! Please login.");
    onRegister();
  } else {
    alert(data.detail || "Registration failed");
  }
} catch {
  alert("Server not running");
}

setLoading(false);

};

return ( <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">

  <div className="bg-white p-8 shadow-2xl rounded-2xl w-96">

    {/* Header */}
    <div className="flex flex-col items-center mb-6">
      <Scale size={48} className="text-blue-900 mb-2" />
      <h2 className="text-2xl font-bold text-blue-900">Create Account</h2>
      <p className="text-gray-500 text-sm">Join AI Legal Advisor</p>
    </div>

    {/* Inputs */}
    <input
      placeholder="Email"
      className="border p-3 w-full mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />

    <input
      type="password"
      placeholder="Password"
      className="border p-3 w-full mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />

    {/* Register Button */}
    <button
      onClick={handleRegister}
      disabled={loading}
      className="bg-green-600 text-white w-full p-3 rounded-lg hover:bg-green-700 transition mb-3 disabled:opacity-60"
    >
      {loading ? "Creating Account..." : "Register"}
    </button>

  </div>
</div>

);
}
