import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, requireRole, authErrorResponse } from '@/lib/api-auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await requireRole(['Manager', 'Super Admin', 'Owner', 'Accountant']);

  try {
    const refunds = await prisma.refund.findMany({
      orderBy: { requestedAt: 'desc' },
    });
    return NextResponse.json({ data: refunds });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch refunds' } },
      { status: 500 }
    );
  }
}
