import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, requireRole, authErrorResponse } from '@/lib/api-auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await requireAuth();

  try {
    const [totalSales, totalRevenue, pendingBookings, availableStock, soldStock, pendingPayments] =
      await Promise.all([
        prisma.sale.count(),
        prisma.sale.aggregate({ _sum: { totalOnRoadPaise: true } }),
        prisma.booking.count({ where: { status: 'ACTIVE' } }),
        prisma.stockUnit.count({ where: { status: 'IN_STOCK' } }),
        prisma.stockUnit.count({ where: { status: 'SOLD' } }),
        prisma.payment.count({ where: { status: 'PENDING' } }),
      ]);

    return NextResponse.json({
      data: {
        totalSales,
        totalRevenue: totalRevenue._sum.totalOnRoadPaise || 0n,
        pendingBookings,
        availableStock,
        soldStock,
        pendingPayments,
      },
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch dashboard' } },
      { status: 500 }
    );
  }
}
