// Stock service — inventory, stock inward/outward, reservations, movements.
// All mutations run in Prisma transactions per DATABASE.md §9.

import { prisma } from "@/lib/prisma"
import { z } from "zod"
import {
  stockUnitCreateSchema,
  stockMovementCreateSchema,
  reservationCreateSchema,
} from "@/lib/validations"

export async function createStockUnit(data: z.infer<typeof stockUnitCreateSchema>) {
  return prisma.$transaction(async (tx) => {
    // Validate chassis/engine uniqueness
    const existing = await tx.stockUnit.findFirst({
      where: {
        OR: [
          { chassisNumber: data.chassisNumber },
          { engineNumber: data.engineNumber },
        ],
      },
    })
    if (existing) {
      throw new Error(
        existing.chassisNumber === data.chassisNumber
          ? "Chassis number already exists"
          : "Engine number already exists"
      )
    }

    const stockUnit = await tx.stockUnit.create({
      data: {
        chassisNumber: data.chassisNumber,
        engineNumber: data.engineNumber,
        variantId: data.variantId,
        colourId: data.colourId || null,
        dealershipId: data.dealershipId || null,
        purchasePrice: data.purchasePrice,
        purchaseInvoiceNumber: data.purchaseInvoiceNumber || null,
        supplierName: data.supplierName || null,
        receivedDate: data.receivedDate,
        currentStatus: data.currentStatus,
        location: data.location || null,
        notes: data.notes || null,
      },
    })

    // Record movement
    await tx.stockMovement.create({
      data: {
        stockUnitId: stockUnit.id,
        type: "inward",
        quantity: 1,
        referenceType: "inward",
        notes: `Stock inward: ${data.supplierName || "Unknown supplier"}`,
        createdBy: null,
      },
    })

    return stockUnit
  })
}

export async function getStockUnits(filters?: {
  status?: string
  search?: string
  dealershipId?: string
}) {
  return prisma.stockUnit.findMany({
    where: {
      status: filters?.status || undefined,
      dealershipId: filters?.dealershipId || undefined,
      OR: filters?.search
        ? [
            { chassisNumber: { contains: filters.search, mode: "insensitive" } },
            { engineNumber: { contains: filters.search, mode: "insensitive" } },
          ]
        : undefined,
    },
    include: {
      variant: true,
      colour: true,
      _count: {
        select: { movements: true, sales: true, reservations: true },
      },
    },
    orderBy: { createdAt: "desc" },
  })
}

export async function getStockUnitById(id: string) {
  return prisma.stockUnit.findUnique({
    where: { id },
    include: {
      variant: { include: { brand: true, model: true } },
      colour: true,
      movements: { orderBy: { createdAt: "desc" }, take: 20 },
      sales: true,
      reservations: { orderBy: { reservedAt: "desc" } },
    },
  })
}

export async function createStockMovement(data: z.infer<typeof stockMovementCreateSchema>) {
  return prisma.stockMovement.create({
    data: {
      stockUnitId: data.stockUnitId,
      type: data.type,
      quantity: data.quantity,
      referenceType: data.referenceType || null,
      referenceId: data.referenceId || null,
      notes: data.notes || null,
      createdBy: null,
    },
  })
}

export async function createReservation(data: z.infer<typeof reservationCreateSchema>) {
  return prisma.$transaction(async (tx) => {
    // Check for existing active reservation (partial unique constraint equivalent)
    const existing = await tx.reservation.findFirst({
      where: {
        stockUnitId: data.stockUnitId,
        status: "active",
      },
    })
    if (existing) {
      throw new Error("RESERVATION_CONFLICT: Unit already has an active reservation")
    }

    // Verify unit is available
    const unit = await tx.stockUnit.findUnique({
      where: { id: data.stockUnitId },
    })
    if (!unit || unit.currentStatus !== "available") {
      throw new Error("Stock unit is not available for reservation")
    }

    const reservation = await tx.reservation.create({
      data: {
        stockUnitId: data.stockUnitId,
        customerId: data.customerId,
        expiresAt: data.expiresAt || null,
        status: data.status,
      },
    })

    // Mark unit as reserved
    await tx.stockUnit.update({
      where: { id: data.stockUnitId },
      data: { currentStatus: "reserved" },
    })

    // Record movement
    await tx.stockMovement.create({
      data: {
        stockUnitId: data.stockUnitId,
        type: "reservation",
        quantity: 1,
        referenceType: "booking",
        referenceId: reservation.id,
        notes: "Unit reserved",
        createdBy: null,
      },
    })

    return reservation
  })
}

export async function releaseReservation(reservationId: string) {
  return prisma.$transaction(async (tx) => {
    const reservation = await tx.reservation.update({
      where: { id: reservationId },
      data: { status: "released", releasedAt: new Date() },
      include: { stockUnit: true },
    })

    // Mark unit as available again
    await tx.stockUnit.update({
      where: { id: reservation.stockUnitId },
      data: { currentStatus: "available" },
    })

    // Record movement
    await tx.stockMovement.create({
      data: {
        stockUnitId: reservation.stockUnitId,
        type: "release",
        quantity: 1,
        referenceType: "booking",
        referenceId: reservationId,
        notes: "Reservation released",
        createdBy: null,
      },
    })

    return reservation
  })
}

export async function getStockMovements(stockUnitId?: string) {
  return prisma.stockMovement.findMany({
    where: stockUnitId ? { stockUnitId } : undefined,
    include: { stockUnit: true },
    orderBy: { createdAt: "desc" },
  })
}
