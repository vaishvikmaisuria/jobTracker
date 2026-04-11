import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "@/components/layout/AppProviders";
import { Sidebar } from "@/components/layout/Sidebar";

export const metadata: Metadata = {
  title: "Job Hunt Tracker",
  description: "Track your job applications, LeetCode practice, and useful resources.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AppProviders>
          <div className="flex h-screen overflow-hidden bg-slate-50">
            <Sidebar />
            <main className="flex-1 overflow-y-auto">
              {children}
            </main>
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
