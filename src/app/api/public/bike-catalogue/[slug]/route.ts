import { NextResponse } from 'next/server';
import { getPublicBikeModelDetail } from '@/services/bike-catalogue.service';
import { jsonSafe } from '@/lib/json';

export const dynamic = 'force-dynamic';

// GET /api/public/bike-catalogue/[slug] — published detail (read-only, no auth).
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const model = await getPublicBikeModelDetail(slug);
    if (!model) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Bike model not found' } },
        { status: 404 },
      );
    }
    return NextResponse.json({ data: jsonSafe(model) });
  } catch {
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch bike model' } },
      { status: 500 },
    );
  }
}
