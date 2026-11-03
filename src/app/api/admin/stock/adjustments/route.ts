import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"

const adjustmentSchema = z.object({
  stockUnitId: z.string().uuid(),
  type: z.enum(["adjustment", "return"]),
  quantity: z.number().int().positive().default(1),
  notes: z.string().optional(),
})

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validated = adjustmentSchema.parse(body)

    const movement = await prisma.stockMovement.create({
      data: {
        stockUnitId: validated.stockUnitId,
        type: validated.type,
        quantity: validated.quantity,
        referenceType: "manual",
        notes: validated.notes || null,
      },
    })

    return NextResponse.json({ data: movement }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "Invalid adjustment data", details: error.errors } },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Failed to record adjustment" } },
      { status: 500 }
    )
  }
}
