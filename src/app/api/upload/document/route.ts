import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAuth, requireRole, authErrorResponse } from '@/lib/api-auth';

const uploadSchema = z.object({
  entityType: z.enum(['Customer', 'Sale', 'Booking']),
  entityId: z.string().uuid(),
  docType: z.enum([
    'Aadhaar',
    'PAN',
    'Form20',
    'InsuranceCopy',
    'Invoice',
    'Receipt',
    'Other',
  ]),
  fileUrl: z.string().min(1),
});

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const user = await requireAuth();

  try {
    const body = await request.json();
    const validated = uploadSchema.parse(body);

    const document = await prisma.document.create({
      data: {
        entityType: validated.entityType,
        entityId: validated.entityId,
        docType: validated.docType,
        fileUrl: validated.fileUrl,
      },
    });

    return NextResponse.json({ data: document }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid upload data',
            details: error.issues,
          },
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to upload document' } },
      { status: 500 }
    );
  }
}
