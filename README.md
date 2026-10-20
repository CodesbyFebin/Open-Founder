# Open Founder
<img width="1672" height="941" alt="image" src="https://github.com/user-attachments/assets/7b1e3869-68e3-43c8-923e-72260d1a0c62" />

Open-source (MIT), self-hostable business OS for founders in India: **Founder Atlas** checklists, store builder, zero-fee **direct UPI checkout** (dynamic QR), **POS**, **GST billing** (CGST/SGST vs IGST, integer paise math), expenses & inventory, bookings, staff, CRM, digital business card, a pluggable **AI assistant**, a **GST MCP server**, and a typed **backend SDK**. Works offline (PWA + IndexedDB outbox sync). UI in English, Hindi, Malayalam, Tamil.

## Stack
TypeScript · Next.js 15 (App Router) · PostgreSQL + Prisma · Docker Compose · npm workspaces

```
apps/web                    Next.js app (UI + REST API /api/v1/*)
packages/core               money (paise), GST engine, UPI URI builder, security (HMAC, replay, rate limit), Atlas tasks
packages/payment-adapters   PaymentAdapter interface, DirectUpiAdapter, IMAP bank-alert observer (stub), aggregator stubs
packages/messaging-adapters MessagingAdapter: console, WAHA (self-hosted), WhatsApp Cloud API
packages/ai                 LlmProvider: OpenAI-compatible endpoint (OpenAI/Groq/Ollama…) + offline fallback
packages/sdk                @open-founder/sdk – zero-dep typed REST client (tarball at /downloads/)
packages/gst-mcp            MCP stdio server: compute_gst_invoice, validate_gstin
prisma/schema.prisma        Single database schema
apps/web/public/prototype.html  Original single-file interactive prototype (fixed)
```
<img width="1586" height="992" alt="image" src="https://github.com/user-attachments/assets/e9d4b81c-3026-4011-836a-7cbeb18dbe0a" />



## Quick start (Docker)
```bash
cp .env.example .env        # set POSTGRES_PASSWORD, UPI_VPA, PAYMENT_WEBHOOK_SECRET, BOOTSTRAP_API_KEY (>=24 chars)
docker compose up -d --build            # add --profile whatsapp to also run WAHA
docker compose exec web node -e "1"     # container is up; schema is applied on start (prisma db push)
```
Create a business and set `BOOTSTRAP_BUSINESS_ID` (from host with DATABASE_URL pointing to the DB): `npm run db:seed "My Shop"`, then restart `web`.

## Local dev
```bash
npm install
cp .env.example .env   # point DATABASE_URL at a local Postgres
npm run db:push
npm run dev            # http://localhost:3000
npm run typecheck && npm test && npm run build
npm run sdk:pack       # builds SDK tarball into apps/web/public/downloads
npm run mcp:gst        # run GST MCP server over stdio (after build)
```

## Adapters (configured via env)
| Concern | Env | Options |
|---|---|---|
| Payments | `PAYMENT_PROVIDER` | `direct-upi` (implemented), `razorpay`/`cashfree`/`phonepe` (stubs – implement with official SDK + your keys) |
| Messaging | `MESSAGING_PROVIDER` | `console`, `waha`, `whatsapp-cloud` |
| AI | `LLM_BASE_URL`, `LLM_API_KEY`, `LLM_MODEL` | any OpenAI-compatible endpoint; blank = offline |

### Payment verification flow
1. `POST /api/v1/checkout` validates items/stock, scores risk, creates Order + PaymentSession and a `upi://pay` URI (render as QR).
2. A confirmation arrives at `POST /api/v1/webhooks/payment` with header `x-of-signature: hex(HMAC-SHA256(PAYMENT_WEBHOOK_SECRET, rawBody))` and body `{sessionRef, utr, amountPaise, ts}`. Stale timestamps (>5 min), amount mismatches, expired sessions and **reused UTRs** (unique DB constraint) are rejected. On success: order PAID, stock decremented, ledger posted, WhatsApp notification sent.
3. The IMAP observer (`ImapObserverStub`) parses bank credit alerts; wire an IMAP client to `onMessage()` to feed it.

## Security
Bearer API keys (stored SHA-256 hashed), zod validation on every endpoint, body size caps, per-IP rate limiting, HMAC webhooks with timing-safe compare, UTR replay protection, security headers. No secrets in repo – `.env.example` only.
Limitations: rate limiter is in-memory (use Redis for multiple instances); UI is local-first and does not yet have user login; GST output is an aid, not filing advice.

## License
MIT. All code here is original; no proprietary/paid-product code is included.
