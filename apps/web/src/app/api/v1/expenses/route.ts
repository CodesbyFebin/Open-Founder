import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { authenticate, json, parseBody } from "@/lib/api";
import { prisma } from "@/lib/db";
export const dynamic = "force-dynamic";
const Schema = z.object({ description: z.string().min(1).max(200), category: z.string().min(1).max(50), amountPaise: z.string().regex(/^\d{1,12}$/), gstPaise: z.string().regex(/^\d{1,12}$/).optional(), vendorGstin: z.string().max(15).optional() });
export async function POST(req: NextRequest) { const a = await authenticate(req); if (a instanceof NextResponse) return a;
  const b = await parseBody(req, Schema); if (b instanceof NextResponse) return b;
  return json({ expense: await prisma.expense.create({ data: { ...b, amountPaise: BigInt(b.amountPaise), gstPaise: BigInt(b.gstPaise ?? "0"), businessId: a.businessId } }) }, 201); }
export async function GET(req: NextRequest) { const a = await authenticate(req); if (a instanceof NextResponse) return a;
  return json({ expenses: await prisma.expense.findMany({ where: { businessId: a.businessId }, orderBy: { spentAt: "desc" }, take: 200 }) }); }
