import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth, requireRole, authErrorResponse } from "@/lib/api-auth"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const user = await requireRole(["Super Admin", "Owner", "Manager", "Accountant"])

  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") || "overview"

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

    // Sales by day (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const salesByDay = await prisma.sale.groupBy({
      by: ["createdAt"],
      _sum: { totalAmount: true },
      where: { createdAt: { gte: sevenDaysAgo } },
      orderBy: { createdAt: "asc" },
    })

    const data = {
      overview: {
        totalSales,
        totalRevenue: totalRevenue._sum.totalAmount || 0,
        pendingBookings,
        availableStock,
        soldStock,
        pendingPayments,
      },
      salesByDay: salesByDay.map((s) => ({
        date: s.createdAt.toISOString(),
        amount: s._sum.totalAmount || 0,
      })),
    }

    return NextResponse.json({ data })
  } catch (error) {
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Failed to fetch reports" } },
      { status: 500 }
    )
  }
}
