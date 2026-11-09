import { NextResponse } from 'next/server';
import { z } from 'zod';
import { corsPreflight, withCors } from '@/lib/cors';

// This endpoint accepts only a separately configured, approved BikeWale data feed.
// API Anything may be used by an operator to discover and validate that feed;
// it is not safe to assume a particular undocumented BikeWale endpoint exists.
const bikeSchema = z.object({
  brand: z.string().min(1).max(100),
  model: z.string().min(1).max(150),
  variant: z.string().max(150).optional(),
  engineCc: z.number().nonnegative().optional(),
  imageUrl: z.string().url().optional(),
  sourceUrl: z.string().url().optional(),
});
const feedSchema = z.array(bikeSchema).max(100);

export const runtime = 'nodejs';
export const revalidate = 3600;

export async function OPTIONS(request: Request) {
  return corsPreflight(request);
}

export async function GET(request: Request) {
  const feedUrl = process.env.BIKEWALE_APPROVED_FEED_URL;
  if (!feedUrl) {
    return withCors(
      request,
      NextResponse.json(
        { bikes: [], configured: false, source: 'BikeWale', message: 'Approved BikeWale feed is not configured.' },
        { status: 200 }
      )
    );
  }

  try {
    const parsedUrl = new URL(feedUrl);
    if (parsedUrl.protocol !== 'https:' || parsedUrl.username || parsedUrl.password) {
      throw new Error('Approved feed must be an HTTPS URL without embedded credentials.');
    }
    const allowedHost = process.env.BIKEWALE_APPROVED_FEED_HOST;
    if (!allowedHost || parsedUrl.hostname !== allowedHost) {
      throw new Error('Feed hostname does not match the configured allowlist.');
    }

    const response = await fetch(parsedUrl, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(8000),
      redirect: 'error',
      next: { revalidate: 3600 },
    });
    if (!response.ok) throw new Error('Approved feed unavailable.');
    const payload: unknown = await response.json();
    const parsed = feedSchema.safeParse(payload);
    if (!parsed.success) throw new Error('Approved feed returned an unexpected schema.');

    // Never proxy arbitrary third-party URLs or accept unsanitized HTML.
    const bikes = parsed.data.map((bike) => ({
      ...bike,
      imageUrl: bike.imageUrl && new URL(bike.imageUrl).hostname.endsWith('.bikewale.com')
        ? bike.imageUrl : undefined,
      sourceUrl: bike.sourceUrl && new URL(bike.sourceUrl).hostname.endsWith('.bikewale.com')
        ? bike.sourceUrl : undefined,
    }));
    return withCors(request, NextResponse.json({ bikes, configured: true, source: 'BikeWale' }));
  } catch {
    return withCors(
      request,
      NextResponse.json(
        { bikes: [], configured: true, source: 'BikeWale', message: 'BikeWale feed temporarily unavailable.' },
        { status: 503 }
      )
    );
  }
}
