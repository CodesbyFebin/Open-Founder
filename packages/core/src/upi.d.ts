import { Paise } from "./money.js";
export declare const VPA_REGEX: RegExp;
/** Build a upi://pay deep link (NPCI UPI linking spec). Render it as a QR on the client. */
export declare function buildUpiUri(o: {
    vpa: string;
    payeeName: string;
    amountPaise: Paise;
    txnRef: string;
    note?: string;
}): string;
/** Paise-offset attribution: make concurrent sessions for the same base amount distinguishable (+1..99 paise). */
export declare function pickPaiseOffset(inUse: Set<number>): number;
export declare const UTR_REGEX: RegExp;
