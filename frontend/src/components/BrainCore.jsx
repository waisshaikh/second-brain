import { motion } from "framer-motion";
import brain from "../assets/brain.png";

export default function BrainCore() {
  return (
    <div className="relative flex items-center justify-center h-[500px]">

      {/*CENTER BRAIN */}
      <motion.img
        src={brain}
        alt="brain"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1 }}
        className="w-[300px] relative z-10 drop-shadow-[0_0_40px_rgba(34,211,238,0.6)]"
      />

      {/* GLOW PULSE */}
      <div className="absolute w-[350px] h-[350px] rounded-full bg-cyan-500/10 blur-3xl animate-pulse"></div>

      {/* LINES */}
      {/* TOP */}
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: 120 }}
        transition={{ duration: 1 }}
        className="absolute top-0 w-[2px] bg-gradient-to-b from-cyan-400 to-transparent"
      />

      {/* BOTTOM */}
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: 120 }}
        transition={{ duration: 1 }}
        className="absolute bottom-0 w-[2px] bg-gradient-to-t from-purple-400 to-transparent"
      />

      {/* LEFT */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: 120 }}
        transition={{ duration: 1 }}
        className="absolute left-0 h-[2px] bg-gradient-to-r from-cyan-400 to-transparent"
      />

      {/* RIGHT */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: 120 }}
        transition={{ duration: 1 }}
        className="absolute right-0 h-[2px] bg-gradient-to-l from-purple-400 to-transparent"
      />

      {/* DOT ENERGY POINTS */}
      <div className="absolute top-0 w-3 h-3 bg-cyan-400 rounded-full animate-ping"></div>
      <div className="absolute bottom-0 w-3 h-3 bg-purple-400 rounded-full animate-ping"></div>
      <div className="absolute left-0 w-3 h-3 bg-cyan-400 rounded-full animate-ping"></div>
      <div className="absolute right-0 w-3 h-3 bg-purple-400 rounded-full animate-ping"></div>

    </div>
  );
}