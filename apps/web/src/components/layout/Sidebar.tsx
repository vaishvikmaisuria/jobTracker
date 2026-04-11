"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  Code2,
  BookMarked,
} from "lucide-react";
import { cn } from "@/lib/cn";

const NAV_ITEMS = [
  { href: "/",           label: "Dashboard",    icon: LayoutDashboard },
  { href: "/jobs",       label: "Jobs",          icon: Briefcase },
  { href: "/leetcode",   label: "LeetCode",      icon: Code2 },
  { href: "/resources",  label: "Useful Links",  icon: BookMarked },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-60 shrink-0 bg-white border-r border-slate-100 h-screen">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-slate-100">
        <div className="h-8 w-8 rounded-xl bg-indigo-600 flex items-center justify-center">
          <Briefcase size={16} className="text-white" />
        </div>
        <span className="font-semibold text-slate-900 text-sm">Job Tracker</span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-0.5 p-3 flex-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : (pathname ?? "").startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <Icon size={18} className={active ? "text-indigo-600" : "text-slate-400"} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-slate-100">
        <p className="text-xs text-slate-400">Job Hunt Tracker v1.0</p>
      </div>
    </aside>
  );
}
