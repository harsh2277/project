// ─── Utility Helpers ──────────────────────────────────────────────────────────

/**
 * Format a Date object or ISO string to a human-readable date.
 * @example formatDate('2026-04-17') => "Apr 17, 2026"
 */
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}

/**
 * Truncate a string to a given max length with ellipsis.
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
}

/**
 * Generate a random ID (not cryptographically secure — for local state only).
 */
export function generateId(): string {
  return Math.random().toString(36).slice(2, 11);
}

/**
 * Capitalize the first letter of a string.
 */
export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
