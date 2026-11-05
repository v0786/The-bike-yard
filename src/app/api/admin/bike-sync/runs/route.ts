import { NextResponse } from 'next/server';
import { requireAuth, apiErrorResponse } from '@/lib/api-auth';
import { intParam } from '@/lib/http';
import { jsonSafe } from '@/lib/json';
import { listSyncRuns } from '@/services/bike-catalogue.service';

export const dynamic = 'force-dynamic';

// GET /api/admin/bike-sync/runs — synchronisation history.
export async function GET(request: Request) {
  try {
    await requireAuth();
    const { searchParams } = new URL(request.url);
    const runs = await listSyncRuns(intParam(searchParams.get('limit'), 25, 1, 200));
    return NextResponse.json({ data: jsonSafe(runs) });
  } catch (error) {
    return apiErrorResponse(error, 'Failed to fetch sync runs');
  }
}
