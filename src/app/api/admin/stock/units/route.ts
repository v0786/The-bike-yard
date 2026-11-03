import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { stockUnitCreateSchema } from "@/lib/validations"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const units = await prisma.stockUnit.findMany({
      include: { variant: { include: { model: { include: { brand: true } } } }, colour: true },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json({ data: units })
  } catch (error) {
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Failed to fetch stock units" } },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validated = stockUnitCreateSchema.parse(body)

    const unit = await prisma.stockUnit.create({
      data: {
        chassisNumber: validated.chassisNumber,
        engineNumber: validated.engineNumber,
        variantId: validated.variantId,
        colourId: validated.colourId || null,
        dealershipId: validated.dealershipId || null,
        purchasePrice: validated.purchasePrice,
        purchaseInvoiceNumber: validated.purchaseInvoiceNumber || null,
        supplierName: validated.supplierName || null,
        receivedDate: validated.receivedDate,
        currentStatus: validated.currentStatus,
        location: validated.location || null,
        notes: validated.notes || null,
      },
      include: { variant: { include: { model: { include: { brand: true } } } }, colour: true },
    })

    return NextResponse.json({ data: unit }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid stock unit data",
            details: error.errors.map((e) => ({
              field: e.path.join("."),
              message: e.message,
            })),
          },
        },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Failed to create stock unit" } },
      { status: 500 }
    )
  }
}
