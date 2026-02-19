import { useState } from "react";
import { Scale } from "lucide-react";

export function LoginPage({
onLogin,
goToRegister,
}: {
onLogin: () => void;
goToRegister: () => void;
}) {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

const handleLogin = async () => {
const res = await fetch("http://127.0.0.1:8000/auth/login", {
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({ email, password }),
});

const data = await res.json();

if (data.access_token) {
  localStorage.setItem("token", data.access_token);
  onLogin();
} else {
  alert("Invalid credentials");
}

};

return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">

  <div className="bg-white p-8 shadow-2xl rounded-2xl w-96">

    {/* Header */}
    <div className="flex flex-col items-center mb-6">
      <Scale size={48} className="text-blue-900 mb-2" />
      <h2 className="text-2xl font-bold text-blue-900">AI Legal Advisor</h2>
      <p className="text-gray-500 text-sm">Login to continue</p>
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

    {/* Login Button */}
    <button
      onClick={handleLogin}
      className="bg-blue-900 text-white w-full p-3 rounded-lg hover:bg-blue-800 transition mb-3"
    >
      Login
    </button>

    {/* Register Link */}
    <button
      onClick={goToRegister}
      className="text-sm text-blue-900 underline w-full"
    >
      Create new account
    </button>

  </div>
</div>

);
}
