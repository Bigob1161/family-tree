"use client";

import { cn } from "@/lib/utils";

interface OrnamentDividerProps {
  className?: string;
}

export function OrnamentDivider({ className }: OrnamentDividerProps) {
  return (
    <svg
      viewBox="0 0 240 16"
      fill="none"
      className={cn("h-4 w-40 text-accent", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="ornamentGrad" x1="0" y1="0" x2="240" y2="0">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
          <stop offset="50%" stopColor="currentColor" stopOpacity="1" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <path
        d="M0 8H100M140 8H240"
        stroke="url(#ornamentGrad)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="120" cy="8" r="6" stroke="currentColor" strokeWidth="2" />
      <circle cx="105" cy="8" r="3" fill="currentColor" />
      <circle cx="135" cy="8" r="3" fill="currentColor" />
      <path
        d="M120 2L122 6H126L123 9L124 13L120 10L116 13L117 9L114 6H118L120 2Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function OrnamentFrame({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("relative p-1", className)}>
      <div className="absolute inset-0 rounded-2xl border-2 border-accent/40" />
      <div className="absolute inset-1 rounded-xl border border-primary/30" />
      <div className="absolute left-2 top-2 h-3 w-3 rounded-full bg-accent/60" />
      <div className="absolute right-2 top-2 h-3 w-3 rounded-full bg-accent/60" />
      <div className="absolute bottom-2 left-2 h-3 w-3 rounded-full bg-accent/60" />
      <div className="absolute bottom-2 right-2 h-3 w-3 rounded-full bg-accent/60" />
      <div className="relative">{children}</div>
    </div>
  );
}
