export function rupeesToPaise(input) {
    const s = String(input).trim();
    if (!/^\d+(\.\d{1,2})?$/.test(s))
        throw new Error(`Invalid rupee amount: ${s}`);
    const [r, p = ""] = s.split(".");
    return BigInt(r) * 100n + BigInt((p + "00").slice(0, 2));
}
export function paiseToRupeeString(p) {
    const neg = p < 0n;
    const a = neg ? -p : p;
    return `${neg ? "-" : ""}${a / 100n}.${(a % 100n).toString().padStart(2, "0")}`;
}
/** Multiply by basis points (1% = 100 bp) with half-up rounding. */
export function applyBasisPoints(amount, bp) {
    const n = amount * BigInt(bp);
    return (n + 5000n) / 10000n;
}
