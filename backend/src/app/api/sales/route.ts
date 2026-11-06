import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireRole } from '@/lib/api-auth';
import { completeSale } from '@/services/sales.service';

export const dynamic = 'force-dynamic';

const completeSaleSchema = z.object({
  dealershipId: z.string().uuid(),
  customerId: z.string().uuid(),
  stockUnitId: z.string().uuid(),
  bookingId: z.string().uuid().optional(),
  accessoriesPaise: z.coerce.bigint().nonnegative().optional(),
  paymentMode: z.enum(['NEFT', 'UPI', 'CARD', 'CHEQUE', 'CASH']),
  salesExecutive: z.string().min(1).optional(),
});

// POST /api/sales — complete a sale (marks stock sold, creates sale + GST invoice + payment).
// Server-side role enforcement; financial values are recomputed in the service.
export async function POST(request: Request) {
  try {
    const user = await requireRole(['Manager', 'Super Admin', 'Owner']);
    const body = await request.json();
    const input = completeSaleSchema.parse(body);

    const sale = await completeSale({
      ...input,
      salesExecutive: input.salesExecutive ?? (user as { name?: string }).name ?? 'Staff',
    });

    // Serialize BigInt money fields safely.
    return NextResponse.json(
      {
        data: {
          id: sale.id,
          saleNumber: sale.saleNumber,
          status: sale.status,
          totalOnRoadPaise: sale.totalOnRoadPaise.toString(),
          gstAmountPaise: sale.gstAmountPaise.toString(),
          saleDate: sale.saleDate,
        },
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    const e = error as { name?: string; statusCode?: number; code?: string; message?: string };
    if (e?.statusCode) {
      return NextResponse.json(
        { error: { code: e.code ?? 'AUTH_ERROR', message: e.message ?? 'Authorization failed' } },
        { status: e.statusCode },
      );
    }
    if (e?.name === 'ZodError') {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Invalid sale payload' } },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to complete sale' } },
      { status: 500 },
    );
  }
}
