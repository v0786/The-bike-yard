import { NextResponse } from 'next/server';
import { requireRole, apiErrorResponse } from '@/lib/api-auth';
import { PRICING_ROLES } from '@/lib/roles';
import { getClientIp } from '@/lib/http';
import { jsonSafe } from '@/lib/json';
import { setPricingPublished } from '@/services/bike-pricing.service';

export const dynamic = 'force-dynamic';

// POST /api/admin/bike-pricing/publish — approve/unpublish a price. Staff only.
export async function POST(request: Request) {
  try {
    const user = await requireRole([...PRICING_ROLES]);
    const body = await request.json();
    const pricing = await setPricingPublished(
      body,
      { id: user.id as string, name: user.name ?? user.email ?? 'Unknown staff', role: user.role },
      { ipAddress: getClientIp(request) ?? undefined },
    );
    return NextResponse.json({ data: jsonSafe(pricing) });
  } catch (error) {
    return apiErrorResponse(error, 'Failed to update pricing approval');
  }
}
