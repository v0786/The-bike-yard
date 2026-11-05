import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { stockUnitCreateSchema } from '@/lib/validations';
import { requireAuth, requireRole, authErrorResponse } from '@/lib/api-auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await requireRole(['Manager', 'Super Admin', 'Owner']);

  try {
    const units = await prisma.stockUnit.findMany({
      orderBy: { inwardDate: 'desc' },
    });
    return NextResponse.json({ data: units });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch stock units' } },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const user = await requireRole(['Manager', 'Super Admin', 'Owner']);

  try {
    const body = await request.json();
    const validated = stockUnitCreateSchema.parse(body);

    const unit = await prisma.stockUnit.create({
      data: {
        chassisNumber: validated.chassisNumber,
        engineNumber: validated.engineNumber,
        variantId: validated.variantId,
        colorName: validated.colorName || '',
        dealershipId: validated.dealershipId || '00000000-0000-0000-0000-000000000000',
        purchasePricePaise: validated.purchasePricePaise,
        status: validated.status as any,
      },
    });

    return NextResponse.json({ data: unit }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid stock unit data',
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
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to create stock unit' } },
      { status: 500 }
    );
  }
}
