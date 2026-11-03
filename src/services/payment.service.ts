// Payment service — payments, allocations, refunds, invoices.
// All mutations run in Prisma transactions per DATABASE.md §9.

import { prisma } from '@/lib/prisma';
import { splitGst } from '@/lib/currency';

export async function recordPayment(data: {
  paymentNumber: string;
  customerId: string;
  saleId?: string | null;
  bookingId?: string | null;
  amount: number;
  method: string;
  referenceId?: string | null;
  notes?: string | null;
  recordedById: string;
}) {
  return prisma.$transaction(async (tx) => {
    // Validate exactly one of saleId or bookingId
    const hasSale = !!data.saleId;
    const hasBooking = !!data.bookingId;
    if (hasSale === hasBooking) {
      throw new Error('Payment must allocate to exactly one of sale or booking');
    }

    const payment = await tx.payment.create({
      data: {
        paymentNumber: data.paymentNumber,
        customerId: data.customerId,
        saleId: data.saleId || null,
        bookingId: data.bookingId || null,
        amount: data.amount,
        method: data.method,
        referenceId: data.referenceId || null,
        status: 'completed',
        paidAt: new Date(),
        recordedById: data.recordedById,
        notes: data.notes || null,
      },
    });

    // Create allocation
    await tx.paymentAllocation.create({
      data: {
        paymentId: payment.id,
        saleId: data.saleId || null,
        bookingId: data.bookingId || null,
        amount: data.amount,
      },
    });

    return payment;
  });
}

export async function createRefund(data: {
  paymentId: string;
  saleId?: string | null;
  bookingId?: string | null;
  amount: number;
  reason: string;
  requestedById: string;
}) {
  return prisma.$transaction(async (tx) => {
    const payment = await tx.payment.findUnique({
      where: { id: data.paymentId },
      include: {
        allocations: true,
        refunds: true,
      },
    });
    if (!payment) throw new Error('Payment not found');

    // Calculate unrefunded balance
    const totalRefunded = payment.refunds
      .filter((r) => r.status === 'completed' || r.status === 'approved')
      .reduce((sum, r) => sum + r.amount, 0);
    const unrefunded = payment.amount - totalRefunded;
    if (data.amount > unrefunded) {
      throw new Error('Refund amount exceeds unrefunded balance');
    }

    const refund = await tx.refund.create({
      data: {
        refundNumber: `REF-${Date.now()}`,
        paymentId: data.paymentId,
        saleId: data.saleId || null,
        bookingId: data.bookingId || null,
        amount: data.amount,
        reason: data.reason,
        status: 'pending',
        requestedById: data.requestedById,
      },
    });

    return refund;
  });
}

export async function updateRefundStatus(
  refundId: string,
  action: 'approve' | 'reject' | 'complete',
  approvedById: string
) {
  return prisma.$transaction(async (tx) => {
    const refund = await tx.refund.findUnique({
      where: { id: refundId },
      include: { payment: true },
    });
    if (!refund) throw new Error('Refund not found');

    if (refund.requestedById === approvedById && action === 'approve') {
      throw new Error('Requester cannot self-approve refund');
    }

    let newStatus: string;
    switch (action) {
      case 'approve':
        if (refund.status !== 'pending') throw new Error('Refund is not pending');
        newStatus = 'approved';
        break;
      case 'reject':
        if (refund.status !== 'pending') throw new Error('Refund is not pending');
        newStatus = 'rejected';
        break;
      case 'complete':
        if (refund.status !== 'approved') throw new Error('Refund is not approved');
        newStatus = 'completed';
        break;
    }

    return tx.refund.update({
      where: { id: refundId },
      data: {
        status: newStatus,
        ...(action === 'approve' ? { approvedById } : {}),
        ...(action === 'complete' ? { processedAt: new Date() } : {}),
      },
    });
  });
}

export async function getPayments(filters?: {
  customerId?: string;
  saleId?: string;
  bookingId?: string;
  method?: string;
  dealershipId?: string;
}) {
  return prisma.payment.findMany({
    where: {
      customerId: filters?.customerId || undefined,
      saleId: filters?.saleId || undefined,
      bookingId: filters?.bookingId || undefined,
      method: filters?.method || undefined,
    },
    include: {
      customer: true,
      allocations: true,
      refunds: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function computeGstSplit(gstAmount: number, placeOfSupply: string) {
  return splitGst(gstAmount, placeOfSupply, 0);
}

export async function getRefunds(filters?: { paymentId?: string; status?: string }) {
  return prisma.refund.findMany({
    where: {
      paymentId: filters?.paymentId || undefined,
      status: filters?.status || undefined,
    },
    include: { payment: true },
    orderBy: { createdAt: 'desc' },
  });
}
