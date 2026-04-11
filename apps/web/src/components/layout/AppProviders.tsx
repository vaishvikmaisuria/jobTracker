"use client";

// Client-side providers (Zustand doesn't need a provider, but this is
// where we'd add React Query, theme context, etc.)
export function AppProviders({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
