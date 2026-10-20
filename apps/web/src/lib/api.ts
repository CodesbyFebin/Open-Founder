import { createHash, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { RateLimiter } from "@open-founder/core";
import type { ZodSchema } from "zod";
import { prisma } from "./db";
const limiter = new RateLimiter(Number(process.env.RATE_LIMIT_PER_MINUTE ?? 60), 60_000);
export const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");
export function json(data: unknown, status = 200) {
  return new NextResponse(JSON.stringify(data, (_k, v) => (typeof v === "bigint" ? v.toString() : v)), { status, headers: { "Content-Type": "application/json" } });
}
export function clientIp(req: NextRequest) { return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local"; }
export function rateLimit(req: NextRequest, bucket: string) { const r = limiter.check(`${bucket}:${clientIp(req)}`); return r.ok ? null : json({ error: "rate limited" }, 429); }
/** Bearer API-key auth. Keys are stored hashed (ApiKey.keyHash). BOOTSTRAP_API_KEY maps to BOOTSTRAP_BUSINESS_ID for first-run setup. */
export async function authenticate(req: NextRequest): Promise<{ businessId: string } | NextResponse> {
  const limited = rateLimit(req, "api"); if (limited) return limited;
  const key = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!key || key.length < 24) return json({ error: "unauthorized" }, 401);
  const boot = process.env.BOOTSTRAP_API_KEY; const bootBiz = process.env.BOOTSTRAP_BUSINESS_ID;
  if (boot && bootBiz && boot.length === key.length && timingSafeEqual(Buffer.from(boot), Buffer.from(key))) return { businessId: bootBiz };
  const row = await prisma.apiKey.findUnique({ where: { keyHash: sha256(key) } });
  if (!row || row.revokedAt) return json({ error: "unauthorized" }, 401);
  return { businessId: row.businessId };
}
export async function parseBody<T>(req: NextRequest, schema: ZodSchema<T>): Promise<T | NextResponse> {
  const raw = await req.text(); if (raw.length > 100_000) return json({ error: "payload too large" }, 413);
  let data: unknown; try { data = JSON.parse(raw); } catch { return json({ error: "invalid json" }, 400); }
  const r = schema.safeParse(data); return r.success ? r.data : json({ error: "validation failed", issues: r.error.issues }, 400);
}
