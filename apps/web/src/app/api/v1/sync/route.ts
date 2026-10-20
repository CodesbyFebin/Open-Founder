import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { authenticate, json, parseBody } from "@/lib/api";
import { prisma } from "@/lib/db";
export const dynamic = "force-dynamic";
const Rec = z.object({ id: z.string().max(64), kind: z.string().max(32), data: z.record(z.union([z.string().max(500), z.number(), z.boolean()])), updatedAt: z.number() });
const Schema = z.object({ records: z.array(Rec).max(500) });
const s = (v: unknown, d = "") => (typeof v === "string" ? v : v == null ? d : String(v));
const paise = (v: unknown) => { const n = Math.round(Number(v) * 100); return BigInt(Number.isFinite(n) && n >= 0 ? n : 0); };
/** Upserts offline records into Postgres (last-write-wins by client id). */
export async function POST(req: NextRequest) {
  const a = await authenticate(req); if (a instanceof NextResponse) return a;
  const b = await parseBody(req, Schema); if (b instanceof NextResponse) return b;
  let synced = 0;
  for (const r of b.records) {
    const d = r.data; const businessId = a.businessId;
    if (r.kind === "expense") await prisma.expense.upsert({ where: { id: r.id }, update: {}, create: { id: r.id, businessId, description: s(d.description, "Expense"), category: s(d.category, "General"), amountPaise: paise(d.amount), gstPaise: paise(d.gst) } });
    else if (r.kind === "staff") await prisma.staff.upsert({ where: { id: r.id }, update: { name: s(d.name) }, create: { id: r.id, businessId, name: s(d.name, "Staff"), mobile: s(d.mobile) } });
    else if (r.kind === "lead") await prisma.lead.upsert({ where: { id: r.id }, update: { stage: s(d.stage, "NEW") }, create: { id: r.id, businessId, name: s(d.name, "Lead"), mobile: s(d.mobile), stage: s(d.stage, "NEW"), notes: s(d.notes) } });
    else continue;
    synced++;
  }
  return json({ synced });
}
