import { NextResponse } from 'next/server';
import { timingSafeEqual } from 'node:crypto';
import { runScheduledSync } from '@/services/bike-sync.service';

export const dynamic = 'force-dynamic';

// GET /api/cron/bike-sync — scheduled synchronisation.
// Protected by CRON_SECRET (Vercel Cron sends `Authorization: Bearer <CRON_SECRET>`).
function authorize(request: Request): boolean {
  const secret = process.env.CRON_SECRET || process.env.BIKE_SYNC_CRON_SECRET;
  if (!secret) return false;
  const header = request.headers.get('authorization') ?? '';
  const provided = header.startsWith('Bearer ') ? header.slice(7) : header;
  if (!provided) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(secret);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function GET(request: Request) {
  if (!process.env.CRON_SECRET && !process.env.BIKE_SYNC_CRON_SECRET) {
    return NextResponse.json(
      {
        error: {
          code: 'CRON_NOT_CONFIGURED',
          message: 'CRON_SECRET is not configured; scheduled sync is disabled.',
        },
      },
      { status: 503 },
    );
  }
  if (!authorize(request)) {
    return NextResponse.json(
      { error: { code: 'UNAUTHENTICATED', message: 'Invalid cron secret' } },
      { status: 401 },
    );
  }

  const { searchParams } = new URL(request.url);
  const providerCode = searchParams.get('providerCode') ?? undefined;
  const results = await runScheduledSync(providerCode);
  return NextResponse.json({ data: results });
}
