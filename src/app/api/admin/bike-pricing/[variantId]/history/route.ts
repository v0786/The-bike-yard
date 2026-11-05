import { NextResponse } from 'next/server';
import { requireAuth, apiErrorResponse } from '@/lib/api-auth';
import { intParam } from '@/lib/http';
import { jsonSafe } from '@/lib/json';
import { getPriceHistory } from '@/services/bike-pricing.service';

export const dynamic = 'force-dynamic';

// GET /api/admin/bike-pricing/[variantId]/history — immutable price audit trail.
export async function GET(
  request: Request,
  { params }: { params: Promise<{ variantId: string }> },
) {
  try {
    await requireAuth();
    const { variantId } = await params;
    const { searchParams } = new URL(request.url);
    const take = intParam(searchParams.get('limit'), 100, 1, 500);

    const history = await getPriceHistory(variantId, take);
    return NextResponse.json({ data: jsonSafe(history) });
  } catch (error) {
    return apiErrorResponse(error, 'Failed to fetch price history');
  }
}
