import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET /api/health — liveness + database connectivity check.
export async function GET() {
  let database = 'unknown';
  try {
    await prisma.$queryRaw`SELECT 1`;
    database = 'up';
  } catch {
    database = 'down';
  }

  return NextResponse.json(
    { data: { status: 'ok', service: 'the-bike-yard-backend', database } },
    { status: 200 },
  );
}
