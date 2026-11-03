import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAuth, requireRole, authErrorResponse } from "@/lib/api-auth"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const user = await requireAuth()

  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const page = parseInt(searchParams.get("page") || "1", 10)
    const pageSize = parseInt(searchParams.get("pageSize") || "12", 10)
    const q = searchParams.get("q")

    const where: any = {}
    if (status) where.status = status
    if (q) {
      where.OR = [
        { variant: { name: { contains: q, mode: "insensitive" } } },
        { variant: { model: { name: { contains: q, mode: "insensitive" } } } },
      ]
    }

    const [stockUnits, total] = await Promise.all([
      prisma.stockUnit.findMany({
        where,
        include: {
          variant: { include: { model: { include: { brand: true } } } },
          colour: true,
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.stockUnit.count({ where }),
    ])

    const data = stockUnits.map((unit) => ({
      id: unit.id,
      brand: unit.variant.model.brand.name,
      model: unit.variant.model.name,
      variant: unit.variant.name,
      colour: unit.colour?.name,
      chassisNumber: unit.chassisNumber,
      engineNumber: unit.engineNumber,
      exShowroomPrice: unit.purchasePrice,
      onRoadPrice: unit.purchasePrice,
      availabilityStatus: unit.currentStatus,
      imageUrl: unit.colour?.imageUrl || null,
      specifications: unit.variant.specifications || {},
    }))

    return NextResponse.json({
      data,
      meta: { page, pageSize, total },
    })
  } catch (error: unknown) {
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Failed to fetch bikes" } },
      { status: 500 }
    )
  }
}
