import { useState } from "react";

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
      alert("Login success");
      onLogin();
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="bg-white p-6 shadow rounded w-80">
        <h2 className="text-xl mb-4">Login</h2>

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
          onClick={handleLogin}
          className="bg-blue-500 text-white w-full p-2 rounded mb-2"
        >
          Login
        </button>

        {/* ⭐ THIS OPENS REGISTER PAGE */}
        <button
          onClick={goToRegister}
          className="text-sm text-blue-600 underline w-full"
        >
          Create new account
        </button>
      </div>
    </div>
  );
}
