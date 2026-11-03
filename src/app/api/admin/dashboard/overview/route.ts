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
          createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        },
      }),
      prisma.sale.aggregate({ _sum: { finalSellingPrice: true } }),
      prisma.stockUnit.count({ where: { currentStatus: 'available' } }),
      prisma.booking.count({ where: { advanceStatus: 'pending' } }),
      prisma.stockUnit.count({ where: { currentStatus: 'available' } }),
      prisma.stockUnit.count({ where: { currentStatus: 'sold' } }),
      prisma.payment.count({ where: { status: 'pending' } }),
      prisma.financeApplication.count({ where: { status: 'submitted' } }),
      prisma.insuranceApplication.count({ where: { status: 'submitted' } }),
      prisma.rTOApplication.count({ where: { status: 'submitted' } }),
    ]);

    const data = [
      { label: "Today's Sales", value: todaySales, trend: 'up' },
      { label: 'Total Revenue', value: totalRevenue._sum.finalSellingPrice || 0, trend: 'up' },
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
