import { type Paise, type ReplayStore } from "@open-founder/core";
export interface CheckoutInput {
    orderId: string;
    amountPaise: Paise;
    customerName?: string;
    customerMobile?: string;
    note?: string;
}
export interface CheckoutSession {
    provider: string;
    sessionRef: string;
    amountPaise: Paise;
    upiUri?: string;
    redirectUrl?: string;
    expiresAt: Date;
}
export interface PaymentConfirmation {
    sessionRef: string;
    utr: string;
    amountPaise: Paise;
    source: "webhook" | "imap" | "manual";
}
/** All payment providers implement this. Select via PAYMENT_PROVIDER env. */
export interface PaymentAdapter {
    readonly name: string;
    createCheckout(input: CheckoutInput): Promise<CheckoutSession>;
    /** Verify a provider/observer webhook. Returns null if invalid. */
    verifyWebhook(rawBody: string, headers: Record<string, string | undefined>): Promise<PaymentConfirmation | null>;
}
/** Direct UPI (no aggregator): dynamic UPI QR + verification via signed observer webhook or IMAP bank alerts. */
export declare class DirectUpiAdapter implements PaymentAdapter {
    private cfg;
    readonly name = "direct-upi";
    constructor(cfg: {
        vpa: string;
        payeeName: string;
        webhookSecret: string;
        ttlMs?: number;
    });
    createCheckout(i: CheckoutInput): Promise<CheckoutSession>;
    verifyWebhook(raw: string, h: Record<string, string | undefined>): Promise<{
        sessionRef: string;
        utr: string;
        amountPaise: bigint;
        source: "webhook";
    } | null>;
}
/** Parsed bank alert email. */
export interface BankAlert {
    amountPaise: Paise;
    utr: string;
    ref?: string;
}
/** Heuristic parser for UPI credit alert emails. Bank formats vary — extend per bank. */
export declare function parseBankAlert(text: string): BankAlert | null;
/** IMAP observer STUB: wire an IMAP client (e.g. imapflow, MIT) to call onMessage with each new email body. */
export declare class ImapObserverStub {
    private cfg;
    private replay;
    private onConfirm;
    constructor(cfg: {
        host?: string;
        user?: string;
    }, replay: ReplayStore, onConfirm: (a: BankAlert) => Promise<void>);
    onMessage(body: string): Promise<void>;
    start(): Promise<void>;
}
/** Template for aggregator adapters (Razorpay, Cashfree, PhonePe...). Implement with their official SDK + your own keys. */
export declare class AggregatorStubAdapter implements PaymentAdapter {
    readonly name: string;
    constructor(name: string);
    createCheckout(): Promise<CheckoutSession>;
    verifyWebhook(): Promise<null>;
}
export declare function paymentAdapterFromEnv(env?: Record<string, string | undefined>): PaymentAdapter;
