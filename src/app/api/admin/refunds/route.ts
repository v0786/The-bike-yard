import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const refunds = await prisma.refund.findMany({
      include: { payment: true },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json({ data: refunds })
  } catch (error) {
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Failed to fetch refunds" } },
      { status: 500 }
    )
  }
}
