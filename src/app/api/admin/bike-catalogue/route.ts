import { NextResponse } from 'next/server';
import { requireAuth, apiErrorResponse } from '@/lib/api-auth';
import { searchBikeModels } from '@/services/bike-catalogue.service';
import { jsonSafe } from '@/lib/json';
import { intParam } from '@/lib/http';

export const dynamic = 'force-dynamic';

// GET /api/admin/bike-catalogue — search imported models by brand / model / variant.
export async function GET(request: Request) {
  try {
    await requireAuth();
    const { searchParams } = new URL(request.url);

    const result = await searchBikeModels({
      q: searchParams.get('q') ?? undefined,
      brandId: searchParams.get('brandId') ?? undefined,
      providerCode: searchParams.get('providerCode') ?? undefined,
      category: searchParams.get('category') ?? undefined,
      page: intParam(searchParams.get('page'), 1, 1, 10_000),
      pageSize: intParam(searchParams.get('pageSize'), 20, 1, 100),
    });

    return NextResponse.json({
      data: jsonSafe(result.models),
      meta: { page: result.page, pageSize: result.pageSize, total: result.total },
    });
  } catch (error) {
    return apiErrorResponse(error, 'Failed to fetch bike catalogue');
  }
}
