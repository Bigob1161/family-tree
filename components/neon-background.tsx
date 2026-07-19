"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface NeonBackgroundProps {
  className?: string;
}

export function NeonBackground({ className }: NeonBackgroundProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const particles = [
    { size: 4, x: "15%", y: "20%", color: "var(--primary)", delay: 0 },
    { size: 6, x: "75%", y: "15%", color: "var(--accent)", delay: 1.2 },
    { size: 3, x: "45%", y: "70%", color: "var(--primary)", delay: 2.1 },
    { size: 5, x: "85%", y: "60%", color: "var(--accent)", delay: 0.7 },
    { size: 4, x: "25%", y: "85%", color: "var(--primary)", delay: 1.8 },
    { size: 7, x: "60%", y: "40%", color: "var(--accent)", delay: 2.8 },
    { size: 3, x: "90%", y: "85%", color: "var(--primary)", delay: 3.3 },
    { size: 5, x: "5%", y: "55%", color: "var(--accent)", delay: 2.5 },
  ];

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 -z-10 overflow-hidden",
        className
      )}
      aria-hidden="true"
    >
      <div className="neon-grid" />

      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at center, transparent 0%, var(--background) 85%)",
        }}
      />

      <svg
        className="absolute inset-0 h-full w-full opacity-30"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="neonLine" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.6" />
            <stop offset="50%" stopColor="var(--accent)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <line
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
          stroke="url(#neonLine)"
          strokeWidth="1"
        />
        <line
          x1="100%"
          y1="0%"
          x2="0%"
          y2="100%"
          stroke="url(#neonLine)"
          strokeWidth="1"
        />
      </svg>

      {mounted &&
        particles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: p.x,
              top: p.y,
              width: p.size * 4,
              height: p.size * 4,
              background: p.color,
              boxShadow: `0 0 ${p.size * 6}px ${p.color}, 0 0 ${p.size * 12}px ${p.color}`,
            }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.4, 1],
              y: [0, -24, 0],
            }}
            transition={{
              duration: 5 + p.size,
              repeat: Infinity,
              delay: p.delay,
              ease: "easeInOut",
            }}
          />
        ))}
    </div>
  );
}
