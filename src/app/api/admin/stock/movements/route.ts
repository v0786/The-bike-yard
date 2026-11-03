import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const movements = await prisma.stockMovement.findMany({
      include: { stockUnit: true },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json({ data: movements })
  } catch (error) {
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Failed to fetch stock movements" } },
      { status: 500 }
    )
  }
}
