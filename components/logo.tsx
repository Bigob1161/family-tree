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
      viewBox="0 0 108 108"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
    >
      <rect width="108" height="108" fill="currentColor" className="text-primary" />
      <path
        d="M20 84V54C20 32 36 16 54 16C72 16 88 32 88 54V84"
        stroke="currentColor"
        strokeWidth="4"
        className="text-accent"
      />
      <path
        d="M54 30C46 30 40 37 40 45C40 53 46 60 54 60C50 60 46 53 46 45C46 37 50 30 54 30Z"
        fill="currentColor"
        className="text-accent"
      />
      <path
        d="M54 22L56 28H62L57 32L59 38L54 34L49 38L51 32L46 28H52L54 22Z"
        fill="currentColor"
        className="text-accent"
      />
      <path
        d="M54 68V52M54 56L42 46M54 56L66 46M42 46L38 40M66 46L70 40"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        className="text-accent"
      />
      <circle cx="38" cy="40" r="5" fill="currentColor" className="text-accent" />
      <circle cx="70" cy="40" r="5" fill="currentColor" className="text-accent" />
      <circle cx="42" cy="46" r="4.5" fill="currentColor" className="text-accent" />
      <circle cx="66" cy="46" r="4.5" fill="currentColor" className="text-accent" />
      <circle cx="54" cy="52" r="5.5" fill="currentColor" className="text-accent" />
      <path d="M16 84H92" stroke="currentColor" strokeWidth="3" className="text-accent" />
    </svg>
  );
}
