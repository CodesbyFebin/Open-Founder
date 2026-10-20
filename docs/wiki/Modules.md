# Module Guides

Each module uses the same database, so data flows between them: an order creates an invoice, GST entries, a ledger entry and a WhatsApp receipt.

| Module | Guide | Status |
|---|---|---|
| 🛍️ Store Builder | Add products (`/api/v1/products`), share your store link; checkout uses UPI | Basic |
| 🖥️ Point of Sale | Pick items, choose Cash/Card/UPI QR; stock and ledger update | Working (state fixed to `BUSINESS_STATE_CODE`, no IGST in POS) |
| 🧾 GST Invoicing | See [[GST Billing and MCP]] | Working (no IRN) |
| 📒 Accounting / Bookkeeping | Double-entry ledger from sales and expenses | Basic, shares billing page |
| 💰 Expenses & Inventory | `POST /api/v1/expenses` with `gstPaise` to track ITC; stock on products | Basic |
| 📅 Appointments | `POST /api/v1/bookings`; WhatsApp confirmation | Basic |
| 👥 Staff | Roles in schema | UI pending |
| 🎯 CRM | Customers and leads tied to orders and chats | Basic, WhatsApp opens CRM |
| 💬 WhatsApp Hub | [[WhatsApp Setup]] | Working |
| 📣 Social campaigns / Ads | Drafted by the AI assistant | Drafts only, no ad-network posting |
| 🪪 Business Card | QR card linking to your store | Basic |
| 📋 GST Returns | GSTR summaries | 🚧 not official GSTN JSON |
| ⚖️ Legal & Docs / Founder Atlas | `/atlas`: checklists by Legal, Finance, HR, Product, Ops; each task opens the matching tool | Working |
| 🤖 AI Assistant | [[AI Assistant]] | Working |
