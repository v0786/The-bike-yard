import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const insurance = await prisma.insuranceApplication.findMany({
      include: { customer: true, sale: true },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json({ data: insurance })
  } catch (error) {
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Failed to fetch insurance applications" } },
      { status: 500 }
    )
  }
}
