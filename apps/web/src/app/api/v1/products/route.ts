import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { GST_RATES_BP } from "@open-founder/core";
import { authenticate, json, parseBody } from "@/lib/api";
import { prisma } from "@/lib/db";
export const dynamic = "force-dynamic";
const Schema = z.object({ name: z.string().min(1).max(200), sku: z.string().min(1).max(64), hsnSac: z.string().regex(/^\d{4,8}$/).nullish(),
  pricePaise: z.string().regex(/^\d{1,12}$/), gstRateBp: z.number().int().refine((v) => (GST_RATES_BP as readonly number[]).includes(v)), stock: z.number().int().min(0) });
export async function GET(req: NextRequest) { const a = await authenticate(req); if (a instanceof NextResponse) return a;
  return json({ products: await prisma.product.findMany({ where: { businessId: a.businessId }, orderBy: { name: "asc" } }) }); }
export async function POST(req: NextRequest) { const a = await authenticate(req); if (a instanceof NextResponse) return a;
  const b = await parseBody(req, Schema); if (b instanceof NextResponse) return b;
  return json({ product: await prisma.product.create({ data: { ...b, pricePaise: BigInt(b.pricePaise), businessId: a.businessId } }) }, 201); }
