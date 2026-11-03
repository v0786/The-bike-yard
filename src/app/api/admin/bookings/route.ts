import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        customer: true,
        stockUnit: true,
        payments: true,
      },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json({ data: bookings })
  } catch (error) {
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Failed to fetch bookings" } },
      { status: 500 }
    )
  }
}
