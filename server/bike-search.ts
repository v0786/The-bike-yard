import { SEARCH_BRANDS, detectBikeBrand, matchesBikeQuery, normalizeBikeQuery, rankBikeResults, type BikeReference, type BikeSearchResponse } from '../src/lib/bike-search.js';

const HOUR = 60 * 60 * 1000;
const MAX_HTML_BYTES = 3_000_000;
const cache = new Map<string, { html: string; retrievedAt: string; checkedAt: number; stale: boolean }>();
const pending = new Map<string, Promise<{ html: string; retrievedAt: string; checkedAt: number; stale: boolean }>>();
const BRAND_SLUGS: Record<string, string> = { 'Royal Enfield': 'royalenfield', 'Harley-Davidson': 'harleydavidson', 'Ola Electric': 'ola' };
const brandSlug = (brand: string) => BRAND_SLUGS[brand] || brand.toLowerCase().replaceAll(' ', '-');
export function safeReferenceUrl(raw: string): URL | null {
  try {
    const u = new URL(raw);
    if (u.protocol !== 'https:' || u.username || u.password || u.port || u.search || u.hash) return null;
    const bikeWalePath = /^\/[a-z-]+-bikes\/[a-zA-Z0-9-]+\/$/.test(u.pathname);
    if (u.hostname === 'www.bikewale.com' && bikeWalePath && SEARCH_BRANDS.some(b => u.pathname.startsWith(`/${brandSlug(b)}-bikes/`))) return u;
    if (u.hostname === 'www.honda2wheelersindia.com' && /^\/(motorcycle|scooter|electric)\/[a-z0-9-]+$/.test(u.pathname)) return u;
  } catch { /* invalid URLs are never fetched */ }
  return null;
}

async function sourceHtml(url: string) {
  const now = Date.now(), cached = cache.get(url);
  if (cached && now - cached.checkedAt < (cached.stale ? 60000 : HOUR)) return cached;
  if (pending.has(url)) return pending.get(url)!;
  const task = (async () => {
    try {
      const response = await fetch(url, { headers: { Accept: 'text/html', 'User-Agent': 'BikeYardReference/1.0' }, redirect: 'error', signal: AbortSignal.timeout(7000) });
      if (!response.ok || !response.headers.get('content-type')?.includes('text/html')) throw new Error('Source unavailable');
      if (Number(response.headers.get('content-length') || 0) > MAX_HTML_BYTES) throw new Error('Source too large');
      const reader = response.body?.getReader(); if (!reader) throw new Error('No source body');
      let size = 0; const chunks: Uint8Array[] = [];
      while (true) {
        const { done, value } = await reader.read(); if (done) break;
        size += value.byteLength; if (size > MAX_HTML_BYTES) { await reader.cancel(); throw new Error('Source too large'); }
        chunks.push(value);
      }
      const html = Buffer.concat(chunks).toString('utf8');
      if (/captcha|access denied|verify you are human/i.test(html.slice(0, 3000))) throw new Error('Source unavailable');
      const entry = { html, retrievedAt: new Date().toISOString(), checkedAt: now, stale: false };
      if (cache.size >= 80) cache.delete(cache.keys().next().value!);
      cache.set(url, entry); return entry;
    } catch {
      if (cached && now - Date.parse(cached.retrievedAt) < 24 * HOUR) {
        const entry = { ...cached, checkedAt: now, stale: true }; cache.set(url, entry); return entry;
      }
      // Cache source failures briefly so repeated searches don't hammer a blocked site.
      const entry = { html: '', retrievedAt: '', checkedAt: now, stale: true }; cache.set(url, entry); return entry;
    } finally { pending.delete(url); }
  })();
  pending.set(url, task); return task;
}

function plainText(value: string): string {
  return value.replace(/<[^>]*>/g, ' ').replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
}
export function parseBikeLinks(html: string, source: BikeReference['source'], brand?: string): Omit<BikeReference, 'exact' | 'retrievedAt' | 'stale'>[] {
  const results = new Map<string, Omit<BikeReference, 'exact' | 'retrievedAt' | 'stale'>>();
  const base = source === 'Honda' ? 'https://www.honda2wheelersindia.com' : 'https://www.bikewale.com';
  // Parse only public model hyperlinks; never execute upstream scripts/HTML.
  for (const match of html.matchAll(/<a\b([^>]*\bhref\s*=\s*["']([^"']+)["'][^>]*)>([\s\S]*?)<\/a>/gi)) {
    let resolved: string;
    try { resolved = new URL(match[2], base).href; } catch { continue; }
    const u = safeReferenceUrl(resolved); if (!u) continue;
    const title = match[1].match(/\btitle\s*=\s*["']([^"']+)["']/i)?.[1];
    const label = plainText(title || match[3]);
    if (!label || label.length > 90 || /[₹$€]/.test(label) || /\b(price|review|dealer|compare|news|images|videos|offers)\b/i.test(label)) continue;
    const matchedBrand = source === 'Honda' ? 'Honda' : SEARCH_BRANDS.find(b => u.pathname.startsWith(`/${brandSlug(b)}-bikes/`));
    if (!matchedBrand || (brand && brand !== matchedBrand)) continue;
    const model = label.replace(new RegExp(`^${matchedBrand}\\s+`, 'i'), '').trim();
    if (!model || model.length < 2) continue;
    results.set(u.href, { brand: matchedBrand, model, source, sourceUrl: u.href });
  }
  return [...results.values()].slice(0, 400);
}
const SPEC_NAMES = new Set(['Displacement', 'Transmission', 'Mileage - Owner Reported', 'Fuel Tank Capacity', 'Seat Height', 'Max Power(bhp)', 'Max Torque(Nm)', 'Fuel Type', 'Kerb Weight']);
export function parseSpecifications(html: string): { label: string; value: string }[] {
  const result: { label: string; value: string }[] = [];
  for (const match of html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const payload = JSON.parse(match[1]);
      const nodes = Array.isArray(payload) ? payload : payload['@graph'] || [payload];
      for (const node of nodes) {
        if (node['@type'] !== 'Product' || !Array.isArray(node.additionalProperty)) continue;
        for (const p of node.additionalProperty) {
          if (!SPEC_NAMES.has(p.name) || !['string', 'number'].includes(typeof p.value)) continue;
          const value = plainText(String(p.value) + (typeof p.unitText === 'string' ? ` ${p.unitText}` : '')).slice(0, 90);
          if (value && !/[₹$€]|\b(price|rs\.?|inr)\b/i.test(value)) result.push({ label: p.name, value });
        }
      }
    } catch { /* upstream markup changes should leave the source link usable */ }
  }
  // Price, offers, descriptions, reviews and images are deliberately ignored.
  return result.slice(0, 9);
}

export async function searchExternalBikes(query: string): Promise<BikeSearchResponse> {
  const brand = detectBikeBrand(query);
  const sources = [{ name: 'BikeWale', url: brand ? `https://www.bikewale.com/${brandSlug(brand)}-bikes/` : 'https://www.bikewale.com/new-bike-search/' }];
  if (brand === 'Honda') sources.push({ name: 'Honda', url: 'https://www.honda2wheelersindia.com/motorcycle/gold-wing-tour' });
  const responses = await Promise.all(sources.map(async source => {
    const data = await sourceHtml(source.url);
    const bikes = parseBikeLinks(data.html, source.name as BikeReference['source'], brand);
    return { source, data, bikes };
  }));
  let results = responses.flatMap(({ data, bikes }) => bikes.map(b => ({ ...b, retrievedAt: data.retrievedAt, stale: data.stale, exact: matchesBikeQuery(query, `${b.brand} ${b.model}`) })));
  // Dedupe source/model pairs and rank the model words, not only the brand.
  results = rankBikeResults([...new Map(results.map(b => [`${b.source}:${normalizeBikeQuery(b.brand + b.model)}`, b])).values()], query).slice(0, 6);
  const detailCandidates = results.filter(b => b.source === 'BikeWale').slice(0, 2);
  await Promise.all(detailCandidates.map(async bike => {
    const detail = await sourceHtml(bike.sourceUrl);
    bike.specifications = parseSpecifications(detail.html);
    if (bike.specifications.length) { bike.retrievedAt = detail.retrievedAt; bike.stale = detail.stale; }
  }));
  return { query, results, sources: responses.map(({ source, data, bikes }) => ({ name: source.name, available: bikes.length > 0, stale: data.stale })) };
}
