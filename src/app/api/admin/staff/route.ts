import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { requireAuth, requireRole, authErrorResponse } from '@/lib/api-auth';

const staffCreateSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
  roleId: z.string().uuid('Invalid role ID'),
});

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await requireRole(['Super Admin', 'Owner', 'Manager']);

  try {
    const staff = await prisma.user.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ data: staff });
  } catch (error) {
    return authErrorResponse(error);
  }
}

export async function POST(request: Request) {
  const user = await requireRole(['Super Admin', 'Owner', 'Manager']);

  try {
    const body = await request.json();
    const validated = staffCreateSchema.parse(body);

    // Only Super Admin/Owner can create Owner/Super Admin roles
    if (
      (validated.roleId === 'super-admin' || validated.roleId === 'owner') &&
      user.role !== 'Super Admin' &&
      user.role !== 'Owner'
    ) {
      return NextResponse.json(
        { error: { code: 'FORBIDDEN', message: 'Only Super Admin or Owner can create privileged roles' } },
        { status: 403 }
      );
    }

    const { hash } = await import('bcryptjs');
    const passwordHash = await hash(validated.password, 12);

    const staff = await prisma.user.create({
      data: {
        email: validated.email,
        passwordHash,
        firstName: validated.firstName,
        lastName: validated.lastName,
        phone: validated.phone || null,
        roleId: validated.roleId,
        dealershipId: user.dealershipId || null,
        isActive: true,
      },
    });

    return NextResponse.json({ data: staff }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid staff data',
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
