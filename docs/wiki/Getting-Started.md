# Getting Started

## Requirements
- Node.js 20+, npm 10+
- PostgreSQL 16 (or Docker)

## Run locally
```bash
git clone https://github.com/CodesbyFebin/Open-Founder && cd Open-Founder
cp .env.example .env            # set DATABASE_URL
npm install
npm run db:push && npm run db:seed   # prints a Business id
npm run build:packages
npm run dev                      # http://localhost:3000
```
Put the Business id from the seed into `BOOTSTRAP_BUSINESS_ID`, and set `BOOTSTRAP_API_KEY` to a random string of 24 or more characters. Use that key as `Authorization: Bearer <key>` for API calls.

## Repo layout
| Path | What |
|---|---|
| `apps/web` | Next.js app (UI + `/api/v1`) |
| `packages/core` | money (paise), GST, UPI, security |
| `packages/payment-adapters` | direct-upi, razorpay*, cashfree*, phonepe* (*stubs) |
| `packages/messaging-adapters` | console, waha, whatsapp-cloud |
| `packages/ai` | assistant (offline rules or LLM) |
| `packages/gst-mcp` | MCP server |
| `packages/sdk` | TypeScript client |
| `prisma/schema.prisma` | single database schema |
| `packaging/` | Electron desktop + Capacitor Android |
| `site/` | landing page (GitHub Pages) |

Next: [[Self-hosting with Docker]] · [[Modules]]
