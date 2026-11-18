import type { IncomingMessage, ServerResponse } from 'node:http';
import { searchExternalBikes } from '../server/bike-search.js';
import { consumeLimit } from './customer-chat.js';
export const config = { maxDuration: 30 };
export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const send = (status: number, value: unknown) => { res.statusCode = status; res.setHeader('Content-Type', 'application/json'); res.setHeader('Cache-Control', 'no-store'); res.setHeader('X-Content-Type-Options', 'nosniff'); res.end(JSON.stringify(value)); };
  if (req.method !== 'GET') { res.setHeader('Allow', 'GET'); return send(405, { error: 'Use the bike search field.' }); }
  const query = new URL(req.url || '/', 'https://the-bike-yard.vercel.app').searchParams.get('q')?.trim();
  if (!query || query.length < 2 || query.length > 100 || !/^[\p{L}\p{N}\s.'’&()+-]+$/u.test(query)) return send(400, { error: 'Enter a bike brand or model (2–100 characters).' });
  const ip = process.env.VERCEL ? String(req.headers['x-forwarded-for'] || 'unknown').split(',')[0].trim() : req.socket.remoteAddress || 'local';
  if (!consumeLimit(`search:${ip}`)) { res.setHeader('Retry-After', '60'); return send(429, { error: 'Please wait a minute before searching again.' }); }
  try { return send(200, await searchExternalBikes(query)); }
  catch { return send(503, { error: 'External sources are temporarily unavailable. You can still browse related showroom bikes.' }); }
}
