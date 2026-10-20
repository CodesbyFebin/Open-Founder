import { buildUpiUri, verifyHmac, UTR_REGEX } from "@open-founder/core";
/** Direct UPI (no aggregator): dynamic UPI QR + verification via signed observer webhook or IMAP bank alerts. */
export class DirectUpiAdapter {
    cfg;
    name = "direct-upi";
    constructor(cfg) {
        this.cfg = cfg;
    }
    async createCheckout(i) {
        const sessionRef = `OF${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
        return { provider: this.name, sessionRef, amountPaise: i.amountPaise,
            upiUri: buildUpiUri({ vpa: this.cfg.vpa, payeeName: this.cfg.payeeName, amountPaise: i.amountPaise, txnRef: sessionRef, note: i.note ?? `Order ${i.orderId}` }),
            expiresAt: new Date(Date.now() + (this.cfg.ttlMs ?? 15 * 60_000)) };
    }
    async verifyWebhook(raw, h) {
        const sig = h["x-of-signature"];
        if (!sig || !verifyHmac(this.cfg.webhookSecret, raw, sig))
            return null;
        const b = JSON.parse(raw);
        if (!b.sessionRef || !b.utr || !UTR_REGEX.test(b.utr) || !b.amountPaise || !/^\d+$/.test(b.amountPaise))
            return null;
        if (!b.ts || Math.abs(Date.now() - b.ts) > 5 * 60_000)
            return null; // stale => possible replay
        return { sessionRef: b.sessionRef, utr: b.utr, amountPaise: BigInt(b.amountPaise), source: "webhook" };
    }
}
/** Heuristic parser for UPI credit alert emails. Bank formats vary — extend per bank. */
export function parseBankAlert(text) {
    if (!/credited|received/i.test(text))
        return null;
    const amt = text.match(/(?:Rs\.?|INR|₹)\s?([\d,]+(?:\.\d{1,2})?)/i);
    const utr = text.match(/\b(\d{12})\b/);
    if (!amt || !utr)
        return null;
    const [r, p = ""] = amt[1].replace(/,/g, "").split(".");
    const ref = text.match(/\b(OF[A-Z0-9]{6,})\b/)?.[1];
    return { amountPaise: BigInt(r) * 100n + BigInt((p + "00").slice(0, 2)), utr: utr[1], ref };
}
/** IMAP observer STUB: wire an IMAP client (e.g. imapflow, MIT) to call onMessage with each new email body. */
export class ImapObserverStub {
    cfg;
    replay;
    onConfirm;
    constructor(cfg, replay, onConfirm) {
        this.cfg = cfg;
        this.replay = replay;
        this.onConfirm = onConfirm;
    }
    async onMessage(body) { const a = parseBankAlert(body); if (!a)
        return; if (!(await this.replay.claim(`utr:${a.utr}`)))
        return; await this.onConfirm(a); }
    async start() { console.warn(`[imap] stub: not connecting to ${this.cfg.host ?? "(unset)"}; feed emails via onMessage()`); }
}
/** Template for aggregator adapters (Razorpay, Cashfree, PhonePe...). Implement with their official SDK + your own keys. */
export class AggregatorStubAdapter {
    name;
    constructor(name) {
        this.name = name;
    }
    async createCheckout() { throw new Error(`${this.name} adapter not implemented — add official SDK and keys`); }
    async verifyWebhook() { return null; }
}
export function paymentAdapterFromEnv(env = process.env) {
    const p = (env.PAYMENT_PROVIDER ?? "direct-upi").toLowerCase();
    if (p === "direct-upi")
        return new DirectUpiAdapter({ vpa: env.UPI_VPA ?? "merchant@upi", payeeName: env.UPI_PAYEE_NAME ?? "Open Founder Store", webhookSecret: env.PAYMENT_WEBHOOK_SECRET ?? "" });
    return new AggregatorStubAdapter(p);
}
