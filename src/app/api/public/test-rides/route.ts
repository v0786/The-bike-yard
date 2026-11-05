import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { publicTestRideSchema } from '@/lib/validations';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = publicTestRideSchema.parse(body);

    // Create a customer from test ride booking
    const customer = await prisma.customer.create({
      data: {
        fullName: validated.name,
        phone: validated.phone,
        email: validated.email || null,
        addressLine1: '',
      },
    });

    // Create a lead from test ride
    const lead = await prisma.lead.create({
      data: {
        customerId: customer.id,
        customerName: validated.name,
        phone: validated.phone,
        email: validated.email || null,
        bikeOfInterest: validated.bikeInterest,
        source: 'WEBSITE',
        stage: 'TEST_RIDE',
        notes: `Test ride requested for ${validated.preferredDate}. ${validated.message || ''}`,
      },
    });

    // Test ride record is created when staff assigns it; public booking creates lead only
    return NextResponse.json({
      data: { customerId: customer.id, leadId: lead.id },
    });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid test ride booking data',
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
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to book test ride' } },
      { status: 500 }
    );
  }
}
