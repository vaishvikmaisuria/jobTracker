"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="flex h-full items-center justify-center py-24 text-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-700 mb-4">Something went wrong</h2>
            <button
              onClick={reset}
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
