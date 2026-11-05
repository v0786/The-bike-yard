import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { saleCreateSchema } from '@/lib/validations';
import { splitGst } from '@/lib/currency';
import { requireAuth, requireRole, authErrorResponse } from '@/lib/api-auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await requireRole(['Manager', 'Super Admin', 'Owner', 'Sales Exec']);

  try {
    const sales = await prisma.sale.findMany({
      orderBy: { saleDate: 'desc' },
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

    const exShowroomPaise = BigInt(validated.exShowroomPrice);

    const stockUnit = await prisma.stockUnit.findUnique({
      where: { id: validated.stockUnitId },
      select: { dealershipId: true },
    });
    if (!stockUnit) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Stock unit not found' } },
        { status: 404 }
      );
    }

    const gstSplit = splitGst(exShowroomPaise, validated.gstRate, false);
    const gstAmountPaise =
      validated.gstAmount > 0 ? BigInt(validated.gstAmount) : gstSplit.gstAmountPaise;
    const amountPaidPaise = BigInt(validated.amountPaid);
    const outstandingPaise = BigInt(validated.outstandingAmount);

    const sale = await prisma.sale.create({
      data: {
        saleNumber: validated.saleNumber,
        dealershipId: stockUnit.dealershipId,
        customerId: validated.customerId,
        stockUnitId: validated.stockUnitId,
        exShowroomPaise,
        gstAmountPaise,
        cgstPaise: gstSplit.cgstPaise,
        sgstPaise: gstSplit.sgstPaise,
        igstPaise: gstSplit.igstPaise,
        rtoPaise: BigInt(validated.rtoCharges),
        insurancePaise: BigInt(validated.insurancePrice),
        accessoriesPaise: BigInt(validated.accessoriesPrice),
        totalOnRoadPaise: BigInt(validated.totalAmount),
        advanceCarriedPaise: BigInt(validated.advanceAmount),
        amountPaidPaise,
        outstandingPaise,
        status: amountPaidPaise >= BigInt(validated.totalAmount) ? 'INVOICED' : 'DRAFT',
      },
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
