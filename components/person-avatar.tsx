"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface PersonAvatarProps {
  src?: string;
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: "h-10 w-10 text-xs",
  md: "h-16 w-16 text-sm",
  lg: "h-24 w-24 text-base",
  xl: "h-36 w-36 text-xl",
};

export function PersonAvatar({ src, name, size = "md", className }: PersonAvatarProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Avatar
      className={cn(
        sizeClasses[size],
        "border-2 border-accent bg-secondary ring-2 ring-background",
        className
      )}
    >
      <AvatarImage src={src} alt={name} className="object-cover" />
      <AvatarFallback className="bg-secondary text-secondary-foreground font-medium">
        {initials || "?"}
      </AvatarFallback>
    </Avatar>
  );
}
