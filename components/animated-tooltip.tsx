"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState, ReactNode } from "react";

interface AnimatedTooltipProps {
  children: ReactNode;
  content: ReactNode;
  className?: string;
}

export function AnimatedTooltip({ children, content, className }: AnimatedTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className={cn("relative inline-flex", className)}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-max max-w-xs -translate-x-1/2 rounded-lg border border-primary/40 bg-card/95 px-3 py-2 text-sm text-card-foreground shadow-xl shadow-primary/10 backdrop-blur-sm"
          >
            <div className="relative">
              {content}
              <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 translate-y-1/2 rotate-45 border-b border-r border-primary/40 bg-card/95" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
