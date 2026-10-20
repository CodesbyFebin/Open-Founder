# Configuration (`.env`)

| Variable | Default | Purpose |
|---|---|---|
| `POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_DB` | founder / change-me / open_founder | Database container |
| `DATABASE_URL` | postgresql://… | Prisma connection |
| `BOOTSTRAP_API_KEY` | – | First API key (≥24 chars) |
| `BOOTSTRAP_BUSINESS_ID` | – | Business id from `db:seed` |
| `RATE_LIMIT_PER_MINUTE` | 60 | Per-key API rate limit |
| `BUSINESS_STATE_CODE` | 32 | Your GST state code (32 = Kerala). Decides CGST+SGST vs IGST |
| `PAYMENT_PROVIDER` | direct-upi | `direct-upi`, `razorpay`*, `cashfree`*, `phonepe`* (*stub) |
| `UPI_VPA` / `UPI_PAYEE_NAME` | – | Payee for dynamic QR |
| `PAYMENT_WEBHOOK_SECRET` | – | HMAC secret for `x-of-signature` |
| `IMAP_HOST` / `IMAP_USER` / `IMAP_PASSWORD` | – | Bank-alert watcher (stub) |
| `MESSAGING_PROVIDER` | console | `console`, `waha`, `whatsapp-cloud` |
| `WAHA_BASE_URL` / `WAHA_API_KEY` | http://waha:3000 | WAHA |
| `WHATSAPP_CLOUD_TOKEN` / `WHATSAPP_CLOUD_PHONE_ID` | – | Meta Cloud API |
| `LLM_BASE_URL` / `LLM_API_KEY` / `LLM_MODEL` | – / – / gpt-4o-mini | Any OpenAI-compatible endpoint; blank = offline |

Never commit `.env`.
