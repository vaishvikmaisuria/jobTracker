"use client";

import { cn } from "@/lib/cn";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
  dotColor?: string;
}

export function Badge({ children, className, dot, dotColor }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        className
      )}
    >
      {dot && (
        <span className={cn("h-1.5 w-1.5 rounded-full", dotColor ?? "bg-current")} />
      )}
      {children}
    </span>
  );
}
