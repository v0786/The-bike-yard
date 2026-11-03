import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth, requireRole, authErrorResponse } from "@/lib/api-auth"

export const dynamic = "force-dynamic"

export async function GET() {
  const user = await requireAuth()

  try {
    const brands = await prisma.brand.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      include: { _count: { select: { models: true } } },
    })
    return NextResponse.json({ data: brands })
  } catch (error: unknown) {
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Failed to fetch brands" } },
      { status: 500 }
    )
  }
}
