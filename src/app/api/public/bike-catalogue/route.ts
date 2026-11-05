import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jsonSafe } from '@/lib/json';
import { intParam } from '@/lib/http';

export const dynamic = 'force-dynamic';

// GET /api/public/bike-catalogue — published catalogue (read-only, no auth).
// Returns staff-approved (isPublished) pricing only; no sync internals.
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') ?? undefined;
    const page = intParam(searchParams.get('page'), 1, 1, 10_000);
    const pageSize = intParam(searchParams.get('pageSize'), 20, 1, 100);

    const where: any = { isActive: true, deletedAt: null };
    if (q) {
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { brand: { name: { contains: q, mode: 'insensitive' } } },
        { variants: { some: { name: { contains: q, mode: 'insensitive' } } } },
      ];
    }

    const [models, total] = await Promise.all([
      prisma.bikeModel.findMany({
        where,
        orderBy: [{ brand: { name: 'asc' } }, { name: 'asc' }],
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          brand: true,
          variants: {
            where: { isActive: true, deletedAt: null },
            select: {
              id: true,
              name: true,
              engineCc: true,
              powerBhp: true,
              mileageKmpl: true,
              colours: { select: { id: true, name: true, hexCode: true } },
              pricing: {
                where: { isPublished: true },
                select: {
                  exShowroomPricePaise: true,
                  onRoadPricePaise: true,
                  dealerOfferPaise: true,
                  finalSellingPricePaise: true,
                  isPublished: true,
                  updatedAt: true,
                },
              },
            },
          },
        },
      }),
      prisma.bikeModel.count({ where }),
    ]);

    return NextResponse.json({
      data: jsonSafe(models),
      meta: { page, pageSize, total },
    });
  } catch {
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch catalogue' } },
      { status: 500 },
    );
  }
}
