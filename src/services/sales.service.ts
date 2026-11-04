// Sales service — sale completion with stock outward, invoice, payment allocation.
// All mutations run in Prisma transactions per DATABASE.md §9.

import { prisma } from '@/lib/prisma';
import { splitGst } from '@/lib/currency';
import type { Prisma } from '@prisma/client';

export async function completeSale(data: {
  saleNumber: string;
  customerId: string;
  stockUnitId: string;
  staffId?: string | null;
  bookingId?: string | null;
  exShowroomPrice: number;
  insurancePrice?: number;
  rtoCharges?: number;
  accessoriesPrice?: number;
  discount?: number;
  finalSellingPrice: number;
  gstAmount: number;
  totalAmount: number;
  amountPaid: number;
  outstandingAmount: number;
  paymentMethod: string;
  paymentReferenceId?: string | null;
  placeOfSupply: string;
  hsnCode?: string | null;
  gstRate: number;
  recordedById: string;
}) {
  return prisma.$transaction(async (tx) => {
    // 1. Lock and validate stock unit
    const unit = await tx.stockUnit.findUnique({
      where: { id: data.stockUnitId },
    });
    if (!unit) throw new Error('Stock unit not found');
    if (unit.currentStatus !== 'available' && unit.currentStatus !== 'reserved') {
      throw new Error('Stock unit is not available for sale');
    }

    // 2. Check for active reservation conflict
    const activeReservation = await tx.reservation.findFirst({
      where: {
        stockUnitId: data.stockUnitId,
        status: 'active',
      },
    });
    if (activeReservation && activeReservation.bookingId !== data.bookingId) {
      throw new Error('Unit has an active reservation for another booking');
    }

    // 3. Compute GST split
    const { cgst, sgst, igst } = splitGst(data.gstAmount, data.placeOfSupply, data.gstRate);

    // 4. Compute on-road price from components (all in paise)
    const onRoadPrice =
      data.exShowroomPrice +
      (data.insurancePrice || 0) +
      (data.rtoCharges || 0) +
      (data.accessoriesPrice || 0) -
      (data.discount || 0);

    // 4. Create sale
    const sale = await tx.sale.create({
      data: {
        saleNumber: data.saleNumber,
        customerId: data.customerId,
        stockUnitId: data.stockUnitId,
        staffId: data.staffId || null,
        bookingId: data.bookingId || null,
        exShowroomPrice: data.exShowroomPrice,
        onRoadPrice,
        insurancePrice: data.insurancePrice || 0,
        rtoCharges: data.rtoCharges || 0,
        accessoriesPrice: data.accessoriesPrice || 0,
        discount: data.discount || 0,
        finalSellingPrice: data.finalSellingPrice,
        gstAmount: data.gstAmount,
        cgstAmount: BigInt(cgst),
        sgstAmount: BigInt(sgst),
        igstAmount: BigInt(igst),
        totalAmount: data.totalAmount,
        amountPaid: data.amountPaid,
        outstandingAmount: data.outstandingAmount,
        placeOfSupply: data.placeOfSupply,
        hsnCode: data.hsnCode || null,
        gstRate: data.gstRate,
        status: data.amountPaid >= data.totalAmount ? 'paid' : 'pending',
      },
    });

    // 5. Mark unit as sold
    await tx.stockUnit.update({
      where: { id: data.stockUnitId },
      data: { currentStatus: 'sold' },
    });

    // 6. Record movement
    await tx.stockMovement.create({
      data: {
        stockUnitId: data.stockUnitId,
        type: 'sale',
        quantity: 1,
        referenceType: 'sale',
        referenceId: sale.id,
        notes: 'Unit sold',
        createdBy: data.recordedById,
      },
    });

    // 7. Release reservation if exists
    if (activeReservation) {
      await tx.reservation.update({
        where: { id: activeReservation.id },
        data: { status: 'converted', releasedAt: new Date() },
      });
      await tx.stockMovement.create({
        data: {
          stockUnitId: data.stockUnitId,
          type: 'release',
          quantity: 1,
          referenceType: 'booking',
          referenceId: activeReservation.id,
          notes: 'Reservation converted to sale',
          createdBy: data.recordedById,
        },
      });
    }

    // 8. Record payment if amount paid > 0
    if (data.amountPaid > 0) {
      const payment = await tx.payment.create({
        data: {
          paymentNumber: `PAY-${Date.now()}`,
          customerId: data.customerId,
          saleId: sale.id,
          amount: data.amountPaid,
          method: data.paymentMethod,
          referenceId: data.paymentReferenceId || null,
          status: 'completed',
          paidAt: new Date(),
          recordedById: data.recordedById,
        },
      });
      await tx.paymentAllocation.create({
        data: {
          paymentId: payment.id,
          saleId: sale.id,
          amount: data.amountPaid,
        },
      });
    }

    return sale;
  });
}

export async function getSales(filters?: {
  customerId?: string;
  stockUnitId?: string;
  status?: string;
  dealershipId?: string;
}) {
  const where: Record<string, unknown> = {};
  if (filters?.customerId) where.customerId = filters.customerId;
  if (filters?.stockUnitId) where.stockUnitId = filters.stockUnitId;
  if (filters?.status) where.status = filters.status;

  return prisma.sale.findMany({
    where: where as Prisma.SaleWhereInput,
    include: {
      customer: true,
      stockUnit: { include: { variant: true, colour: true } },
      payments: { include: { allocations: true } },
      invoice: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getSaleById(id: string) {
  return prisma.sale.findUnique({
    where: { id },
    include: {
      customer: true,
      stockUnit: { include: { variant: { include: { brand: true, model: true } }, colour: true } },
      payments: true,
      invoice: true,
      booking: true,
    },
  });
}

export async function markSaleDelivered(id: string, deliveryDate: Date) {
  return prisma.$transaction(async (tx) => {
    const sale = await tx.sale.update({
      where: { id },
      data: { status: 'delivered', deliveryDate },
    });
    await tx.stockUnit.update({
      where: { id: sale.stockUnitId },
      data: { currentStatus: 'delivered' },
    });
    await tx.stockMovement.create({
      data: {
        stockUnitId: sale.stockUnitId,
        type: 'delivery',
        quantity: 1,
        referenceType: 'sale',
        referenceId: id,
        notes: 'Unit delivered',
        createdBy: null,
      },
    });
    return sale;
  });
}
