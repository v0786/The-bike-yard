import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAuth, requireRole, authErrorResponse } from '@/lib/api-auth';

const adjustmentSchema = z.object({
  stockUnitId: z.string().uuid(),
  type: z.enum(['INWARD', 'RESERVATION_LOCK', 'YARD_TRANSFER', 'PDI_PASS', 'DISPATCH_DELIVERY']),
  notes: z.string().optional(),
});

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const user = await requireRole(['Manager', 'Super Admin', 'Owner']);

  try {
    const body = await request.json();
    const validated = adjustmentSchema.parse(body);

    const movement = await prisma.stockMovement.create({
      data: {
        stockUnitId: validated.stockUnitId,
        type: validated.type as any,
        fromLoc: '',
        toLoc: '',
        notes: validated.notes || null,
        recordedBy: '',
      },
    });

    return NextResponse.json({ data: movement }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid adjustment data',
            details: error.issues,
          },
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to record adjustment' } },
      { status: 500 }
    );
  }
}
