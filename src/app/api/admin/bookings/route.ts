import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, requireRole, authErrorResponse } from '@/lib/api-auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await requireAuth();

  try {
    const bookings = await prisma.booking.findMany({
      include: {
        customer: true,
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ data: bookings });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch bookings' } },
      { status: 500 }
    );
  }
}
