import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { saleCreateSchema } from "@/lib/validations"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const sales = await prisma.sale.findMany({
      include: {
        customer: true,
        stockUnit: { include: { variant: { include: { brand: true, model: true } } } },
        payments: true,
        invoice: true,
      },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json({ data: sales })
  } catch (error) {
    return NextResponse.json(
      { error: { code: "INTERNAL_ERROR", message: "Failed to fetch sales" } },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validated = saleCreateSchema.parse(body)

    const sale = await prisma.sale.create({
      data: {
        saleNumber: validated.saleNumber,
        customerId: validated.customerId,
        stockUnitId: validated.stockUnitId,
        staffId: validated.staffId || null,
        bookingId: validated.bookingId || null,
        exShowroomPrice: validated.exShowroomPrice,
        insurancePrice: validated.insurancePrice,
        rtoCharges: validated.rtoCharges,
        accessoriesPrice: validated.accessoriesPrice,
        discount: validated.discount,
        finalSellingPrice: validated.finalSellingPrice,
        gstAmount: validated.gstAmount,
        totalAmount: validated.totalAmount,
        amountPaid: validated.amountPaid,
        outstandingAmount: validated.outstandingAmount,
        status: validated.amountPaid >= validated.totalAmount ? "paid" : "pending",
      },
      include: {
        customer: true,
        stockUnit: true,
      },
    })

    // Mark unit as sold
    await prisma.stockUnit.update({
      where: { id: validated.stockUnitId },
      data: { currentStatus: "sold" },
    })

    return NextResponse.json({ data: sale }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "Invalid sale data",
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
      { error: { code: "INTERNAL_ERROR", message: "Failed to create sale" } },
      { status: 500 }
    )
  }
}
