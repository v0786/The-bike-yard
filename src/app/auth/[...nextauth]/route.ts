// NextAuth route handler for Auth.js (NextAuth) with App Router.
// Exports GET/POST route handlers per Next.js App Router convention so the
// route validator and request dispatch work correctly.

import { handlers } from '@/lib/auth';

export const GET = handlers.GET;
export const POST = handlers.POST;
