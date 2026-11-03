import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const finance = await prisma.financeApplication.findMany({
      include: { customer: true, sale: true },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json({ data: finance })
  } catch (error) {
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Failed to fetch finance applications" } },
      { status: 500 }
    )
  }
}
