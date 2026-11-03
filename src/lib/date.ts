// Date handling — UTC storage, Asia/Kolkata display

const KOLKATA_OFFSET = 5 * 60 + 30; // +05:30

/** Convert a UTC Date to an ISO string displayed in Asia/Kolkata */
export function toKolkataString(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Date(d.getTime() + KOLKATA_OFFSET * 60 * 1000).toISOString().slice(0, -5) + '+05:30';
}

/** Format a date for display (DD/MM/YYYY) per DESIGN.md */
export function formatDisplayDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

/** Parse a DD/MM/YYYY display date to a UTC Date */
export function parseDisplayDate(dateStr: string): Date | null {
  const parts = dateStr.split('/');
  if (parts.length !== 3) return null;
  const [dd, mm, yyyy] = parts.map(Number);
  if (!dd || !mm || !yyyy) return null;
  // Construct UTC date from local components
  return new Date(Date.UTC(yyyy, mm - 1, dd));
}

/** Get start of day in UTC */
export function startOfDayUtc(date: Date): Date {
  const d = new Date(date);
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

/** Get end of day in UTC */
export function endOfDayUtc(date: Date): Date {
  const d = new Date(date);
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 23, 59, 59, 999));
}
