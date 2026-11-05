// Small HTTP helpers shared by API route handlers.

/** Best-effort client IP extraction (proxy-aware, no trust in client-supplied only). */
export function getClientIp(request: Request): string | null {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first.slice(0, 50);
  }
  return request.headers.get('x-real-ip')?.slice(0, 50) ?? null;
}

/** Parse a positive integer query param with a default + bounds. */
export function intParam(
  value: string | null,
  fallback: number,
  min: number,
  max: number,
): number {
  const parsed = value ? Number.parseInt(value, 10) : Number.NaN;
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}
