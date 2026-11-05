// Reports API — analytics data for dashboard.
// Uses new schema field names.

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, requireRole, authErrorResponse } from '@/lib/api-auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const user = await requireRole(['Super Admin', 'Owner', 'Manager', 'Accountant']);

  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'overview';

    const [totalSales, totalRevenue, pendingBookings, availableStock, soldStock, pendingPayments] =
      await Promise.all([
        prisma.sale.count(),
        prisma.sale.aggregate({ _sum: { totalOnRoadPaise: true } }),
        prisma.booking.count({ where: { status: 'ACTIVE' } }),
        prisma.stockUnit.count({ where: { status: 'IN_STOCK' } }),
        prisma.stockUnit.count({ where: { status: 'SOLD' } }),
        prisma.payment.count({ where: { status: 'PENDING' } }),
      ]);

    // Sales by day (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const salesByDay = await prisma.sale.groupBy({
      by: ['saleDate'],
      _sum: { totalOnRoadPaise: true },
      where: { saleDate: { gte: sevenDaysAgo } },
      orderBy: { saleDate: 'asc' },
    });

    const data = {
      overview: {
        totalSales,
        totalRevenue: Number(totalRevenue._sum.totalOnRoadPaise || 0n),
        pendingBookings,
        availableStock,
        soldStock,
        pendingPayments,
      },
      salesByDay: salesByDay.map((s) => ({
        date: s.saleDate.toISOString(),
        amount: Number(s._sum.totalOnRoadPaise || 0n),
      })),
    };

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch reports' } },
      { status: 500 }
    );
  }
}
