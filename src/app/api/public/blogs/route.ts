import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);

    const [blogs, total] = await Promise.all([
      prisma.blog.findMany({
        where: { published: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.blog.count({ where: { published: true } }),
    ]);

    return NextResponse.json({
      data: blogs,
      meta: { page, pageSize, total },
    });
  } catch (error) {
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch blogs' } },
      { status: 500 }
    );
  }
}
