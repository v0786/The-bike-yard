import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, requireRole, authErrorResponse } from '@/lib/api-auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await requireRole(['Super Admin', 'Owner']);

  try {
    const auditLogs = await prisma.auditLog.findMany({
      include: {
        user: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
      },
      orderBy: { timestamp: 'desc' },
      take: 100,
    });
    return NextResponse.json({ data: auditLogs });
  } catch (error) {
    return authErrorResponse(error);
  }
}
