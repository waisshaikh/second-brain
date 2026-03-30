import { useState } from "react";
import Scene3D from "./Scene3D";
import { loginUser } from "../../services/auth";

export default function Login3D() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await loginUser({ email, password });
      alert("Login success 🚀");
      window.location.href = "/";
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="relative w-full h-screen bg-[#020617] overflow-hidden">

      {/* GRID */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,#0ea5e9_1px,transparent_1px)] bg-[size:40px_40px] opacity-10" />

      {/* 3D */}
      <Scene3D />

      {/* FORM */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-[400px] p-8 bg-[#020617]/70 border border-cyan-500/30 rounded-xl backdrop-blur-xl shadow-[0_0_40px_rgba(0,255,247,0.2)]">

          {/* Corners */}
          <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-cyan-400"></div>
          <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-cyan-400"></div>
          <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-cyan-400"></div>
          <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-cyan-400"></div>

          <h2 className="text-cyan-400 text-sm tracking-widest mb-2">
            SECURE ACCESS
          </h2>

          <h1 className="text-3xl font-bold text-white mb-6">
            LOGIN <span className="text-fuchsia-500">PORTAL</span>
          </h1>

          <input
            className="w-full p-3 mb-3 bg-transparent border border-cyan-500/30 text-cyan-300 placeholder-cyan-500 focus:border-fuchsia-500 focus:shadow-[0_0_10px_#ff00ff] outline-none transition"
            placeholder="EMAIL"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="w-full p-3 mb-4 bg-transparent border border-cyan-500/30 text-cyan-300 placeholder-cyan-500 focus:border-fuchsia-500 focus:shadow-[0_0_10px_#ff00ff] outline-none transition"
            placeholder="PASSWORD"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleLogin}
            className="w-full py-3 border border-fuchsia-500 text-fuchsia-400 tracking-widest hover:bg-fuchsia-500 hover:text-black hover:shadow-[0_0_20px_#ff00ff] transition-all"
          >
            AUTHENTICATE
          </button>

        </div>
      </div>
    </div>
  );
}