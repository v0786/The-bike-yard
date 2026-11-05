// Stock service — inventory, stock inward/outward, reservations, movements.
// Uses new schema: status instead of currentStatus, purchasePricePaise instead of purchasePrice,
// inwardDate instead of receivedDate, colorName instead of colourId, StockUnitStatus enum.

import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import {
  stockUnitCreateSchema,
  stockMovementCreateSchema,
  reservationCreateSchema,
} from '@/lib/validations';

export async function createStockUnit(data: z.infer<typeof stockUnitCreateSchema>) {
  return prisma.$transaction(async (tx) => {
    // Validate chassis/engine uniqueness
    const existing = await tx.stockUnit.findFirst({
      where: {
        OR: [{ chassisNumber: data.chassisNumber }, { engineNumber: data.engineNumber }],
      },
    });
    if (existing) {
      throw new Error(
        existing.chassisNumber === data.chassisNumber
          ? 'Chassis number already exists'
          : 'Engine number already exists'
      );
    }

    const location = data.location ?? 'Main Showroom';

    const stockUnit = await tx.stockUnit.create({
      data: {
        chassisNumber: data.chassisNumber,
        engineNumber: data.engineNumber,
        variantId: data.variantId,
        colorName: data.colorName,
        dealershipId: data.dealershipId ?? '',
        purchasePricePaise: BigInt(data.purchasePricePaise),
        status: data.status,
        location,
        pdiPassed: data.pdiPassed ?? false,
        inwardDate: new Date(data.inwardDate),
      },
    });

    // Record movement
    await tx.stockMovement.create({
      data: {
        stockUnitId: stockUnit.id,
        type: 'INWARD',
        toLoc: location,
        notes: `Stock inward: ${data.supplierName || 'Unknown supplier'}`,
        recordedBy: 'SYSTEM',
      },
    });

    return stockUnit;
  });
}

export async function getStockUnits(filters?: {
  status?: string;
  search?: string;
  dealershipId?: string;
}) {
  const where: Prisma.StockUnitWhereInput = {};
  if (filters?.status) {
    where.status = filters.status as NonNullable<Prisma.StockUnitWhereInput['status']>;
  }
  if (filters?.dealershipId) where.dealershipId = filters.dealershipId;
  if (filters?.search) {
    where.OR = [
      { chassisNumber: { contains: filters.search, mode: 'insensitive' } },
      { engineNumber: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  return prisma.stockUnit.findMany({
    where,
    include: {
      variant: true,
      movements: true,
      reservation: true,
      sale: true,
    },
    orderBy: { inwardDate: 'desc' },
  });
}

export async function getStockUnitById(id: string) {
  return prisma.stockUnit.findUnique({
    where: { id },
    include: {
      variant: { include: { model: { include: { brand: true } } } },
      movements: { orderBy: { timestamp: 'desc' }, take: 20 },
      reservation: true,
      sale: true,
    },
  });
}

export async function createStockMovement(data: z.infer<typeof stockMovementCreateSchema>) {
  return prisma.stockMovement.create({
    data: {
      stockUnitId: data.stockUnitId,
      type: data.type,
      fromLoc: data.fromLoc ?? null,
      toLoc: data.toLoc ?? '',
      notes: data.notes ?? null,
      recordedBy: data.recordedBy ?? 'SYSTEM',
    },
  });
}

export async function createReservation(data: z.infer<typeof reservationCreateSchema>) {
  return prisma.$transaction(async (tx) => {
    // Check for existing active reservation
    const existing = await tx.reservation.findFirst({
      where: {
        stockUnitId: data.stockUnitId,
      },
    });
    if (existing) {
      throw new Error('RESERVATION_CONFLICT: Unit already has an active reservation');
    }

    // Verify unit is available
    const unit = await tx.stockUnit.findUnique({
      where: { id: data.stockUnitId },
    });
    if (!unit || unit.status !== 'IN_STOCK') {
      throw new Error('Stock unit is not available for reservation');
    }

    const reservation = await tx.reservation.create({
      data: {
        bookingId: data.bookingId,
        stockUnitId: data.stockUnitId,
        expiresAt: new Date(data.expiresAt),
      },
    });

    // Mark unit as reserved
    await tx.stockUnit.update({
      where: { id: data.stockUnitId },
      data: { status: 'RESERVED' },
    });

    // Record movement
    await tx.stockMovement.create({
      data: {
        stockUnitId: data.stockUnitId,
        type: 'RESERVATION_LOCK',
        toLoc: '',
        notes: 'Unit reserved',
        recordedBy: 'SYSTEM',
      },
    });

    return reservation;
  });
}

export async function releaseReservation(reservationId: string) {
  return prisma.$transaction(async (tx) => {
    const reservation = await tx.reservation.findUnique({
      where: { id: reservationId },
    });
    if (!reservation) {
      throw new Error('Reservation not found');
    }

    await tx.reservation.delete({ where: { id: reservationId } });

    // Mark unit as available again
    await tx.stockUnit.update({
      where: { id: reservation.stockUnitId },
      data: { status: 'IN_STOCK' },
    });

    // Record movement
    await tx.stockMovement.create({
      data: {
        stockUnitId: reservation.stockUnitId,
        type: 'YARD_TRANSFER',
        toLoc: '',
        notes: 'Reservation released',
        recordedBy: 'SYSTEM',
      },
    });

    return reservation;
  });
}

export async function getStockMovements(stockUnitId?: string) {
  const where: Prisma.StockMovementWhereInput = {};
  if (stockUnitId) where.stockUnitId = stockUnitId;

  return prisma.stockMovement.findMany({
    where,
    orderBy: { timestamp: 'desc' },
  });
}
