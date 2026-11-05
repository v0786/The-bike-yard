// In-process token-bucket rate limiter, one bucket per provider code.
//
// The sync engine also consults the BikeProviderRequest table (see
// bike-sync.service.ts) so the limit holds across processes. This token bucket
// smooths bursts within a single process; the DB check bounds the total.

interface Bucket {
  tokens: number;
  lastRefillMs: number;
}

const buckets = new Map<string, Bucket>();

export class RateLimiter {
  constructor(
    private readonly providerCode: string,
    private readonly perMinute: number,
  ) {}

  private refill(bucket: Bucket, nowMs: number) {
    const elapsed = nowMs - bucket.lastRefillMs;
    const ratePerMs = this.perMinute / 60_000;
    bucket.tokens = Math.min(this.perMinute, bucket.tokens + elapsed * ratePerMs);
    bucket.lastRefillMs = nowMs;
  }

  /** Returns the wait time in ms before a token is available (0 when ready). */
  msUntilReady(nowMs = Date.now()): number {
    const bucket = buckets.get(this.providerCode) ?? {
      tokens: this.perMinute,
      lastRefillMs: nowMs,
    };
    buckets.set(this.providerCode, bucket);
    this.refill(bucket, nowMs);
    if (bucket.tokens >= 1) return 0;
    const ratePerMs = this.perMinute / 60_000;
    return Math.ceil((1 - bucket.tokens) / ratePerMs);
  }

  /** Consume a token, waiting if necessary. */
  async acquire(sleep: (ms: number) => Promise<void>): Promise<void> {
    // Bounded busy-wait so a misconfigured limit can never hang a run forever.
    for (let i = 0; i < 120; i++) {
      const wait = this.msUntilReady();
      if (wait <= 0) {
        const bucket = buckets.get(this.providerCode)!;
        bucket.tokens -= 1;
        return;
      }
      await sleep(Math.min(wait, 1_000));
    }
  }
}

/** Test helper — reset all buckets. */
export function resetRateLimiters() {
  buckets.clear();
}
