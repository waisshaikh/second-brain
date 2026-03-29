import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import brain from "../assets/brain.png";

export default function BrainCore() {
  const [phase, setPhase] = useState("idle");

  useEffect(() => {
    const runCycle = () => {
    
      setPhase("bw");

      setTimeout(() => {
        

        setPhase("color");

        setTimeout(() => {
          
          
          setPhase("idle");
        }, 2500);

      }, 300); // very short grayscale
    };

    const interval = setInterval(runCycle, 5000);

    runCycle(); // run immediately

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex items-center justify-center h-[420px] overflow-hidden">

      {/* BACKGROUND */}
      <div className="absolute inset-0" />

      {/* MOVING GRADIENT */}
      <motion.div
        animate={{
          backgroundPosition: phase === "color" ? "100% 50%" : "0% 50%",
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

      {/* ENERGY WAVES */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            scale: phase === "color" ? [0.8, 1.6] : 0.8,
            opacity: phase === "color" ? [0.2, 0] : 0,
          }}
          transition={{
            duration: 2,
            delay: i * 0.4,
            repeat: phase === "color" ? Infinity : 0,
          }}
          className="absolute w-[300px] h-[300px] border border-cyan-400/30 rounded-full"
        />
      ))}

      {/*  BRAIN CORE */}
      <motion.img
        src={brain}
        className="w-[260px] relative z-10"
        animate={{
          scale: [1, 1.05, 1],
          opacity: phase === "idle" ? 0.85 : 1,

          filter:
            phase === "bw"
              ? "grayscale(100%) brightness(0.6)"
              : phase === "color"
              ? "grayscale(0%) brightness(1.3)"
              : "grayscale(20%) brightness(0.85)",
        }}
        transition={{
          duration: phase === "bw" ? 0.3 : 1.5,
          ease: "easeInOut",
          repeat: Infinity,
        }}
        style={{
          filter:
            phase === "color"
              ? "drop-shadow(0 0 60px rgba(0,225,255,0.8)) drop-shadow(0 0 120px rgba(139,92,246,0.6))"
              : "drop-shadow(0 0 20px rgba(0,225,255,0.2))",
        }}
      />

      {/* CORE ENERGY */}
      <motion.div
        animate={{
          scale: phase === "color" ? [0.5, 2, 1] : 0,
          opacity: phase === "color" ? [0, 1, 0.3] : 0,
        }}
        transition={{ duration: 1.5 }}
        className="absolute w-6 h-6 bg-white rounded-full blur-md"
      />

      {/* PARTICLES */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: phase === "color" ? [-20, -80] : 0,
            opacity: phase === "color" ? [0, 1, 0] : 0,
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