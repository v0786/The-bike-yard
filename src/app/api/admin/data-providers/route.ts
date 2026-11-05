import { NextResponse } from 'next/server';
import { requireAuth, apiErrorResponse } from '@/lib/api-auth';
import { jsonSafe } from '@/lib/json';
import { listDataProvidersWithStatus } from '@/services/bike-catalogue.service';
import { listProviders } from '@/services/bike-provider/registry';

export const dynamic = 'force-dynamic';

// GET /api/admin/data-providers — registry, enablement and credential status.
export async function GET() {
  try {
    await requireAuth();
    const providers = await listDataProvidersWithStatus();

    // Merge in the in-process implementation status (configured / health).
    const registered = new Map(listProviders().map((p) => [p.code, p]));
    const data = providers.map((p) => {
      const impl = registered.get(p.code);
      return {
        ...p,
        implementationRegistered: !!impl,
        configured: impl ? impl.isConfigured() : false,
      };
    });

    return NextResponse.json({ data: jsonSafe(data) });
  } catch (error) {
    return apiErrorResponse(error, 'Failed to fetch data providers');
  }
}
