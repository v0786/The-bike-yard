import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { requireAuth, requireRole, authErrorResponse } from "@/lib/api-auth"

const inwardSchema = z.object({
  chassisNumber: z.string().min(1),
  engineNumber: z.string().min(1),
  variantId: z.string().uuid(),
  colourId: z.string().uuid().optional(),
  purchasePrice: z.number().int().nonnegative(),
  purchaseInvoiceNumber: z.string().optional(),
  supplierName: z.string().optional(),
  receivedDate: z.string().datetime(),
})

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  const user = await requireRole(["Manager", "Super Admin", "Owner"])

  try {
    const body = await request.json()
    const validated = inwardSchema.parse(body)

    const unit = await prisma.stockUnit.create({
      data: {
        chassisNumber: validated.chassisNumber,
        engineNumber: validated.engineNumber,
        variantId: validated.variantId,
        colourId: validated.colourId || null,
        purchasePrice: validated.purchasePrice,
        purchaseInvoiceNumber: validated.purchaseInvoiceNumber || null,
        supplierName: validated.supplierName || null,
        receivedDate: validated.receivedDate,
        currentStatus: "available",
      },
    })

    await prisma.stockMovement.create({
      data: {
        stockUnitId: unit.id,
        type: "inward",
        quantity: 1,
        referenceType: "inward",
        notes: "Stock inward",
      },
    })

    return NextResponse.json({ data: unit }, { status: 201 })
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "Invalid inward data", details: error.errors } },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Failed to record stock inward" } },
      { status: 500 }
    )
  }
}
