"use client";

import { cn } from "@/lib/utils";

interface CarpetBackgroundProps {
  className?: string;
}

export function CarpetBackground({ className }: CarpetBackgroundProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden",
        className
      )}
      aria-hidden="true"
    >
      <svg
        className="h-full w-full opacity-40 dark:opacity-25"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern
            id="carpet-border"
            x="0"
            y="0"
            width="120"
            height="120"
            patternUnits="userSpaceOnUse"
          >
            <rect width="120" height="120" fill="var(--background)" />
            <rect x="10" y="10" width="100" height="100" fill="none" stroke="var(--primary)" strokeWidth="2" />
            <rect x="20" y="20" width="80" height="80" fill="none" stroke="var(--accent)" strokeWidth="2" />
            <path
              d="M30 30h60v60H30z"
              fill="none"
              stroke="var(--secondary)"
              strokeWidth="1.5"
            />
            <g fill="var(--primary)">
              <circle cx="30" cy="30" r="4" />
              <circle cx="90" cy="30" r="4" />
              <circle cx="30" cy="90" r="4" />
              <circle cx="90" cy="90" r="4" />
              <circle cx="60" cy="60" r="5" />
            </g>
            <g fill="var(--accent)">
              <circle cx="60" cy="30" r="3" />
              <circle cx="60" cy="90" r="3" />
              <circle cx="30" cy="60" r="3" />
              <circle cx="90" cy="60" r="3" />
            </g>
          </pattern>

          <pattern
            id="carpet-floral"
            x="0"
            y="0"
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            <g opacity="0.5">
              <path
                d="M40 10C35 20 25 25 15 25C25 30 30 40 30 50C35 40 45 35 55 35C45 30 40 20 40 10Z"
                fill="var(--primary)"
                opacity="0.25"
              />
              <path
                d="M40 70C45 60 55 55 65 55C55 50 50 40 50 30C45 40 35 45 25 45C35 50 40 60 40 70Z"
                fill="var(--accent)"
                opacity="0.25"
              />
              <circle cx="40" cy="40" r="6" fill="var(--secondary)" opacity="0.35" />
            </g>
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#carpet-border)" />
        <rect width="100%" height="100%" fill="url(#carpet-floral)" />
        <rect
          width="100%"
          height="100%"
          fill="radial-gradient(circle at center, transparent 0%, var(--background) 85%)"
        />
      </svg>
    </div>
  );
}
