import { useState, useEffect } from "react";
import Scene3D from "./Scene3D";
import { registerUser } from "../../services/auth";

export default function Register3D() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [flash, setFlash] = useState(null);

  const handleRegister = async () => {
    try {
      await registerUser({ name, email, password });

      setFlash({ type: "success", message: "Registered successfully ✅" });

      setTimeout(() => {
        window.location.href = "/login";
      }, 1200);

    } catch (err) {
      setFlash({
        type: "error",
        message: err.response?.data?.message || "Register failed ❌",
      });
    }
  };

  useEffect(() => {
    if (flash) {
      const timer = setTimeout(() => setFlash(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [flash]);

  return (
    <div className="relative w-full h-screen bg-[#020617] overflow-hidden">

      {/* FLASH MESSAGE */}
      {flash && (
        <div
          className={`absolute top-6 right-6 px-6 py-3 rounded-xl text-sm font-medium
          backdrop-blur-xl border shadow-lg z-50
          transition-all duration-500 animate-slideIn
          ${
            flash.type === "success"
              ? "bg-green-500/20 border-green-400/30 text-green-300"
              : "bg-red-500/20 border-red-400/30 text-red-300"
          }`}
        >
          {flash.type === "success" ? "✅" : "❌"} {flash.message}
        </div>
      )}

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

          {/* DIVIDER */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-white/10"></div>
            <span className="mx-3 text-sm text-gray-400">OR</span>
            <div className="flex-1 h-px bg-white/10"></div>
          </div>

          <p className="text-center text-gray-400 text-sm">
            Already have an account?
          </p>

          <button
            onClick={() => (window.location.href = "/login")}
            className="w-full mt-3 py-2 rounded-lg 
            border border-cyan-500/40 text-cyan-400
            hover:bg-cyan-500 hover:text-black
            transition-all duration-300
            hover:shadow-lg hover:shadow-cyan-500/20"
          >
            LOGIN INSTEAD
          </button>

        </div>
      </div>
    </div>
  );
}