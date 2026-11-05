import { NextResponse } from 'next/server';
import { requireRole, apiErrorResponse } from '@/lib/api-auth';
import { SYNC_ROLES, RoleAuthorizationError } from '@/lib/roles';
import { bikeSyncTriggerSchema } from '@/lib/validations/bike';
import { runProviderSync } from '@/services/bike-sync.service';
import { ProviderError } from '@/services/bike-provider/errors';

export const dynamic = 'force-dynamic';

// POST /api/admin/bike-sync — manually trigger a synchronisation from the dashboard.
export async function POST(request: Request) {
  try {
    const user = await requireRole([...SYNC_ROLES]);
    const body = await request.json().catch(() => ({}));
    const validated = bikeSyncTriggerSchema.parse(body);

    const result = await runProviderSync({
      providerCode: validated.providerCode,
      trigger: 'MANUAL',
      actor: { id: user.id, name: user.name ?? user.email },
      force: validated.force,
    });

    return NextResponse.json({ data: result }, { status: 201 });
  } catch (error) {
    if (error instanceof ProviderError) {
      const status = error.code === 'PROVIDER_UNKNOWN' ? 404 : 409;
      return NextResponse.json(
        { error: { code: error.code, message: error.message } },
        { status },
      );
    }
    if (error instanceof RoleAuthorizationError) {
      return NextResponse.json(
        { error: { code: error.code, message: error.message } },
        { status: error.status },
      );
    }
    return apiErrorResponse(error, 'Failed to run synchronisation');
  }
}
