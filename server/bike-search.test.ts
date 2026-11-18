import { afterEach, describe, expect, it, vi } from 'vitest';
import { parseBikeLinks, parseSpecifications, safeReferenceUrl, searchExternalBikes } from './bike-search';
import { bikeSimilarity, detectBikeBrand, matchesBikeQuery, rankBikeResults } from '../src/lib/bike-search';
import handler from '../api/bike-search';

afterEach(() => vi.unstubAllGlobals());
const referenceHtml = `<a title="Honda Goldwing" href="/honda-bikes/Goldwing/">Honda Goldwing</a><a title="Honda Unicorn" href="/honda-bikes/unicorn/">Honda Unicorn</a><a title="Honda Price Offers" href="/honda-bikes/offers/">offers</a><a href="https://evil.example/honda-bikes/evil/">Honda Evil</a>`;
const detailHtml = `<script type="application/ld+json">${JSON.stringify({ '@type': 'Product', name: 'Honda Goldwing', offers: { price: 4430000, priceCurrency: 'INR' }, description: 'Long review and pricing', image: 'https://example.com/image.jpg', additionalProperty: [{ name: 'Displacement', value: 1833, unitText: 'cc' }, { name: 'Transmission', value: '7 Speed Automatic' }, { name: 'Price', value: '₹44,30,000' }, { name: 'Fuel Type', value: 'Petrol' }] })}</script>`;

describe('bike matching', () => {
  it('matches reordered names, punctuation and spacing', () => {
    expect(matchesBikeQuery('duke 390', 'KTM 390 Duke')).toBe(true);
    expect(matchesBikeQuery('honda cb 350', 'Honda CB350')).toBe(true);
    expect(matchesBikeQuery('wingman', 'Honda Activa')).toBe(false);
  });
  it('ranks possible model corrections without inventing an exact match', () => {
    const ranked = rankBikeResults([{ brand: 'Honda', model: 'Activa' }, { brand: 'Honda', model: 'Goldwing' }, { brand: 'KTM', model: 'Duke' }], 'Honda Wingman');
    expect(ranked[0].model).toBe('Goldwing');
    expect(matchesBikeQuery('Honda Wingman', 'Honda Goldwing')).toBe(false);
    expect(bikeSimilarity('huntre', 'hunter')).toBeGreaterThan(0);
    expect(detectBikeBrand('honda wingman')).toBe('Honda');
    expect(detectBikeBrand('BigWing')).toBe('Honda');
  });
});

describe('external reference boundary', () => {
  it('allows only configured public model paths, never arbitrary URLs', () => {
    for (const u of ['http://www.bikewale.com/honda-bikes/unicorn/', 'https://www.bikewale.com.evil.example/honda-bikes/unicorn/', 'https://user:pass@www.bikewale.com/honda-bikes/unicorn/', 'https://127.0.0.1/honda-bikes/unicorn/', 'https://www.bikewale.com/honda-bikes/unicorn/?next=secret', 'https://www.bikewale.com:8080/honda-bikes/unicorn/']) expect(safeReferenceUrl(u)).toBeNull();
    expect(safeReferenceUrl('https://www.bikewale.com/honda-bikes/Goldwing/')).not.toBeNull();
  });
  it('extracts short public model identities and source links only', () => {
    expect(parseBikeLinks(referenceHtml, 'BikeWale', 'Honda').map(b => b.model)).toEqual(['Goldwing', 'Unicorn']);
    expect(parseBikeLinks('<a href="/motorcycle/gold-wing-tour">Gold Wing Tour</a>', 'Honda', 'Honda')[0].model).toBe('Gold Wing Tour');
  });
  it('never imports prices, reviews, descriptions, offers or images', () => {
    const specs = parseSpecifications(detailHtml);
    expect(specs).toContainEqual({ label: 'Displacement', value: '1833 cc' });
    const json = JSON.stringify(specs);
    for (const value of ['4430000', '₹', 'price', 'Long review', 'image.jpg']) expect(json.toLowerCase()).not.toContain(value.toLowerCase());
  });
  it('tolerates changed or broken upstream HTML', () => {
    expect(parseBikeLinks('<html>new layout</html>', 'BikeWale')).toEqual([]);
    expect(parseSpecifications('<script type="application/ld+json">not-json</script>')).toEqual([]);
  });
  it('fetches, ranks and caches source-backed results without a paid API', async () => {
    const fetchMock = vi.fn(async (url: string) => new Response(url.includes('Goldwing') ? detailHtml : url.includes('honda2wheelersindia') ? '<a href="/motorcycle/gold-wing-tour">Gold Wing Tour</a>' : referenceHtml, { headers: { 'Content-Type': 'text/html' } }));
    vi.stubGlobal('fetch', fetchMock);
    const first = await searchExternalBikes('Honda Wingman');
    expect(first.results.some(b => b.model === 'Goldwing')).toBe(true);
    expect(first.results.every(b => !b.exact && b.retrievedAt && !b.stale)).toBe(true);
    expect(JSON.stringify(first)).not.toContain('4430000');
    const calls = fetchMock.mock.calls.length;
    await searchExternalBikes('Honda Wingman');
    expect(fetchMock.mock.calls.length).toBe(calls);
  });
  it('returns unavailable source status instead of fabricated results on failure', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('Access denied', { status: 403 })));
    const result = await searchExternalBikes('Kawasaki modelxyz');
    expect(result.results).toEqual([]);
    expect(result.sources[0].available).toBe(false);
  });
});

describe('search endpoint validation', () => {
  it('rejects arbitrary URLs and oversized queries before upstream requests', async () => {
    const fetchMock = vi.fn(); vi.stubGlobal('fetch', fetchMock);
    for (const q of ['https://127.0.0.1/secret', 'x'.repeat(101), 'x']) {
      const req = { method: 'GET', url: `/api/bike-search?q=${encodeURIComponent(q)}`, headers: {}, socket: { remoteAddress: 'local-test' } };
      const res = { statusCode: 200, setHeader() {}, end() {} };
      await handler(req as never, res as never);
      expect(res.statusCode).toBe(400);
    }
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
