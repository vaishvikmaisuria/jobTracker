/** Simple ID generator using crypto.randomUUID or fallback */
export function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

/** Current timestamp as ISO string */
export function now(): string {
  return new Date().toISOString();
}
