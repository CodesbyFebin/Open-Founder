import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { paiseToRupeeString } from "@open-founder/core";
import { paymentAdapterFromEnv } from "@open-founder/payment-adapters";
import { messagingAdapterFromEnv, templates } from "@open-founder/messaging-adapters";
import { json, rateLimit } from "@/lib/api";
import { prisma } from "@/lib/db";
export const dynamic = "force-dynamic";
/** Signed payment confirmation (from provider or from the self-hosted SMS/IMAP observer). */
export async function POST(req: NextRequest) {
  const limited = rateLimit(req, "webhook"); if (limited) return limited;
  const raw = await req.text(); if (raw.length > 20_000) return json({ error: "too large" }, 413);
  const c = await paymentAdapterFromEnv().verifyWebhook(raw, Object.fromEntries(req.headers.entries()));
  if (!c) return json({ error: "invalid signature or payload" }, 401);
  const s = await prisma.paymentSession.findUnique({ where: { sessionRef: c.sessionRef }, include: { order: { include: { customer: true } } } });
  if (!s) return json({ error: "unknown session" }, 404);
  if (s.status !== "PENDING") return json({ ok: true, idempotent: true });
  if (s.expiresAt < new Date()) return json({ error: "session expired" }, 409);
  if (c.amountPaise !== s.amountPaise) return json({ error: "amount mismatch" }, 409);
  try {
    await prisma.$transaction(async (tx) => {
      await tx.usedUtr.create({ data: { utr: c.utr } }); // throws on replay
      await tx.paymentSession.update({ where: { id: s.id }, data: { status: "PAID", utr: c.utr, source: c.source, paidAt: new Date() } });
      await tx.order.update({ where: { id: s.orderId }, data: { status: "PAID" } });
      const items = await tx.orderItem.findMany({ where: { orderId: s.orderId } });
      for (const i of items) await tx.product.update({ where: { id: i.productId }, data: { stock: { decrement: i.quantity } } });
      await tx.ledgerEntry.createMany({ data: [
        { businessId: s.order.businessId, account: "Bank:UPI", debitPaise: s.amountPaise, refType: "order", refId: s.orderId },
        { businessId: s.order.businessId, account: "Sales", creditPaise: s.amountPaise, refType: "order", refId: s.orderId } ] });
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") return json({ error: "UTR already used (replay blocked)" }, 409);
    throw e;
  }
  if (s.order.customer?.mobile) await messagingAdapterFromEnv().send({ to: s.order.customer.mobile, text: templates.paymentReceived(paiseToRupeeString(s.amountPaise), c.utr) }).catch((e) => console.error("notify failed", e));
  return json({ ok: true });
}
