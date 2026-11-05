import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAuth, requireRole, authErrorResponse } from '@/lib/api-auth';

const inwardSchema = z.object({
  chassisNumber: z.string().min(1),
  engineNumber: z.string().min(1),
  variantId: z.string().uuid(),
  colorName: z.string().min(1),
  purchasePricePaise: z.number().int().nonnegative(),
  dealershipId: z.string().uuid().optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
  inwardDate: z.string().datetime(),
});

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const user = await requireRole(['Manager', 'Super Admin', 'Owner']);

  try {
    const body = await request.json();
    const validated = inwardSchema.parse(body);

    const unit = await prisma.stockUnit.create({
      data: {
        chassisNumber: validated.chassisNumber,
        engineNumber: validated.engineNumber,
        variantId: validated.variantId,
        colorName: validated.colorName,
        dealershipId: validated.dealershipId || '00000000-0000-0000-0000-000000000000',
        purchasePricePaise: validated.purchasePricePaise,
        status: 'IN_STOCK',
        inwardDate: validated.inwardDate,
      },
    });

    await prisma.stockMovement.create({
      data: {
        stockUnitId: unit.id,
        type: 'INWARD',
        fromLoc: '',
        toLoc: '',
        notes: 'Stock inward',
        recordedBy: '',
      },
    });

    return NextResponse.json({ data: unit }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid inward data',
            details: error.issues,
          },
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to record stock inward' } },
      { status: 500 }
    );
  }
}
