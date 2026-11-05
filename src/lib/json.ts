// JSON helpers for serialising Prisma results that contain BigInt money values
// and Date / Decimal fields.

/** Recursively convert BigInt→number and Date→ISO string for JSON responses. */
export function jsonSafe<T>(value: T): T {
  if (typeof value === 'bigint') {
    // Paise amounts are far below Number.MAX_SAFE_INTEGER.
    return Number(value) as unknown as T;
  }
  if (value instanceof Date) {
    return value.toISOString() as unknown as T;
  }
  if (Array.isArray(value)) {
    return value.map((item) => jsonSafe(item)) as unknown as T;
  }
  if (value && typeof value === 'object') {
    // Prisma Decimal (and similar) expose toJSON — let them serialise themselves.
    if (typeof (value as { toJSON?: unknown }).toJSON === 'function') {
      return (value as unknown as { toJSON: () => unknown }).toJSON() as unknown as T;
    }
    const out: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(value)) {
      out[key] = jsonSafe(item);
    }
    return out as T;
  }
  return value;
}
