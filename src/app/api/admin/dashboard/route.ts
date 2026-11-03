import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const [
      totalSales,
      totalRevenue,
      pendingBookings,
      availableStock,
      soldStock,
      pendingPayments,
    ] = await Promise.all([
      prisma.sale.count(),
      prisma.sale.aggregate({ _sum: { totalAmount: true } }),
      prisma.booking.count({ where: { status: "pending" } }),
      prisma.stockUnit.count({ where: { currentStatus: "available" } }),
      prisma.stockUnit.count({ where: { currentStatus: "sold" } }),
      prisma.payment.count({ where: { status: "pending" } }),
    ])

    return NextResponse.json({
      data: {
        totalSales,
        totalRevenue: totalRevenue._sum.totalAmount || 0,
        pendingBookings,
        availableStock,
        soldStock,
        pendingPayments,
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Failed to fetch dashboard" } },
      { status: 500 }
    )
  }
}
