import { NextResponse } from 'next/server';
import { requireAuth, requireRole, apiErrorResponse } from '@/lib/api-auth';
import { PRICING_ROLES } from '@/lib/roles';
import { getClientIp } from '@/lib/http';
import { jsonSafe } from '@/lib/json';
import { listPricing, upsertPricing } from '@/services/bike-pricing.service';

export const dynamic = 'force-dynamic';

// GET /api/admin/bike-pricing — list staff-managed pricing (all staff read).
export async function GET(request: Request) {
  try {
    await requireAuth();
    const { searchParams } = new URL(request.url);
    const rows = await listPricing({
      q: searchParams.get('q') ?? undefined,
      brandId: searchParams.get('brandId') ?? undefined,
    });
    return NextResponse.json({ data: jsonSafe(rows) });
  } catch (error) {
    return apiErrorResponse(error, 'Failed to fetch pricing');
  }
}

// PUT /api/admin/bike-pricing — create/update a price. Authorised staff only.
// Server-side role check + Zod validation + full audit history.
export async function PUT(request: Request) {
  try {
    const user = await requireRole([...PRICING_ROLES]);
    const body = await request.json();
    const pricing = await upsertPricing(
      body,
      { id: user.id as string, name: user.name ?? user.email ?? 'Unknown staff', role: user.role },
      { ipAddress: getClientIp(request) ?? undefined },
    );
    return NextResponse.json({ data: jsonSafe(pricing) });
  } catch (error) {
    return apiErrorResponse(error, 'Failed to update pricing');
  }
}
