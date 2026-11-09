# n8n WhatsApp assistant (Meta TEST number only)

This folder contains an importable n8n starter for a **standalone alternative** to the existing backend WhatsApp integration.

## Important repository decision

The main The Bike Yard backend already implements the customer assistant in:
- `backend/src/app/api/integrations/whatsapp/webhook/route.ts`
- `backend/src/lib/integrations/whatsapp/*`

That backend already handles GET verification, POST signature validation, test-mode guard, inbound text parsing, WAMID deduplication, rate limiting, opt-out, human takeover, lead capture, grounded AI and Cloud API replies. It is the recommended source of truth.

**Do not configure Meta to send the same webhook events to both the backend and this n8n workflow.** Doing so can cause duplicate replies. Use the n8n standalone workflow only if the team deliberately chooses n8n instead of the backend for the test-number message loop.

## Files

- `01-meta-get-verification.json` — GET verification challenge.
- `02-meta-post-customer-assistant.json` — POST text-message starter, dedup, state, policy, lead capture, AI and send.
- `03-postgres-schema.sql` — tables for the standalone n8n variant.
- `04-cloudflare-worker.js` — one public callback URL dispatching GET and POST to the two n8n endpoints.
- `.env.example` — required configuration names (no secrets).

## Import

In n8n choose **Workflows → Import from File** and import the two JSON workflows separately. Both are inactive after import.

The two internal webhook paths are intentionally unique:
- GET: `/webhook/whatsapp-verify`
- POST: `/webhook/whatsapp-inbound`

Meta expects one callback URL. Put the Cloudflare Worker in front and configure:
- `N8N_VERIFY_URL` = active GET workflow production URL.
- `N8N_POST_URL` = active POST workflow production URL.

Then use the Worker URL as the Meta callback URL. The Worker preserves Meta's query string on GET and forwards POST bodies.

## Required configuration

Set the variables in `.env.example` in the n8n host's supported environment/secret configuration. The POST Code node intentionally fails closed unless:
- `WHATSAPP_MODE=test`
- `WHATSAPP_PRODUCTION_APPROVED=false`
- `WHATSAPP_PHONE_NUMBER_ID` exactly equals `WHATSAPP_TEST_PHONE_NUMBER_ID`

Assign a PostgreSQL credential to every Postgres node. Assign secure HTTP Bearer credentials or use the host's secret manager for Meta and AI API keys. Never commit tokens, app secrets, recipient phone numbers or production IDs.

## Signature verification limitation

The standalone POST workflow does not validate `X-Hub-Signature-256`. Validate the HMAC SHA-256 signature against the exact raw request bytes using `WHATSAPP_APP_SECRET` at a trusted HTTPS gateway before forwarding to n8n. Do not treat the verify token as a substitute for request-signature validation. The existing backend route already performs this check.

## Known MVP limitations

- The POST workflow handles text messages only; media and status events are ignored.
- The workflow is a starter and must be tested against the installed n8n version before activation.
- Human handover is persisted in the database; a staff notification connector still needs to be configured.
- Add per-sender rate limiting, retries, retention/deletion, monitoring and staff release controls before any wider deployment.
- Configure Meta's `messages` webhook subscription and use only the Meta-provided test phone number and approved test recipient.

## Meta test-number setup

1. Create/open the Meta Developer app and add the WhatsApp product.
2. In WhatsApp → API Setup, use only Meta's test phone number.
3. Add your own WhatsApp account as an allowed test recipient.
4. Record the test Phone Number ID and temporary access token in the secret manager.
5. Configure the Worker callback URL and verify token.
6. Subscribe to the `messages` webhook field.
7. Send test messages and verify the n8n executions and database state.

Do not migrate, disconnect, register, or modify The Bike Yard's real showroom WhatsApp Business number. Production mode remains out of scope.
