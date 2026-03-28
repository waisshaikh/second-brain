import { useState } from "react";
import { loginUser } from "../services/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await loginUser({ email, password });
      console.log("User:", res);

      alert("Login success ");

      // redirect
      window.location.href = "/";
    } catch (err) {
  console.log("FULL ERROR:", err);
  console.log("RESPONSE:", err.response);
  console.log("DATA:", err.response?.data);
  alert(err.response?.data?.message || "Login failed");
}
  };

  return (
    <div className="p-10 text-white">
      <h1 className="text-2xl mb-4">Login</h1>

      <input
        className="border p-2 mb-2 block"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        className="border p-2 mb-2 block"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin} className="bg-blue-500 px-4 py-2">
        Login
      </button>
    </div>
  );
}