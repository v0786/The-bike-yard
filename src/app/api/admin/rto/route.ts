import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const rto = await prisma.rTOApplication.findMany({
      include: { customer: true, sale: true },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json({ data: rto })
  } catch (error) {
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Failed to fetch RTO applications" } },
      { status: 500 }
    )
  }
}
