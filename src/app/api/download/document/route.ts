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
        { error: { code: 'VALIDATION_ERROR', message: 'Document ID is required' } },
        { status: 400 }
      );
    }

    const document = await prisma.document.findUnique({
      where: { id },
    });

    if (!document || document.deletedAt) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Document not found' } },
        { status: 404 }
      );
    }

    // Return signed URL placeholder - actual signing happens in storage layer
    return NextResponse.json({
      data: {
        id: document.id,
        entityType: document.entityType,
        entityId: document.entityId,
        docType: document.docType,
        fileUrl: document.fileUrl,
        uploadedAt: document.uploadedAt,
        signedUrl: `/api/download/document/${id}`, // placeholder
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to get document' } },
      { status: 500 }
    );
  }
}
