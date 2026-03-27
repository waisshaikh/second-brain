import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import brain from "../assets/brain.png";

export default function BrainCore() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive(true);
      setTimeout(() => setActive(false), 4000);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex items-center justify-center h-[420px] overflow-hidden">

      {/* 🌌 DEEP SPACE BACKGROUND */}
      <div className="absolute inset-0" />


      {/* moving gradient */}
      <motion.div
        animate={{
          backgroundPosition: active ? "100% 50%" : "0% 50%",
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 opacity-40"
        style={{
          background:
          "radial-gradient(circle at center, rgba(34,211,238,0.08), rgba(168,85,247,0.08), transparent 70%)",
              backgroundSize: "200% 200%",
          filter: "blur(120px)",
        }}
      />

      {/* 🌊 ENERGY WAVES (instead of lines) */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            scale: active ? [0.8, 1.6] : 0.8,
            opacity: active ? [0.2, 0] : 0,
          }}
          transition={{
            duration: 2,
            delay: i * 0.4,
            repeat: active ? Infinity : 0,
          }}
          className="absolute w-[300px] h-[300px] border border-cyan-400/30 rounded-full"
        />
      ))}

      {/* 🧠 BRAIN CORE */}
      <motion.img
        src={brain}
        className="w-[260px] relative z-10"
        animate={{
          scale: [1, 1.05, 1],
          filter: active
            ? "grayscale(0%) brightness(1.5)"
            : "grayscale(100%) brightness(0.5)",
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
        }}
        style={{
          filter: active
            ? "drop-shadow(0 0 80px rgba(0,225,255,1)) drop-shadow(0 0 160px rgba(139,92,246,0.8))"
            : "grayscale(100%)",
        }}
      />

      {/* 💥 CORE ENERGY */}
      <motion.div
        animate={{
          scale: active ? [0.5, 2, 1] : 0,
          opacity: active ? [0, 1, 0.3] : 0,
        }}
        transition={{ duration: 1.5 }}
        className="absolute w-6 h-6 bg-white rounded-full blur-md"
      />

      {/* ✨ FLOATING PARTICLES */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: active ? [-20, -80] : 0,
            opacity: active ? [0, 1, 0] : 0,
          }}
          transition={{
            duration: 2,
            delay: i * 0.2,
          }}
          className="absolute w-1.5 h-1.5 bg-cyan-300 rounded-full"
          style={{
            left: `${30 + i * 4}%`,
            top: "60%",
          }}
        />
      ))}
    </div>
  );
}