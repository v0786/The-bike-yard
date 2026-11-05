import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-webhook-signature') || '';

    // Verify webhook signature (stub for MVP - real provider integration pending)
    // In production, verify against PAYMENT_WEBHOOK_SECRET
    if (!signature) {
      return NextResponse.json(
        { error: { code: 'INVALID_SIGNATURE', message: 'Missing webhook signature' } },
        { status: 400 }
      );
    }

    const payload = JSON.parse(body);
    const { paymentId, status, referenceId } = payload;

    // Idempotency: check if event already processed
    if (referenceId) {
      const existing = await prisma.payment.findFirst({
        where: { transactionRef: referenceId },
      });
      if (existing && existing.status === status) {
        return NextResponse.json({ data: { processed: false, reason: 'duplicate' } });
      }
    }

    // Update payment status
    if (paymentId) {
      await prisma.payment.update({
        where: { id: paymentId },
        data: { status: status as any, paymentDate: new Date() },
      });
    }

    return NextResponse.json({ data: { processed: true } });
  } catch (error) {
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Webhook processing failed' } },
      { status: 500 }
    );
  }
}
