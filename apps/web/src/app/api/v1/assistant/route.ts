import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { llmFromEnv, SYSTEM_PROMPT } from "@open-founder/ai";
import { json, parseBody, rateLimit } from "@/lib/api";
export const dynamic = "force-dynamic";
const Schema = z.object({ message: z.string().min(1).max(4000) });
export async function POST(req: NextRequest) {
  const l = rateLimit(req, "assistant"); if (l) return l;
  const b = await parseBody(req, Schema); if (b instanceof NextResponse) return b;
  try { return json({ reply: await llmFromEnv().chat([{ role: "system", content: SYSTEM_PROMPT }, { role: "user", content: b.message }]) }); }
  catch (e) { return json({ error: (e as Error).message }, 502); }
}
