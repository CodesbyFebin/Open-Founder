import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { scoreCheckoutRisk } from "@open-founder/core";
import { paymentAdapterFromEnv } from "@open-founder/payment-adapters";
import { authenticate, json, parseBody } from "@/lib/api";
import { prisma } from "@/lib/db";
export const dynamic = "force-dynamic";
const Schema = z.object({ items: z.array(z.object({ productId: z.string().min(1), quantity: z.number().int().min(1).max(1000) })).min(1).max(100),
  customerMobile: z.string().regex(/^(\+91)?[6-9]\d{9}$/).optional(), customerName: z.string().max(100).optional() });
export async function POST(req: NextRequest) {
  const a = await authenticate(req); if (a instanceof NextResponse) return a;
  const b = await parseBody(req, Schema); if (b instanceof NextResponse) return b;
  const products = await prisma.product.findMany({ where: { businessId: a.businessId, id: { in: b.items.map((i) => i.productId) } } });
  const byId = new Map(products.map((p) => [p.id, p]));
  let total = 0n;
  for (const i of b.items) { const p = byId.get(i.productId); if (!p) return json({ error: `unknown product ${i.productId}` }, 400);
    if (p.stock < i.quantity) return json({ error: `insufficient stock for ${p.sku}` }, 409);
    total += (p.pricePaise + (p.pricePaise * BigInt(p.gstRateBp) + 5000n) / 10000n) * BigInt(i.quantity); }
  const risk = scoreCheckoutRisk({ mobile: b.customerMobile, amountPaise: total }); if (risk.blocked) return json({ error: "checkout blocked", reasons: risk.reasons }, 403);
  const adapter = paymentAdapterFromEnv();
  const customer = b.customerMobile ? await prisma.customer.upsert({ where: { businessId_mobile: { businessId: a.businessId, mobile: b.customerMobile } }, update: {}, create: { businessId: a.businessId, mobile: b.customerMobile, name: b.customerName } }) : null;
  const order = await prisma.order.create({ data: { businessId: a.businessId, customerId: customer?.id, totalPaise: total,
    items: { create: b.items.map((i) => { const p = byId.get(i.productId)!; return { productId: p.id, quantity: i.quantity, unitPricePaise: p.pricePaise, gstRateBp: p.gstRateBp }; }) } } });
  const s = await adapter.createCheckout({ orderId: order.id, amountPaise: total, customerMobile: b.customerMobile, customerName: b.customerName });
  await prisma.paymentSession.create({ data: { orderId: order.id, provider: s.provider, sessionRef: s.sessionRef, amountPaise: s.amountPaise, upiUri: s.upiUri, expiresAt: s.expiresAt } });
  return json({ orderId: order.id, sessionRef: s.sessionRef, upiUri: s.upiUri, amountPaise: s.amountPaise, expiresAt: s.expiresAt, risk }, 201);
}
