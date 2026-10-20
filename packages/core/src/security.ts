import { createHmac, timingSafeEqual } from "node:crypto";
export function hmacSha256Hex(secret: string, body: string): string { return createHmac("sha256", secret).update(body).digest("hex"); }
export function verifyHmac(secret: string, body: string, sigHex: string): boolean {
  const exp = Buffer.from(hmacSha256Hex(secret, body), "hex"); let got: Buffer;
  try { got = Buffer.from(sigHex, "hex"); } catch { return false; }
  return got.length === exp.length && timingSafeEqual(got, exp);
}
/** Replay guard interface; production impl is DB-backed via unique UTR constraint. */
export interface ReplayStore { claim(key: string): Promise<boolean>; }
export class MemoryReplayStore implements ReplayStore {
  private seen = new Map<string, number>();
  constructor(private ttlMs = 1000 * 60 * 60 * 24 * 90) {}
  async claim(key: string) { const now = Date.now(); for (const [k, t] of this.seen) if (now - t > this.ttlMs) this.seen.delete(k);
    if (this.seen.has(key)) return false; this.seen.set(key, now); return true; }
}
/** Fixed-window in-memory rate limiter (use Redis in multi-instance deployments). */
export class RateLimiter {
  private hits = new Map<string, { n: number; reset: number }>();
  constructor(private limit: number, private windowMs: number) {}
  check(key: string): { ok: boolean; remaining: number } {
    const now = Date.now(); const h = this.hits.get(key);
    if (!h || h.reset < now) { this.hits.set(key, { n: 1, reset: now + this.windowMs }); return { ok: true, remaining: this.limit - 1 }; }
    h.n++; return { ok: h.n <= this.limit, remaining: Math.max(0, this.limit - h.n) };
  }
}
export function scoreCheckoutRisk(i: { mobile?: string; amountPaise: bigint; payerVpa?: string; blocklist?: string[] }) {
  const reasons: string[] = []; let score = 0;
  if (i.mobile && !/^(\+91)?[6-9]\d{9}$/.test(i.mobile)) { score += 40; reasons.push("invalid mobile"); }
  if (i.amountPaise > 10_000_000n) { score += 30; reasons.push("amount above ₹1,00,000"); }
  if (i.payerVpa && i.blocklist?.includes(i.payerVpa.toLowerCase())) { score += 100; reasons.push("blocklisted VPA"); }
  return { score, reasons, blocked: score >= 100 };
}
