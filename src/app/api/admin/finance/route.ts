import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, requireRole, authErrorResponse } from '@/lib/api-auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await requireAuth();

  try {
    const finance = await prisma.financeApplication.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ data: finance });
  } catch (error) {
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch finance applications' } },
      { status: 500 }
    );
  }
}
