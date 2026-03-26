import { motion } from "framer-motion";

export default function MemoryCard() {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur hover:border-cyan-400 transition"
    >
      <h2 className="font-semibold text-lg">Sample Memory</h2>
      <p className="text-sm text-gray-400 mt-2">
        This is a saved article or video preview...
      </p>

      <div className="mt-4 flex gap-2 text-xs">
        <span className="px-2 py-1 bg-cyan-500/20 rounded">AI</span>
        <span className="px-2 py-1 bg-purple-500/20 rounded">Tech</span>
      </div>
    </motion.div>
  );
}