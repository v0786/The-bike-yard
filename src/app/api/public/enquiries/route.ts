import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { enquiryCreateSchema } from "@/lib/validations"
import { requireAuth, requireRole, authErrorResponse } from "@/lib/api-auth"

const enquirySchema = enquiryCreateSchema

export async function POST(request: Request) {
  const user = await requireAuth()

  try {
    const body = await request.json()
    const validated = enquirySchema.parse(body)

    // Create a customer from enquiry
    const customer = await prisma.customer.create({
      data: {
        firstName: validated.name.split(" ")[0],
        lastName: validated.name.split(" ").slice(1).join(" ") || "",
        phone: validated.phone,
        email: validated.email || null,
        dealershipId: "00000000-0000-0000-0000-000000000000", // TODO: resolve from context
      },
    })

    // Create a lead from enquiry
    const lead = await prisma.lead.create({
      data: {
        customerId: customer.id,
        source: "website",
        status: "new",
        notes: validated.message,
      },
    })

    return NextResponse.json({
      data: { customerId: customer.id, leadId: lead.id },
    })
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid enquiry data",
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
      { error: { code: "INTERNAL_ERROR", message: "Failed to submit enquiry" } },
      { status: 500 }
    )
  }
}
