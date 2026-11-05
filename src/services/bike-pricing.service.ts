// Bike pricing service — the ONLY code path that writes motorcycle prices.
//
// Hard rules enforced here (server-side, independent of any UI):
//   * Only PRICING_ROLES may create/edit/approve pricing.
//   * Every change writes an immutable BikePriceHistory audit row.
//   * Every change writes an AuditLog entry.
//   * Only pricing fields are accepted; API-managed specifications cannot be edited.
//   * Public reads expose approved (published) staff pricing only.
//
// The synchronisation engine has no dependency on this module.

import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';
import {
  bikePricingPublishSchema,
  bikePricingUpsertSchema,
  type BikePricingUpsertInput,
} from '@/lib/validations/bike';
import { PRICING_ROLES, assertRole } from '@/lib/roles';

export interface StaffActor {
  id: string;
  name: string;
  role?: string | undefined;
}

export interface PricingMeta {
  reason?: string | undefined;
  ipAddress?: string | undefined;
}

export class VariantNotFoundError extends Error {
  readonly code = 'VARIANT_NOT_FOUND';
  readonly status = 404;
  constructor(variantId: string) {
    super(`Bike variant not found: ${variantId}`);
    this.name = 'VariantNotFoundError';
  }
}

function computeFinalSellingPaise(input: {
  exShowroomPricePaise: number;
  insurancePaise: number;
  rtoPaise: number;
  accessoriesPaise: number;
  dealerOfferPaise: number;
}): number {
  return (
    input.exShowroomPricePaise +
    input.insurancePaise +
    input.rtoPaise +
    input.accessoriesPaise -
    input.dealerOfferPaise
  );
}

type PriceSnapshot = {
  exShowroomPricePaise: bigint;
  onRoadPricePaise: bigint | null;
  dealerOfferPaise: bigint;
  isPublished: boolean;
};

/** Compare old/new snapshots and return changed pricing field names. */
function diffFields(previous: PriceSnapshot | null, next: PriceSnapshot): string[] {
  if (!previous) return Object.keys(next);
  const changed: string[] = [];
  if (previous.exShowroomPricePaise !== next.exShowroomPricePaise)
    changed.push('exShowroomPricePaise');
  if (previous.onRoadPricePaise !== next.onRoadPricePaise) changed.push('onRoadPricePaise');
  if (previous.dealerOfferPaise !== next.dealerOfferPaise) changed.push('dealerOfferPaise');
  if (previous.isPublished !== next.isPublished) changed.push('isPublished');
  return changed;
}

/**
 * Create or update the single pricing row for a variant, recording full history.
 * Authorised staff only.
 */
export async function upsertPricing(
  input: BikePricingUpsertInput,
  staff: StaffActor,
  meta: PricingMeta = {},
) {
  assertRole(staff.role, PRICING_ROLES, 'manage bike pricing');
  const validated = bikePricingUpsertSchema.parse(input);

  return prisma.$transaction(async (tx) => {
    const variant = await tx.bikeVariant.findUnique({
      where: { id: validated.variantId },
      include: { model: { include: { brand: true } } },
    });
    if (!variant) throw new VariantNotFoundError(validated.variantId);

    const existing = await tx.bikePricing.findUnique({
      where: { variantId: validated.variantId },
    });

    const exShowroom = BigInt(validated.exShowroomPricePaise);
    const insurance = BigInt(validated.insurancePaise ?? 0);
    const rto = BigInt(validated.rtoPaise ?? 0);
    const accessories = BigInt(validated.accessoriesPaise ?? 0);
    const dealerOffer = BigInt(validated.dealerOfferPaise ?? 0);
    const onRoad =
      validated.onRoadPricePaise !== undefined
        ? BigInt(validated.onRoadPricePaise)
        : (existing?.onRoadPricePaise ?? null);
    const finalSelling =
      validated.finalSellingPricePaise !== undefined
        ? BigInt(validated.finalSellingPricePaise)
        : existing?.finalSellingPricePaise ??
          BigInt(
            computeFinalSellingPaise({
              exShowroomPricePaise: Number(exShowroom),
              insurancePaise: Number(insurance),
              rtoPaise: Number(rto),
              accessoriesPaise: Number(accessories),
              dealerOfferPaise: Number(dealerOffer),
            }),
          );

    const reason = meta.reason ?? validated.reason;
    const nextSnapshot: PriceSnapshot = {
      exShowroomPricePaise: exShowroom,
      onRoadPricePaise: onRoad,
      dealerOfferPaise: dealerOffer,
      isPublished: validated.isPublished ?? existing?.isPublished ?? false,
    };
    const previousSnapshot: PriceSnapshot | null = existing
      ? {
          exShowroomPricePaise: existing.exShowroomPricePaise,
          onRoadPricePaise: existing.onRoadPricePaise,
          dealerOfferPaise: existing.dealerOfferPaise,
          isPublished: existing.isPublished,
        }
      : null;
    const changedFields = diffFields(previousSnapshot, nextSnapshot);

    const data: Prisma.BikePricingUncheckedCreateInput = {
      variantId: validated.variantId,
      exShowroomPricePaise: exShowroom,
      onRoadPricePaise: onRoad,
      insurancePaise: insurance,
      rtoPaise: rto,
      accessoriesPaise: accessories,
      dealerOfferPaise: dealerOffer,
      finalSellingPricePaise: finalSelling,
      notes: validated.notes ?? existing?.notes ?? null,
      isPublished: nextSnapshot.isPublished,
      updatedByUserId: staff.id,
      updatedByName: staff.name,
    };

    const pricing = existing
      ? await tx.bikePricing.update({
          where: { variantId: validated.variantId },
          data: {
            ...data,
            // Publishing is a separate, explicit approval action.
            approvedByUserId: existing.approvedByUserId,
            approvedByName: existing.approvedByName,
            approvedAt: existing.approvedAt,
          },
        })
      : await tx.bikePricing.create({ data });

    await tx.bikePriceHistory.create({
      data: {
        pricingId: pricing.id,
        variantId: validated.variantId,
        changeType: existing ? 'UPDATE' : 'CREATE',
        previousExShowroomPaise: existing?.exShowroomPricePaise ?? null,
        newExShowroomPaise: exShowroom,
        previousOnRoadPricePaise: existing?.onRoadPricePaise ?? null,
        newOnRoadPricePaise: onRoad,
        previousDealerOfferPaise: existing?.dealerOfferPaise ?? null,
        newDealerOfferPaise: dealerOffer,
        previousPublished: existing?.isPublished ?? null,
        newPublished: nextSnapshot.isPublished,
        changedFields,
        staffUserId: staff.id,
        staffName: staff.name,
        reason: reason ?? null,
        ipAddress: meta.ipAddress ?? null,
      },
    });

    await tx.auditLog.create({
      data: {
        userId: staff.id,
        action: existing ? 'BIKE_PRICING_UPDATE' : 'BIKE_PRICING_CREATE',
        performedBy: staff.name,
        details: JSON.stringify({
          variantId: validated.variantId,
          bike: `${variant.model.brand?.name ?? ''} ${variant.model.name} ${variant.name}`.trim(),
          changedFields,
          previous: previousSnapshot
            ? {
                exShowroomPricePaise: previousSnapshot.exShowroomPricePaise.toString(),
                onRoadPricePaise: previousSnapshot.onRoadPricePaise?.toString() ?? null,
                isPublished: previousSnapshot.isPublished,
              }
            : null,
          next: {
            exShowroomPricePaise: exShowroom.toString(),
            onRoadPricePaise: onRoad?.toString() ?? null,
            isPublished: nextSnapshot.isPublished,
          },
          reason: reason ?? null,
        }),
        ipAddress: meta.ipAddress ?? null,
      },
    });

    return pricing;
  });
}

/** Approve / unpublish a pricing row, recording history. Authorised staff only. */
export async function setPricingPublished(
  input: { variantId: string; isPublished: boolean; reason?: string },
  staff: StaffActor,
  meta: PricingMeta = {},
) {
  assertRole(staff.role, PRICING_ROLES, 'approve bike pricing');
  const validated = bikePricingPublishSchema.parse(input);

  return prisma.$transaction(async (tx) => {
    const existing = await tx.bikePricing.findUnique({
      where: { variantId: validated.variantId },
    });
    if (!existing) {
      throw new VariantNotFoundError(validated.variantId);
    }

    const pricing = await tx.bikePricing.update({
      where: { variantId: validated.variantId },
      data: {
        isPublished: validated.isPublished,
        approvedByUserId: validated.isPublished ? staff.id : null,
        approvedByName: validated.isPublished ? staff.name : null,
        approvedAt: validated.isPublished ? new Date() : null,
      },
    });

    await tx.bikePriceHistory.create({
      data: {
        pricingId: pricing.id,
        variantId: validated.variantId,
        changeType: 'PUBLISH',
        previousExShowroomPaise: existing.exShowroomPricePaise,
        newExShowroomPaise: existing.exShowroomPricePaise,
        previousOnRoadPricePaise: existing.onRoadPricePaise,
        newOnRoadPricePaise: existing.onRoadPricePaise,
        previousPublished: existing.isPublished,
        newPublished: validated.isPublished,
        changedFields: ['isPublished'],
        staffUserId: staff.id,
        staffName: staff.name,
        reason: meta.reason ?? validated.reason ?? null,
        ipAddress: meta.ipAddress ?? null,
      },
    });

    await tx.auditLog.create({
      data: {
        userId: staff.id,
        action: validated.isPublished ? 'BIKE_PRICING_PUBLISH' : 'BIKE_PRICING_UNPUBLISH',
        performedBy: staff.name,
        details: JSON.stringify({
          variantId: validated.variantId,
          isPublished: validated.isPublished,
        }),
        ipAddress: meta.ipAddress ?? null,
      },
    });

    return pricing;
  });
}

/** Staff read: current pricing for one variant. */
export async function getPricingForVariant(variantId: string) {
  return prisma.bikePricing.findUnique({
    where: { variantId },
    include: {
      variant: { include: { model: { include: { brand: true } } } },
    },
  });
}

/** Staff read: price history for one variant, newest first. */
export async function getPriceHistory(variantId: string, take = 100) {
  return prisma.bikePriceHistory.findMany({
    where: { variantId },
    orderBy: { createdAt: 'desc' },
    take,
    include: {
      staffUser: { select: { id: true, name: true, email: true } },
    },
  });
}

/** Staff read: list pricing joined with bike identity, with optional search. */
export async function listPricing(filters?: {
  q?: string | undefined;
  brandId?: string | undefined;
}) {
  const variantConditions: Prisma.BikeVariantWhereInput[] = [];
  if (filters?.q) {
    const q = filters.q;
    variantConditions.push({
      OR: [
        { name: { contains: q, mode: 'insensitive' } },
        { model: { name: { contains: q, mode: 'insensitive' } } },
        { model: { brand: { name: { contains: q, mode: 'insensitive' } } } },
      ],
    });
  }
  if (filters?.brandId) {
    variantConditions.push({ model: { brandId: filters.brandId } });
  }
  const where: Prisma.BikePricingWhereInput =
    variantConditions.length > 0 ? { variant: { AND: variantConditions } } : {};

  return prisma.bikePricing.findMany({
    where,
    orderBy: { updatedAt: 'desc' },
    include: {
      variant: { include: { model: { include: { brand: true } } } },
    },
  });
}
