# SDK & API Reference

Base: `/api/v1`. Auth: `Authorization: Bearer <API key>`. Rate limit: `RATE_LIMIT_PER_MINUTE`.

| Method | Path | Purpose |
|---|---|---|
| GET | `/health` | Liveness |
| GET/POST | `/products` | List / create products |
| POST | `/checkout` | Create order + UPI session |
| GET | `/checkout/{ref}` | Session status |
| POST | `/webhooks/payment` | Payment confirmation (HMAC `x-of-signature`) |
| POST | `/invoices/preview` | GST computation |
| POST | `/expenses` | Record expense |
| POST | `/bookings` | Create appointment |
| POST | `/assistant` | AI assistant |
| POST | `/sync` | Offline queue upload |

## TypeScript SDK
```bash
npm run sdk:pack   # tarball in apps/web/public/downloads
```
```ts
import { OpenFounderClient } from "@open-founder/sdk";
const of = new OpenFounderClient({ baseUrl: "http://localhost:3000", apiKey: process.env.OF_KEY! });
const { products } = await of.products.list();
const co = await of.checkout.create({ items: [{ productId: products[0].id, quantity: 1 }] });
console.log(co.upiUri, await of.checkout.status(co.sessionRef));
await of.invoices.preview({ placeOfSupplyStateCode: "32", lines: [/* … */] });
await of.assistant.ask("Draft a Diwali offer post");
```
Schema: `prisma/schema.prisma`.
