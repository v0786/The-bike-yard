import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { paymentCreateSchema } from '@/lib/validations';
import { requireAuth, requireRole, authErrorResponse } from '@/lib/api-auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await requireRole(['Manager', 'Super Admin', 'Owner', 'Accountant']);

  try {
    const payments = await prisma.payment.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ data: payments });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch payments' } },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const user = await requireRole(['Manager', 'Super Admin', 'Owner', 'Accountant']);

  try {
    const body = await request.json();
    const validated = paymentCreateSchema.parse(body);

    const payment = await prisma.payment.create({
      data: {
        paymentNumber: validated.paymentNumber,
        customerId: validated.customerId,
        saleId: validated.saleId || null,
        bookingId: validated.bookingId || null,
        amount: validated.amount,
        method: validated.method,
        referenceId: validated.referenceId || null,
        status: 'completed',
        paidAt: new Date(),
        notes: validated.notes || null,
      },
    });

    // Create allocation
    await prisma.paymentAllocation.create({
      data: {
        paymentId: payment.id,
        saleId: validated.saleId || null,
        bookingId: validated.bookingId || null,
        amount: validated.amount,
      },
    });

    return NextResponse.json({ data: payment }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid payment data',
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
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to create payment' } },
      { status: 500 }
    );
  }
}
