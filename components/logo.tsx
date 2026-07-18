"use client";

import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: number;
}

export function Logo({ className, size = 40 }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
    >
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="120" y2="120">
          <stop offset="0%" stopColor="var(--primary)" />
          <stop offset="100%" stopColor="var(--accent)" />
        </linearGradient>
      </defs>

      <rect width="120" height="120" rx="16" fill="url(#logoGrad)" />

      <path
        d="M20 96V60C20 34 40 14 60 14C80 14 100 34 100 60V96"
        stroke="var(--accent-foreground)"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M20 96H100"
        stroke="var(--accent-foreground)"
        strokeWidth="3"
        strokeLinecap="round"
      />

      <path
        d="M60 28C52 28 46 36 46 46C46 56 52 64 60 64C56 64 52 56 52 46C52 36 56 28 60 28Z"
        fill="var(--accent-foreground)"
      />

      <path
        d="M60 20L62.5 27H70L64 32L66.5 40L60 35L53.5 40L56 32L50 27H57.5L60 20Z"
        fill="var(--accent-foreground)"
      />

      <g stroke="var(--accent-foreground)" strokeWidth="3" strokeLinecap="round">
        <path d="M60 74V56" />
        <path d="M60 60L46 48" />
        <path d="M60 60L74 48" />
        <path d="M46 48L42 42" />
        <path d="M74 48L78 42" />
      </g>

      <circle cx="42" cy="42" r="5" fill="var(--accent-foreground)" />
      <circle cx="78" cy="42" r="5" fill="var(--accent-foreground)" />
      <circle cx="46" cy="48" r="4.5" fill="var(--accent-foreground)" />
      <circle cx="74" cy="48" r="4.5" fill="var(--accent-foreground)" />
      <circle cx="60" cy="56" r="5.5" fill="var(--accent-foreground)" />

      <circle cx="60" cy="86" r="8" fill="var(--accent-foreground)" />
      <path
        d="M52 86C52 82 56 78 60 78C64 78 68 82 68 86C68 90 64 94 60 94C56 94 52 90 52 86Z"
        fill="var(--primary)"
      />
    </svg>
  );
}
