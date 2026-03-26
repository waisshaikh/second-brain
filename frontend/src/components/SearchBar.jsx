import { motion } from "framer-motion";

export default function SearchBar() {
  return (
    <motion.input
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      placeholder="Search your brain..."
      className="w-full p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur outline-none focus:border-cyan-400"
    />
  );
}