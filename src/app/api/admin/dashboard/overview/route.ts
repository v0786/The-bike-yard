import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, requireRole, authErrorResponse } from '@/lib/api-auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await requireAuth();

  try {
    const [
      todaySales,
      totalRevenue,
      availableStock,
      bookings,
      stockInward,
      stockOutward,
      pendingPayments,
      financeApplications,
      insuranceApplications,
      rtoApplications,
    ] = await Promise.all([
      prisma.sale.count({
        where: {
          saleDate: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        },
      }),
      prisma.sale.aggregate({ _sum: { totalOnRoadPaise: true } }),
      prisma.stockUnit.count({ where: { status: 'IN_STOCK' } }),
      prisma.booking.count({ where: { status: 'ACTIVE' } }),
      prisma.stockUnit.count({ where: { status: 'IN_STOCK' } }),
      prisma.stockUnit.count({ where: { status: 'SOLD' } }),
      prisma.payment.count({ where: { status: 'PENDING' } }),
      prisma.financeApplication.count({ where: { status: 'SUBMITTED' } }),
      prisma.insuranceApplication.count({ where: { status: 'SUBMITTED' } }),
      prisma.rTOApplication.count({ where: { status: 'SUBMITTED' } }),
    ]);

    const data = [
      { label: "Today's Sales", value: todaySales, trend: 'up' },
      { label: 'Total Revenue', value: Number(totalRevenue._sum.totalOnRoadPaise || 0n), trend: 'up' },
      { label: 'Available Stock', value: availableStock, trend: 'neutral' },
      { label: 'Bookings', value: bookings, trend: 'neutral' },
      { label: 'Stock Inward', value: stockInward, trend: 'neutral' },
      { label: 'Stock Outward', value: stockOutward, trend: 'neutral' },
      { label: 'Pending Payments', value: pendingPayments, trend: 'down' },
      { label: 'Finance Applications', value: financeApplications, trend: 'neutral' },
      { label: 'Insurance Applications', value: insuranceApplications, trend: 'neutral' },
      { label: 'RTO Registrations', value: rtoApplications, trend: 'neutral' },
    ];

    return NextResponse.json({ data });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch dashboard' } },
      { status: 500 }
    );
  }
}
