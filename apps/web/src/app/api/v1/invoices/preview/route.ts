import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { computeGst } from "@open-founder/core";
import { json, parseBody, rateLimit } from "@/lib/api";
const Schema = z.object({ placeOfSupplyStateCode: z.string().regex(/^\d{2}$/), supplierStateCode: z.string().regex(/^\d{2}$/).optional(),
  lines: z.array(z.object({ description: z.string().min(1).max(200), hsnSac: z.string().max(8).optional(), quantity: z.number().int().positive(), unitPricePaise: z.string().regex(/^\d{1,12}$/), gstRateBp: z.number().int() })).min(1).max(200) });
export async function POST(req: NextRequest) {
  const l = rateLimit(req, "preview"); if (l) return l;
  const b = await parseBody(req, Schema); if (b instanceof NextResponse) return b;
  try { return json(computeGst(b.lines.map((x) => ({ ...x, unitPricePaise: BigInt(x.unitPricePaise) })), b.supplierStateCode ?? process.env.BUSINESS_STATE_CODE ?? "32", b.placeOfSupplyStateCode)); }
  catch (e) { return json({ error: (e as Error).message }, 400); }
}
