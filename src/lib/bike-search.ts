export const PRICE_ENQUIRY = 'Price on request · Negotiable';
export const PRICE_EXPLANATION = 'Final price is confirmed by Bike Yard staff or the owner.';
export const SEARCH_BRANDS = ['Honda', 'Royal Enfield', 'KTM', 'Yamaha', 'Triumph', 'Bajaj', 'Hero', 'TVS', 'Suzuki', 'Kawasaki', 'BMW', 'Jawa', 'Yezdi', 'Aprilia', 'Vespa', 'Ather', 'Ola Electric', 'Harley-Davidson', 'Ducati'] as const;
export function normalizeBikeQuery(value: string) {
  return value.normalize('NFKD').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim().replace(/\s+/g, ' ');
}
export function matchesBikeQuery(query: string, text: string): boolean {
  const q = normalizeBikeQuery(query), haystack = normalizeBikeQuery(text);
  return !q || q.split(' ').every(token => haystack.includes(token)) || haystack.replaceAll(' ', '').includes(q.replaceAll(' ', ''));
}
function grams(text: string) {
  const s = text.replaceAll(' ', '');
  return new Set(Array.from({ length: Math.max(0, s.length - 2) }, (_, i) => s.slice(i, i + 3)));
}
export function bikeSimilarity(query: string, text: string): number {
  const q = normalizeBikeQuery(query), h = normalizeBikeQuery(text);
  if (!q) return 0;
  if (matchesBikeQuery(q, h)) return 1;
  const a = grams(q), b = grams(h);
  const overlap = [...a].filter(g => b.has(g)).length;
  return overlap / Math.max(1, a.size + b.size - overlap);
}
export function detectBikeBrand(query: string): string | undefined {
  const q = normalizeBikeQuery(query);
  if (/\bola\b/.test(q)) return 'Ola Electric';
  if (/\bbig\s?wing\b/.test(q)) return 'Honda';
  return SEARCH_BRANDS.find(brand => matchesBikeQuery(brand, q)) || SEARCH_BRANDS.find(brand => q.split(' ').some(word => word.length >= 4 && bikeSimilarity(word, brand) >= 0.35));
}
export function rankBikeResults<T extends { brand: string; model: string }>(items: T[], query: string): T[] {
  const brand = detectBikeBrand(query);
  const q = normalizeBikeQuery(query).replace(brand ? normalizeBikeQuery(brand) : /^$/, '').trim();
  const score = (bike: T) => bikeSimilarity(query, `${bike.brand} ${bike.model}`) + (brand === bike.brand ? 0.4 : 0) + bikeSimilarity(q, bike.model) - (/\[\d{4}/.test(bike.model) && !/\b(19|20)\d{2}\b/.test(query) ? 0.3 : 0);
  return [...items].sort((a, b) => score(b) - score(a)).filter(bike => score(bike) >= 0.16);
}
export interface BikeReference {
  brand: string; model: string; source: 'BikeWale' | 'Honda'; sourceUrl: string;
  retrievedAt: string; stale: boolean; exact: boolean;
  specifications?: { label: string; value: string }[];
}
export interface BikeSearchResponse {
  query: string; results: BikeReference[];
  sources: { name: string; available: boolean; stale: boolean }[];
}
