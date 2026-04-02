import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Scene3D from "./Scene3D";
import { loginUser } from "../../services/auth";

export default function Login3D() {
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [flash, setFlash] = useState(null);
  const navigate = useNavigate();

 const handleLogin = async () => {
  try {
    const res = await loginUser({ email, password });

    console.log("LOGIN RESPONSE ", res);

    const token = res?.token;

    if (!token) {
      setFlash({ type: "error", message: "Token not received ❌" });
      return;
    }

    localStorage.setItem("token", token);

    setFlash({ type: "success", message: "Login successful ✅" });

    // delay for UI feel
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 1200);

  } catch (err) {
    console.log(err);

    setFlash({
      type: "error",
      message: err.response?.data?.message || "Login failed ❌",
    });
  }
};

return (
  <div className="relative w-full h-screen bg-[#020617] overflow-hidden">
    <Scene3D />

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
        <span className="flex items-center gap-2">
          {flash.type === "success" ? "✅" : "❌"}
          {flash.message}
        </span>
      </div>
    )}

    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative w-[400px] p-8 rounded-2xl 
        bg-white/5 border border-white/10 
        backdrop-blur-2xl shadow-2xl 
        shadow-cyan-500/10">

        {/* Glow Effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-2xl blur opacity-20"></div>

        <div className="relative z-10">

          {/* Heading */}
          <h1 className="text-3xl font-bold text-white mb-6 text-center tracking-wide">
            LOGIN TO <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">V-BRAIN</span>
          </h1>

          {/* Email */}
          <input
            className="w-full p-3 mb-3 rounded-lg 
            bg-white/5 border border-white/10 
            text-white placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-cyan-500
            transition-all duration-300"
            placeholder="EMAIL"
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Password */}
          <input
            type="password"
            className="w-full p-3 mb-5 rounded-lg 
            bg-white/5 border border-white/10 
            text-white placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-fuchsia-500
            transition-all duration-300"
            placeholder="PASSWORD"
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Login Button */}
          <button
            onClick={handleLogin}
            className="w-full py-3 rounded-lg font-semibold text-white 
            bg-gradient-to-r from-cyan-500 to-fuchsia-500 
            hover:from-fuchsia-500 hover:to-cyan-500
            transition-all duration-500 
            shadow-lg shadow-cyan-500/20 
            hover:shadow-fuchsia-500/30
            hover:scale-[1.03] active:scale-[0.97]"
          >
            Login
          </button>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-white/10"></div>
            <span className="mx-3 text-sm text-gray-400">OR</span>
            <div className="flex-1 h-px bg-white/10"></div>
          </div>

          {/* Register Redirect */}
          <p className="text-center text-gray-400 text-sm">
            Not registered yet?
          </p>

          <button
            onClick={() => navigate("/register")}
            className="w-full mt-3 py-2 rounded-lg 
            border border-fuchsia-500/40 text-fuchsia-400
            hover:bg-fuchsia-500 hover:text-white
            transition-all duration-300
            hover:shadow-lg hover:shadow-fuchsia-500/20"
          >
            CREATE ACCOUNT
          </button>

        </div>
      </div>
    </div>
  </div>
);

}