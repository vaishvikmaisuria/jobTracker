"use client";

import { cn } from "@/lib/cn";

interface StatCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  color?: string;
  subtitle?: string;
}

export function StatCard({ title, value, icon, color = "bg-indigo-500", subtitle }: StatCardProps) {
  return (
    <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5 flex items-start gap-4">
      {icon && (
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl text-white flex-shrink-0", color)}>
          {icon}
        </div>
      )}
      <div>
        <p className="text-sm text-slate-500">{title}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}
