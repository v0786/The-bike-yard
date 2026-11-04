import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { saleCreateSchema } from '@/lib/validations';
import { requireAuth, requireRole, authErrorResponse } from '@/lib/api-auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await requireRole(['Manager', 'Super Admin', 'Owner', 'Sales Exec']);

  try {
    const sales = await prisma.sale.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ data: sales });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch sales' } },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const user = await requireRole(['Manager', 'Super Admin', 'Owner', 'Sales Exec']);

  try {
    const body = await request.json();
    const validated = saleCreateSchema.parse(body);

    const sale = await prisma.sale.create({
      data: {
        saleNumber: validated.saleNumber,
        customerId: validated.customerId,
        stockUnitId: validated.stockUnitId,
        staffId: validated.staffId || null,
        bookingId: validated.bookingId || null,
        exShowroomPrice: validated.exShowroomPrice,
        onRoadPrice: validated.onRoadPrice,
        insurancePrice: validated.insurancePrice,
        rtoCharges: validated.rtoCharges,
        accessoriesPrice: validated.accessoriesPrice,
        discount: validated.discount,
        finalSellingPrice: validated.finalSellingPrice,
        gstAmount: validated.gstAmount,
        cgstAmount: BigInt(0),
        sgstAmount: BigInt(0),
        igstAmount: BigInt(0),
        totalAmount: validated.totalAmount,
        amountPaid: validated.amountPaid,
        outstandingAmount: validated.outstandingAmount,
        placeOfSupply: validated.placeOfSupply,
        hsnCode: validated.hsnCode || null,
        gstRate: validated.gstRate,
        status: validated.amountPaid >= validated.totalAmount ? 'paid' : 'pending',
      },
    });

    // Mark unit as sold
    await prisma.stockUnit.update({
      where: { id: validated.stockUnitId },
      data: { currentStatus: 'sold' },
    });

    return NextResponse.json({ data: sale }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid sale data',
            details: error.issues.map((e) => ({
              field: e.path.join('.'),
              message: e.message,
            })),
          },
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to create sale' } },
      { status: 500 }
    );
  }
}
