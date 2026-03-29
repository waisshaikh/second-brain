import { useNavigate } from "react-router-dom";

export default function AppLayout({ children }) {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-[#020617] text-white">

      {/* SIDEBAR */}
      <div className="w-64 p-6 border-r border-white/10 bg-black/40 backdrop-blur-xl">
        <h1
          onClick={() => navigate("/")}
          className="text-xl font-bold text-cyan-400 mb-8 cursor-pointer"
        >
          Vartual Brain
        </h1>

        <div className="space-y-4 text-gray-300">
          <p onClick={() => navigate("/")} className="cursor-pointer hover:text-cyan-400">
            📚 Library
          </p>

          <p onClick={() => navigate("/graph")} className="cursor-pointer hover:text-cyan-400">
            🧠 Graph
          </p>

          <p className="cursor-pointer hover:text-cyan-400">
            ⚡ Recent
          </p>

          <p className="cursor-pointer hover:text-cyan-400">
            ⚙ Settings
          </p>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 relative">
        {children}
      </div>
    </div>
  );
}