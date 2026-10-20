# Open Founder

**Open Founder** is a free, open-source, self-hostable business OS. One app and one PostgreSQL database cover the store, zero-fee UPI payments, WhatsApp, POS, GST billing with a built-in GST MCP server, expenses, bookings, CRM and an AI assistant.

> 🌐 Website and downloads: https://codesbyfebin.github.io/Open-Founder/

## Start here
1. [[Getting Started]]: what it is and a 5-minute local run
2. [[Installation]]: Android, Windows, Linux, CLI
3. [[Self-hosting with Docker]]
4. [[Configuration]]: every `.env` variable

## Project status (v0.1)
| Area | Status |
|---|---|
| GST math (CGST/SGST/IGST, paise-exact) | ✅ Working |
| Direct UPI QR checkout + signed webhook + UTR replay guard | ✅ Working |
| POS stock deduction + ledger | ✅ Working |
| WhatsApp via WAHA / Cloud API | ✅ Working |
| AI assistant (offline fallback / OpenAI-compatible) | ✅ Working |
| GST MCP server, SDK | ✅ Working |
| Offline queue + sync, EN/HI/ML/TA | ✅ Working (basic) |
| IMAP bank-alert watcher | 🚧 Parser only, no mailbox connection |
| Razorpay / Cashfree / PhonePe adapters | 🚧 Stubs |
| Official GSTR-1/3B JSON, e-invoice IRN | 🚧 Not implemented |
| Login UI | 🚧 API key only |
| Desktop/Android apps | 🚧 Thin shells that connect to your server |
