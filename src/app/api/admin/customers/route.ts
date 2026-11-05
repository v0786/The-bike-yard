// Admin route — Manage customers
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { customerCreateSchema } from '@/lib/validations';
import { requireAuth } from '@/lib/api-auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await requireAuth();

  try {
    const customers = await prisma.customer.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ data: customers });
  } catch (error) {
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch customers' } },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const user = await requireAuth();

  try {
    const body = await request.json();
    const validated = customerCreateSchema.parse(body);

    const customer = await prisma.customer.create({
      data: {
        fullName: validated.fullName,
        phone: validated.phone,
        email: validated.email || null,
        addressLine1: validated.address || '',
        city: validated.city || 'Thane',
        pincode: validated.pincode || '400601',
      },
    });

    return NextResponse.json({ data: customer }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid customer data',
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
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to create customer' } },
      { status: 500 }
    );
  }
}