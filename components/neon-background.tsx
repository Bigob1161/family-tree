"use client";

import { useEffect, useMemo, useState } from "react";
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

  const stars = useMemo(
    () =>
      Array.from({ length: 48 }, (_, i) => ({
        id: i,
        size: Math.random() * 2 + 1,
        x: `${Math.random() * 100}%`,
        y: `${Math.random() * 100}%`,
        delay: Math.random() * 4,
        duration: 3 + Math.random() * 4,
      })),
    []
  );

  const orbs = useMemo(
    () => [
      { size: 320, x: "15%", y: "25%", color: "var(--accent)", delay: 0 },
      { size: 420, x: "75%", y: "20%", color: "var(--primary)", delay: 1.5 },
      { size: 260, x: "45%", y: "75%", color: "var(--accent)", delay: 3 },
      { size: 360, x: "85%", y: "65%", color: "var(--primary)", delay: 2 },
    ],
    []
  );

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 -z-10 overflow-hidden",
        className
      )}
      aria-hidden="true"
    >
      <div className="deep-space" />
      <div className="neon-grid" />

      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at center, transparent 0%, var(--background) 80%)",
        }}
      />

      <svg
        className="absolute inset-0 h-full w-full opacity-20"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="neonLine" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.5" />
            <stop offset="50%" stopColor="var(--accent)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <line x1="0%" y1="0%" x2="100%" y2="100%" stroke="url(#neonLine)" strokeWidth="1" />
        <line x1="100%" y1="0%" x2="0%" y2="100%" stroke="url(#neonLine)" strokeWidth="1" />
      </svg>

      {mounted && (
        <>
          {orbs.map((orb, i) => (
            <motion.div
              key={`orb-${i}`}
              className="absolute rounded-full blur-3xl"
              style={{
                left: orb.x,
                top: orb.y,
                width: orb.size,
                height: orb.size,
                background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
                translateX: "-50%",
                translateY: "-50%",
              }}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{
                opacity: [0.15, 0.35, 0.15],
                scale: [1, 1.15, 1],
                x: ["-50%", "-48%", "-52%", "-50%"],
                y: ["-50%", "-52%", "-48%", "-50%"],
              }}
              transition={{
                duration: 10 + orb.size / 60,
                repeat: Infinity,
                delay: orb.delay,
                ease: "easeInOut",
              }}
            />
          ))}

          <div className="star-field">
            {stars.map((star) => (
              <motion.div
                key={star.id}
                className="star"
                style={{
                  left: star.x,
                  top: star.y,
                  width: star.size,
                  height: star.size,
                  boxShadow: `0 0 ${star.size * 2}px currentColor`,
                }}
                initial={{ opacity: 0.2, scale: 0.5 }}
                animate={{
                  opacity: [0.2, 0.9, 0.2],
                  scale: [1, 1.3, 1],
                }}
                transition={{
                  duration: star.duration,
                  repeat: Infinity,
                  delay: star.delay,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
