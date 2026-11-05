import { NextResponse } from 'next/server';
import { requireAuth, apiErrorResponse } from '@/lib/api-auth';
import { getBikeModelDetail } from '@/services/bike-catalogue.service';
import { jsonSafe } from '@/lib/json';

export const dynamic = 'force-dynamic';

// GET /api/admin/bike-catalogue/[id] — specs, colours, images, provider, pricing.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAuth();
    const { id } = await params;

    const model = await getBikeModelDetail(id);
    if (!model) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Bike model not found' } },
        { status: 404 },
      );
    }

    return NextResponse.json({ data: jsonSafe(model) });
  } catch (error) {
    return apiErrorResponse(error, 'Failed to fetch bike model');
  }
}
