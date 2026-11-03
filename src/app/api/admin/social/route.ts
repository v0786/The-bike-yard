import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth, requireRole, authErrorResponse } from "@/lib/api-auth"

export const dynamic = "force-dynamic"

export async function GET() {
  const user = await requireAuth()

  try {
    const social = await prisma.socialLink.findMany({
      where: { isActive: true },
      orderBy: { platform: "asc" },
    })
    return NextResponse.json({ data: social })
  } catch (error) {
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Failed to fetch social links" } },
      { status: 500 }
    )
  }
}
