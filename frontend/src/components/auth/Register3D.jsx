import { useState } from "react";
import Scene3D from "./Scene3D";
import { registerUser } from "../../services/auth";

export default function Register3D() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      await registerUser({ name, email, password });
      alert("Registered 🚀");
      window.location.href = "/login";
    } catch (err) {
      alert(err.response?.data?.message || "Register failed");
    }
  };

  return (
    <div className="relative w-full h-screen bg-[#020617] overflow-hidden">

      <div className="absolute inset-0 bg-[radial-gradient(circle,#0ea5e9_1px,transparent_1px)] bg-[size:40px_40px] opacity-10" />

      <Scene3D />

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-[400px] p-8 bg-[#020617]/70 border border-cyan-500/30 rounded-xl backdrop-blur-xl shadow-[0_0_40px_rgba(0,255,247,0.2)]">

          <h2 className="text-cyan-400 text-sm tracking-widest mb-2">
            NEW IDENTITY
          </h2>

          <h1 className="text-3xl font-bold text-white mb-6">
            REGISTER <span className="text-fuchsia-500">USER</span>
          </h1>

          <input
            className="w-full p-3 mb-3 bg-transparent border border-cyan-500/30 text-cyan-300"
            placeholder="NAME"
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="w-full p-3 mb-3 bg-transparent border border-cyan-500/30 text-cyan-300"
            placeholder="EMAIL"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="w-full p-3 mb-4 bg-transparent border border-cyan-500/30 text-cyan-300"
            placeholder="PASSWORD"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleRegister}
            className="w-full py-3 border border-fuchsia-500 text-fuchsia-400 hover:bg-fuchsia-500 hover:text-black transition-all"
          >
            CREATE IDENTITY
          </button>

        </div>
      </div>
    </div>
  );
}