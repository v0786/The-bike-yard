import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { requireAuth, requireRole, authErrorResponse } from '@/lib/api-auth';

const settingsUpdateSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).optional(),
  primaryColour: z.string().optional(),
  secondaryColour: z.string().optional(),
  fontFamily: z.string().optional(),
  fontSize: z.enum(['small', 'medium', 'large']).optional(),
  sidebarMode: z.enum(['expanded', 'collapsed']).optional(),
  invoicePrefix: z.string().max(10).optional(),
  gstRateDefault: z.number().int().min(0).max(10000).optional(),
  notificationsEmail: z.boolean().optional(),
  notificationsInApp: z.boolean().optional(),
  language: z.string().optional(),
});

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await requireRole(['Super Admin', 'Owner']);

  try {
    const dealershipId = user.dealershipId || '00000000-0000-0000-0000-000000000000';
    const settings = await prisma.settings.findFirst({
      where: { dealershipId },
    });
    return NextResponse.json({ data: settings });
  } catch (error) {
    return authErrorResponse(error);
  }
}

export async function PUT(request: Request) {
  const user = await requireRole(['Super Admin', 'Owner']);

  try {
    const body = await request.json();
    const validated = settingsUpdateSchema.parse(body);

    const dealershipId = user.dealershipId || '00000000-0000-0000-0000-000000000000';

    const settings = await prisma.settings.upsert({
      where: { id: dealershipId },
      update: validated as any,
      create: {
        dealershipId,
        ...(validated as any),
      },
    });

    return NextResponse.json({ data: settings });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid settings data',
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
