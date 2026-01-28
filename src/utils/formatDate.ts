export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// Threshold for showing "Updated" date (7 days in milliseconds)
export const UPDATED_THRESHOLD_MS = 7 * 24 * 60 * 60 * 1000;
