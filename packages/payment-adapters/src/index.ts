import { buildUpiUri, verifyHmac, UTR_REGEX, type Paise, type ReplayStore } from "@open-founder/core";
export interface CheckoutInput { orderId: string; amountPaise: Paise; customerName?: string; customerMobile?: string; note?: string; }
export interface CheckoutSession { provider: string; sessionRef: string; amountPaise: Paise; upiUri?: string; redirectUrl?: string; expiresAt: Date; }
export interface PaymentConfirmation { sessionRef: string; utr: string; amountPaise: Paise; source: "webhook" | "imap" | "manual"; }
/** All payment providers implement this. Select via PAYMENT_PROVIDER env. */
export interface PaymentAdapter {
  readonly name: string;
  createCheckout(input: CheckoutInput): Promise<CheckoutSession>;
  /** Verify a provider/observer webhook. Returns null if invalid. */
  verifyWebhook(rawBody: string, headers: Record<string, string | undefined>): Promise<PaymentConfirmation | null>;
}
/** Direct UPI (no aggregator): dynamic UPI QR + verification via signed observer webhook or IMAP bank alerts. */
export class DirectUpiAdapter implements PaymentAdapter {
  readonly name = "direct-upi";
  constructor(private cfg: { vpa: string; payeeName: string; webhookSecret: string; ttlMs?: number }) {}
  async createCheckout(i: CheckoutInput): Promise<CheckoutSession> {
    const sessionRef = `OF${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    return { provider: this.name, sessionRef, amountPaise: i.amountPaise,
      upiUri: buildUpiUri({ vpa: this.cfg.vpa, payeeName: this.cfg.payeeName, amountPaise: i.amountPaise, txnRef: sessionRef, note: i.note ?? `Order ${i.orderId}` }),
      expiresAt: new Date(Date.now() + (this.cfg.ttlMs ?? 15 * 60_000)) };
  }
  async verifyWebhook(raw: string, h: Record<string, string | undefined>) {
    const sig = h["x-of-signature"]; if (!sig || !verifyHmac(this.cfg.webhookSecret, raw, sig)) return null;
    const b = JSON.parse(raw) as { sessionRef?: string; utr?: string; amountPaise?: string; ts?: number };
    if (!b.sessionRef || !b.utr || !UTR_REGEX.test(b.utr) || !b.amountPaise || !/^\d+$/.test(b.amountPaise)) return null;
    if (!b.ts || Math.abs(Date.now() - b.ts) > 5 * 60_000) return null; // stale => possible replay
    return { sessionRef: b.sessionRef, utr: b.utr, amountPaise: BigInt(b.amountPaise), source: "webhook" as const };
  }
}
/** Parsed bank alert email. */
export interface BankAlert { amountPaise: Paise; utr: string; ref?: string; }
/** Heuristic parser for UPI credit alert emails. Bank formats vary — extend per bank. */
export function parseBankAlert(text: string): BankAlert | null {
  if (!/credited|received/i.test(text)) return null;
  const amt = text.match(/(?:Rs\.?|INR|₹)\s?([\d,]+(?:\.\d{1,2})?)/i); const utr = text.match(/\b(\d{12})\b/);
  if (!amt || !utr) return null;
  const [r, p = ""] = amt[1].replace(/,/g, "").split(".");
  const ref = text.match(/\b(OF[A-Z0-9]{6,})\b/)?.[1];
  return { amountPaise: BigInt(r) * 100n + BigInt((p + "00").slice(0, 2)), utr: utr[1], ref };
}
/** IMAP observer STUB: wire an IMAP client (e.g. imapflow, MIT) to call onMessage with each new email body. */
export class ImapObserverStub {
  constructor(private cfg: { host?: string; user?: string }, private replay: ReplayStore, private onConfirm: (a: BankAlert) => Promise<void>) {}
  async onMessage(body: string) { const a = parseBankAlert(body); if (!a) return; if (!(await this.replay.claim(`utr:${a.utr}`))) return; await this.onConfirm(a); }
  async start() { console.warn(`[imap] stub: not connecting to ${this.cfg.host ?? "(unset)"}; feed emails via onMessage()`); }
}
/** Template for aggregator adapters (Razorpay, Cashfree, PhonePe...). Implement with their official SDK + your own keys. */
export class AggregatorStubAdapter implements PaymentAdapter {
  constructor(readonly name: string) {}
  async createCheckout(): Promise<CheckoutSession> { throw new Error(`${this.name} adapter not implemented — add official SDK and keys`); }
  async verifyWebhook() { return null; }
}
export function paymentAdapterFromEnv(env: Record<string, string | undefined> = process.env): PaymentAdapter {
  const p = (env.PAYMENT_PROVIDER ?? "direct-upi").toLowerCase();
  if (p === "direct-upi") return new DirectUpiAdapter({ vpa: env.UPI_VPA ?? "merchant@upi", payeeName: env.UPI_PAYEE_NAME ?? "Open Founder Store", webhookSecret: env.PAYMENT_WEBHOOK_SECRET ?? "" });
  return new AggregatorStubAdapter(p);
}
