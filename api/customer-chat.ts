import type { IncomingMessage, ServerResponse } from 'node:http';
import { createHash } from 'node:crypto';
import { answerCustomer, parseInput } from '../server/customer-chat.js';

export const config = { maxDuration: 30 };
const buckets = new Map<string, { count: number; expires: number }>();
// Best-effort per-instance abuse protection. Provider quotas remain essential:
// serverless instances do NOT share this map. Never retain raw IPs or messages.
export function consumeLimit(ip: string, now = Date.now()): boolean {
  for (const [key, value] of buckets) if (value.expires <= now) buckets.delete(key);
  const key = createHash('sha256').update(ip).digest('hex');
  const entry = buckets.get(key);
  if (!entry && buckets.size >= 5000) return false;
  if (!entry) { buckets.set(key, { count: 1, expires: now + 60000 }); return true; }
  return ++entry.count <= 12;
}

export default async function handler(req: IncomingMessage & { body?: unknown }, res: ServerResponse) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  const send = (status: number, body: unknown) => {
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(body));
  };
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return send(405, { error: 'Please send a chat message.' }); }
  if (!String(req.headers['content-type'] || '').startsWith('application/json')) return send(415, { error: 'Please send a valid chat message.' });
  const origin = req.headers.origin;
  if (origin) {
    try { if (new URL(origin).host !== req.headers.host) return send(403, { error: 'Please use the chat on the Bike Yard website.' }); }
    catch { return send(403, { error: 'Please use the chat on the Bike Yard website.' }); }
  }
  // Vercel sets x-forwarded-for at its trusted edge. In local dev use socket IP.
  const ip = process.env.VERCEL ? String(req.headers['x-forwarded-for'] || 'unknown').split(',')[0].trim() : req.socket.remoteAddress || 'local';
  if (!consumeLimit(ip)) { res.setHeader('Retry-After', '60'); return send(429, { error: 'Please wait a minute before sending more questions.' }); }
  try {
    let body = req.body;
    if (body === undefined) {
      const chunks: Buffer[] = [];
      let size = 0;
      for await (const chunk of req) {
        const bytes = Buffer.from(chunk);
        size += bytes.length;
        if (size > 32000) return send(413, { error: 'Please shorten your message.' });
        chunks.push(bytes);
      }
      body = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    } else if (typeof body === 'string') {
      if (Buffer.byteLength(body) > 32000) return send(413, { error: 'Please shorten your message.' });
      body = JSON.parse(body);
    } else if (Buffer.byteLength(JSON.stringify(body)) > 32000) return send(413, { error: 'Please shorten your message.' });
    const input = parseInput(body);
    if (!input) return send(400, { error: 'Use a message of 1–1,000 characters.' });
    return send(200, await answerCustomer(input));
  } catch { return send(400, { error: 'Unable to read that message. Please try again.' }); }
}
