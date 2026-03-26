import { motion } from "framer-motion";

export default function Dashboard() {
  return (
    <div className="relative min-h-screen px-6 py-6 overflow-hidden">

      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute w-[400px] h-[400px] bg-cyan-500/20 blur-3xl rounded-full top-[-100px] left-[-100px] animate-pulse"></div>
        <div className="absolute w-[300px] h-[300px] bg-purple-500/20 blur-3xl rounded-full bottom-[-100px] right-[-100px] animate-pulse"></div>
      </div>

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold tracking-wide">
          <span className="text-cyan-400">Second</span> Brain
        </h1>

        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500"></div>
      </div>

      {/* SEARCH */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-10"
      >
        <input
          placeholder="Search your brain..."
          className="w-full p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-lg 
          focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 outline-none transition"
        />
      </motion.div>

      {/* SAVE BOX */}
      <div className="flex gap-4 mt-6">
        <input
          placeholder="Paste anything (link, tweet, pdf)..."
          className="flex-1 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-lg"
        />

        <button
          className="px-6 rounded-xl bg-gradient-to-r from-cyan-400 to-purple-500 
          hover:opacity-90 transition shadow-lg shadow-cyan-500/20"
        >
          Save
        </button>
      </div>

      {/* CARDS GRID */}
      <div className="grid md:grid-cols-3 gap-6 mt-12">
        {[1, 2, 3].map((item) => (
          <motion.div
            key={item}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="relative p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-lg
            hover:border-cyan-400/40 transition group"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition
            bg-gradient-to-r from-cyan-500/10 to-purple-500/10 blur-xl"></div>

            <h2 className="text-lg font-semibold relative z-10">
              AI Memory
            </h2>

            <p className="text-sm text-gray-400 mt-2 relative z-10">
              This is a futuristic memory card preview...
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}