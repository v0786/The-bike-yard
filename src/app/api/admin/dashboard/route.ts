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
        prisma.sale.aggregate({ _sum: { finalSellingPrice: true } }),
        prisma.booking.count({ where: { advanceStatus: 'pending' } }),
        prisma.stockUnit.count({ where: { currentStatus: 'available' } }),
        prisma.stockUnit.count({ where: { currentStatus: 'sold' } }),
        prisma.payment.count({ where: { status: 'pending' } }),
      ]);

    return NextResponse.json({
      data: {
        totalSales,
        totalRevenue: totalRevenue._sum.finalSellingPrice || 0,
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
