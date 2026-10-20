import { NextRequest, NextResponse } from "next/server";
import { authenticate, json } from "@/lib/api";
import { prisma } from "@/lib/db";
export const dynamic = "force-dynamic";
export async function GET(req: NextRequest, ctx: { params: Promise<{ ref: string }> }) {
  const a = await authenticate(req); if (a instanceof NextResponse) return a;
  const { ref } = await ctx.params;
  const s = await prisma.paymentSession.findUnique({ where: { sessionRef: ref }, include: { order: true } });
  if (!s || s.order.businessId !== a.businessId) return json({ error: "not found" }, 404);
  const status = s.status === "PENDING" && s.expiresAt < new Date() ? "EXPIRED" : s.status;
  return json({ status, utr: s.utr ?? undefined });
}
