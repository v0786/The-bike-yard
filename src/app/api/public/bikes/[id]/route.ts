import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, requireRole, authErrorResponse } from '@/lib/api-auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const user = await requireAuth();

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Bike ID is required' } },
        { status: 400 }
      );
    }

    const unit = await prisma.stockUnit.findUnique({
      where: { id },
    });

    if (!unit) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Bike not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: {
        id: unit.id,
        variantId: unit.variantId,
        colorName: unit.colorName,
        chassisNumber: unit.chassisNumber,
        engineNumber: unit.engineNumber,
        exShowroomPrice: unit.purchasePricePaise,
        onRoadPrice: unit.purchasePricePaise,
        availabilityStatus: unit.status,
      },
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch bike detail' } },
      { status: 500 }
    );
  }
}
