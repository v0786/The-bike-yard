import { NextResponse } from 'next/server';
import { requireAuth, apiErrorResponse } from '@/lib/api-auth';
import { intParam } from '@/lib/http';
import { jsonSafe } from '@/lib/json';
import { listSyncErrors } from '@/services/bike-catalogue.service';

export const dynamic = 'force-dynamic';

// GET /api/admin/bike-sync/errors — recent synchronisation errors.
export async function GET(request: Request) {
  try {
    await requireAuth();
    const { searchParams } = new URL(request.url);
    const errors = await listSyncErrors(intParam(searchParams.get('limit'), 100, 1, 500));
    return NextResponse.json({ data: jsonSafe(errors) });
  } catch (error) {
    return apiErrorResponse(error, 'Failed to fetch sync errors');
  }
}
