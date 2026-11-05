// Bike catalogue read service — powers the admin review screens and the public
// showroom. Admin views see every pricing row + provider/sync metadata; public
// views see published (staff-approved) pricing only and never sync internals.

import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

export interface CatalogueSearchFilters {
  q?: string | undefined;
  brandId?: string | undefined;
  providerCode?: string | undefined;
  category?: string | undefined;
  page?: number | undefined;
  pageSize?: number | undefined;
}

function buildModelWhere(filters: CatalogueSearchFilters): Prisma.BikeModelWhereInput {
  const where: Prisma.BikeModelWhereInput = {
    isActive: true,
    deletedAt: null,
  };
  if (filters.brandId) where.brandId = filters.brandId;
  if (filters.category) where.category = filters.category;
  if (filters.providerCode) where.provider = { code: filters.providerCode };
  if (filters.q) {
    const q = filters.q;
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { slug: { contains: q, mode: 'insensitive' } },
      { brand: { name: { contains: q, mode: 'insensitive' } } },
      { variants: { some: { name: { contains: q, mode: 'insensitive' } } } },
    ];
  }
  return where;
}

/** Search models by brand / model / variant. */
export async function searchBikeModels(filters: CatalogueSearchFilters) {
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = Math.min(100, Math.max(1, filters.pageSize ?? 20));
  const where = buildModelWhere(filters);

  const [models, total] = await Promise.all([
    prisma.bikeModel.findMany({
      where,
      orderBy: [{ brand: { name: 'asc' } }, { name: 'asc' }],
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        brand: true,
        provider: true,
        _count: { select: { variants: true } },
        variants: {
          select: {
            id: true,
            name: true,
            engineCc: true,
            pricing: { select: { isPublished: true, exShowroomPricePaise: true } },
          },
        },
      },
    }),
    prisma.bikeModel.count({ where }),
  ]);

  return { models, total, page, pageSize };
}

/** Full model detail for the admin review screen. */
export async function getBikeModelDetail(idOrSlug: string) {
  const identity: Prisma.BikeModelWhereInput[] = [{ slug: idOrSlug }];
  if (isUuid(idOrSlug)) identity.push({ id: idOrSlug });

  return prisma.bikeModel.findFirst({
    where: { OR: identity, deletedAt: null },
    include: {
      brand: true,
      provider: true,
      images: { orderBy: { sortOrder: 'asc' } },
      variants: {
        where: { deletedAt: null },
        orderBy: { name: 'asc' },
        include: {
          colours: { orderBy: { name: 'asc' } },
          images: { orderBy: { sortOrder: 'asc' } },
          pricing: true,
          priceHistory: {
            orderBy: { createdAt: 'desc' },
            take: 20,
            include: { staffUser: { select: { id: true, name: true } } },
          },
        },
      },
    },
  });
}

/** Public detail — published pricing only. */
export async function getPublicBikeModelDetail(slug: string) {
  return prisma.bikeModel.findFirst({
    where: { slug, isActive: true, deletedAt: null },
    include: {
      brand: true,
      images: { orderBy: { sortOrder: 'asc' } },
      variants: {
        where: { isActive: true, deletedAt: null },
        orderBy: { name: 'asc' },
        include: {
          colours: { orderBy: { name: 'asc' } },
          images: { orderBy: { sortOrder: 'asc' } },
          pricing: { where: { isPublished: true } },
        },
      },
    },
  });
}

/** Provider registry + last sync status for the admin dashboard. */
export async function listDataProvidersWithStatus() {
  return prisma.dataProvider.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: { select: { models: true } },
      syncRuns: {
        orderBy: { startedAt: 'desc' },
        take: 1,
        select: {
          id: true,
          status: true,
          startedAt: true,
          finishedAt: true,
          errorCount: true,
        },
      },
    },
  });
}

export async function listSyncRuns(limit = 25) {
  return prisma.bikeSyncRun.findMany({
    orderBy: { startedAt: 'desc' },
    take: Math.min(200, Math.max(1, limit)),
    include: { provider: { select: { code: true, name: true } } },
  });
}

export async function listSyncErrors(limit = 100) {
  return prisma.bikeSyncLog.findMany({
    where: { level: 'ERROR' },
    orderBy: { createdAt: 'desc' },
    take: Math.min(500, Math.max(1, limit)),
    include: { run: { select: { provider: { select: { code: true } }, startedAt: true } } },
  });
}

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}
