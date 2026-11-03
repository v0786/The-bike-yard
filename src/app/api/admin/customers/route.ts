import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { customerCreateSchema } from "@/lib/validations"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const customers = await prisma.customer.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json({ data: customers })
  } catch (error) {
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Failed to fetch customers" } },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validated = customerCreateSchema.parse(body)

    const customer = await prisma.customer.create({
      data: {
        firstName: validated.firstName,
        lastName: validated.lastName,
        phone: validated.phone,
        email: validated.email || null,
        address: validated.address || null,
        city: validated.city || null,
        state: validated.state || null,
        pincode: validated.pincode || null,
        gstin: validated.gstin || null,
        dealershipId: "00000000-0000-0000-0000-000000000000", // TODO: resolve from auth context
      },
    })

    return NextResponse.json({ data: customer }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid customer data",
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
      { error: { code: "INTERNAL_ERROR", message: "Failed to create customer" } },
      { status: 500 }
    )
  }
}
