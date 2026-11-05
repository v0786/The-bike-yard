// Payment service — payments, allocations, refunds, invoices.
// Uses new schema: amountPaise, paymentDate, mode, receiptNumber.

import { prisma } from '@/lib/prisma';
import type { RefundStatus, Prisma } from '@prisma/client';

export async function recordPayment(data: {
  receiptNumber: string;
  saleId?: string | null;
  bookingId?: string | null;
  amountPaise: number | bigint;
  mode: string;
  transactionRef?: string | null;
  receivedBy: string;
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
        receiptNumber: data.receiptNumber,
        saleId: data.saleId ?? null,
        bookingId: data.bookingId ?? null,
        amountPaise: BigInt(data.amountPaise),
        mode: data.mode,
        transactionRef: data.transactionRef ?? null,
        receivedBy: data.receivedBy,
        status: 'SUCCESS',
      },
    });

    return payment;
  });
}

export async function createRefund(data: {
  paymentId: string;
  bookingId: string;
  amountPaise: number | bigint;
  reason: string;
  requestedBy: string;
}) {
  return prisma.$transaction(async (tx) => {
    const payment = await tx.payment.findUnique({
      where: { id: data.paymentId },
      include: {
        refunds: true,
      },
    });
    if (!payment) throw new Error('Payment not found');

    // Calculate unrefunded balance (all amounts are BigInt paise)
    const totalRefunded = payment.refunds
      .filter((r) => r.status === 'COMPLETED' || r.status === 'APPROVED')
      .reduce((sum, r) => sum + r.amountPaise, 0n);
    const unrefunded = payment.amountPaise - totalRefunded;
    if (BigInt(data.amountPaise) > unrefunded) {
      throw new Error('Refund amount exceeds unrefunded balance');
    }

    const refund = await tx.refund.create({
      data: {
        refundNumber: `REF-${Date.now()}`,
        paymentId: data.paymentId,
        bookingId: data.bookingId,
        amountPaise: BigInt(data.amountPaise),
        reason: data.reason,
        requestedBy: data.requestedBy,
        status: 'PENDING',
      },
    });

    return refund;
  });
}

export async function updateRefundStatus(
  refundId: string,
  action: 'approve' | 'reject' | 'complete',
  approvedBy: string
) {
  return prisma.$transaction(async (tx) => {
    const refund = await tx.refund.findUnique({
      where: { id: refundId },
    });
    if (!refund) throw new Error('Refund not found');

    if (refund.requestedBy === approvedBy && action === 'approve') {
      throw new Error('Requester cannot self-approve refund');
    }

    let newStatus: RefundStatus;
    switch (action) {
      case 'approve':
        if (refund.status !== 'PENDING') throw new Error('Refund is not pending');
        newStatus = 'APPROVED';
        break;
      case 'reject':
        if (refund.status !== 'PENDING') throw new Error('Refund is not pending');
        newStatus = 'REJECTED';
        break;
      case 'complete':
        if (refund.status !== 'APPROVED') throw new Error('Refund is not approved');
        newStatus = 'COMPLETED';
        break;
    }

    return tx.refund.update({
      where: { id: refundId },
      data: {
        status: newStatus,
        ...(action === 'approve' ? { approvedBy, approvedAt: new Date() } : {}),
      },
    });
  });
}

export async function getPayments(filters?: {
  saleId?: string;
  bookingId?: string;
  mode?: string;
}) {
  const where: Prisma.PaymentWhereInput = {};
  if (filters?.saleId) where.saleId = filters.saleId;
  if (filters?.bookingId) where.bookingId = filters.bookingId;
  if (filters?.mode) where.mode = filters.mode;

  return prisma.payment.findMany({
    where,
    include: {
      refunds: true,
    },
    orderBy: { paymentDate: 'desc' },
  });
}

export async function getRefunds(filters?: { paymentId?: string; status?: string }) {
  const where: Prisma.RefundWhereInput = {};
  if (filters?.paymentId) where.paymentId = filters.paymentId;
  if (filters?.status) where.status = filters.status as RefundStatus;

  return prisma.refund.findMany({
    where,
    orderBy: { requestedAt: 'desc' },
  });
}
