import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { testRideCreateSchema } from '@/lib/validations';
import { requireAuth, requireRole, authErrorResponse } from '@/lib/api-auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await requireRole([
    'Super Admin',
    'Owner',
    'Manager',
    'Sales Exec',
    'Accountant',
  ]);

  try {
    const testRides = await prisma.testRide.findMany({
      include: {
        lead: { include: { customer: true } },
        stockUnit: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ data: testRides });
  } catch (error) {
    return authErrorResponse(error);
  }
}

export async function POST(request: Request) {
  const user = await requireRole([
    'Super Admin',
    'Owner',
    'Manager',
    'Sales Exec',
  ]);

  try {
    const body = await request.json();
    const validated = testRideCreateSchema.parse(body);

    const testRide = await prisma.testRide.create({
      data: {
        leadId: validated.leadId,
        stockUnitId: validated.stockUnitId || null,
        staffId: user.id as string,
        scheduledAt: validated.scheduledAt,
        status: 'scheduled',
      },
      include: {
        lead: { include: { customer: true } },
        stockUnit: true,
      },
    });

    return NextResponse.json({ data: testRide }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid test ride data',
            details: error.issues.map((e) => ({
              field: e.path.join('.'),
              message: e.message,
            })),
          },
        },
        { status: 400 }
      );
    }
    return authErrorResponse(error);
  }
}
