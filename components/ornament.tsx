"use client";

import { cn } from "@/lib/utils";

export function OrnamentDivider({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 12"
      fill="none"
      className={cn("h-3 w-32 text-accent", className)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 6H80M120 6H200"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="100" cy="6" r="4" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="88" cy="6" r="2" fill="currentColor" />
      <circle cx="112" cy="6" r="2" fill="currentColor" />
    </svg>
  );
}
