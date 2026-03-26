import { motion } from "framer-motion";
import { useState } from "react";

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [url, setUrl] = useState("");

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative min-h-screen px-6 py-6 overflow-hidden"
    >
      {/*  BACKGROUND */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute w-[500px] h-[500px] bg-cyan-500/20 blur-[120px] rounded-full top-[-150px] left-[-150px]" />
        <div className="absolute w-[400px] h-[400px] bg-purple-500/20 blur-[120px] rounded-full bottom-[-150px] right-[-150px]" />
      </div>

      {/*  HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold tracking-wide">
          <span className="text-cyan-400">Second</span>{" "}
          <span className="text-purple-400">Brain</span>
        </h1>

        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 shadow-lg shadow-cyan-500/30" />
      </div>

      {/*  SEARCH  */}
      <div className="mt-12 relative">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search anything... (AI powered)"
          className="w-full p-5 pl-14 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl 
          focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 
          outline-none transition shadow-[0_0_30px_rgba(34,211,238,0.1)]"
        />

        {/*  Search Icon */}
        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-cyan-400 text-lg">
          ⌕
        </div>
      </div>

      {/*  SAVE INPUT */}
      <div className="mt-6 flex gap-4">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste anything (link, tweet, pdf)..."
          className="flex-1 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xl
          focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30 transition"
        />

        <button
          className="px-6 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-500 
          hover:scale-105 active:scale-95 transition 
          shadow-lg shadow-cyan-500/30"
        >
          Save
        </button>
      </div>


      {/*  GRID */}
      <div className="grid md:grid-cols-3 gap-6 mt-14">
        {[1, 2, 3].map((item) => (
          <motion.div
            key={item}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="relative p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl
            hover:border-cyan-400/40 transition group overflow-hidden"
          >
            {/*  Glow overlay */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition 
            bg-gradient-to-r from-cyan-500/10 to-purple-500/10 blur-xl" />

            {/*  Top glow line */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyan-400 to-purple-400 opacity-30 group-hover:opacity-100" />

            <h2 className="text-lg font-semibold relative z-10">
              AI Memory
            </h2>

            <p className="text-sm text-gray-400 mt-2 relative z-10">
              This is a futuristic memory card preview...
            </p>

            {/* TAGS */}
            <div className="flex gap-2 mt-4 text-xs relative z-10">
              <span className="px-2 py-1 rounded bg-cyan-500/20 text-cyan-300">
                AI
              </span>
              <span className="px-2 py-1 rounded bg-purple-500/20 text-purple-300">
                Tech
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}