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
        firstName: validated.name.split(' ')[0] || '',
        lastName: validated.name.split(' ').slice(1).join(' ') || '',
        phone: validated.phone,
        email: validated.email || null,
        dealershipId: '00000000-0000-0000-0000-000000000000',
      },
    });

    // Create a lead from test ride
    const lead = await prisma.lead.create({
      data: {
        customerId: customer.id,
        source: 'website',
        status: 'new',
        notes: `Test ride interest: ${validated.bikeInterest}. ${validated.message || ''}`,
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
