import { paiseToRupeeString } from "./money.js";
export const VPA_REGEX = /^[a-zA-Z0-9._-]{2,256}@[a-zA-Z][a-zA-Z0-9]{1,64}$/;
/** Build a upi://pay deep link (NPCI UPI linking spec). Render it as a QR on the client. */
export function buildUpiUri(o) {
    if (!VPA_REGEX.test(o.vpa))
        throw new Error("invalid VPA");
    const p = new URLSearchParams({ pa: o.vpa, pn: o.payeeName, am: paiseToRupeeString(o.amountPaise), cu: "INR", tr: o.txnRef });
    if (o.note)
        p.set("tn", o.note.slice(0, 80));
    return `upi://pay?${p.toString()}`;
}
/** Paise-offset attribution: make concurrent sessions for the same base amount distinguishable (+1..99 paise). */
export function pickPaiseOffset(inUse) {
    for (let i = 1; i <= 99; i++)
        if (!inUse.has(i))
            return i;
    throw new Error("all paise offsets in use; queue the session");
}
export const UTR_REGEX = /^\d{12}$/;
