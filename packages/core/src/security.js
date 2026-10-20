import { createHmac, timingSafeEqual } from "node:crypto";
export function hmacSha256Hex(secret, body) { return createHmac("sha256", secret).update(body).digest("hex"); }
export function verifyHmac(secret, body, sigHex) {
    const exp = Buffer.from(hmacSha256Hex(secret, body), "hex");
    let got;
    try {
        got = Buffer.from(sigHex, "hex");
    }
    catch {
        return false;
    }
    return got.length === exp.length && timingSafeEqual(got, exp);
}
export class MemoryReplayStore {
    ttlMs;
    seen = new Map();
    constructor(ttlMs = 1000 * 60 * 60 * 24 * 90) {
        this.ttlMs = ttlMs;
    }
    async claim(key) {
        const now = Date.now();
        for (const [k, t] of this.seen)
            if (now - t > this.ttlMs)
                this.seen.delete(k);
        if (this.seen.has(key))
            return false;
        this.seen.set(key, now);
        return true;
    }
}
/** Fixed-window in-memory rate limiter (use Redis in multi-instance deployments). */
export class RateLimiter {
    limit;
    windowMs;
    hits = new Map();
    constructor(limit, windowMs) {
        this.limit = limit;
        this.windowMs = windowMs;
    }
    check(key) {
        const now = Date.now();
        const h = this.hits.get(key);
        if (!h || h.reset < now) {
            this.hits.set(key, { n: 1, reset: now + this.windowMs });
            return { ok: true, remaining: this.limit - 1 };
        }
        h.n++;
        return { ok: h.n <= this.limit, remaining: Math.max(0, this.limit - h.n) };
    }
}
export function scoreCheckoutRisk(i) {
    const reasons = [];
    let score = 0;
    if (i.mobile && !/^(\+91)?[6-9]\d{9}$/.test(i.mobile)) {
        score += 40;
        reasons.push("invalid mobile");
    }
    if (i.amountPaise > 10000000n) {
        score += 30;
        reasons.push("amount above ₹1,00,000");
    }
    if (i.payerVpa && i.blocklist?.includes(i.payerVpa.toLowerCase())) {
        score += 100;
        reasons.push("blocklisted VPA");
    }
    return { score, reasons, blocked: score >= 100 };
}
