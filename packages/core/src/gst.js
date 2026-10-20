import { applyBasisPoints } from "./money.js";
export const GST_RATES_BP = [0, 25, 300, 500, 1200, 1800, 2800];
export const GSTIN_REGEX = /^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
export function isValidGstin(g) { return GSTIN_REGEX.test(g.toUpperCase()); }
/** Intra-state supply => CGST+SGST (half each); inter-state => IGST. */
export function computeGst(lines, supplierStateCode, placeOfSupplyStateCode) {
    const interState = supplierStateCode !== placeOfSupplyStateCode;
    const out = lines.map((l) => {
        if (!Number.isInteger(l.quantity) || l.quantity <= 0)
            throw new Error("quantity must be positive integer");
        if (!GST_RATES_BP.includes(l.gstRateBp))
            throw new Error(`unsupported GST rate ${l.gstRateBp}bp`);
        const taxable = l.unitPricePaise * BigInt(l.quantity);
        const tax = applyBasisPoints(taxable, l.gstRateBp);
        const cgst = interState ? 0n : tax / 2n;
        const sgst = interState ? 0n : tax - cgst;
        const igst = interState ? tax : 0n;
        return { ...l, taxablePaise: taxable, cgstPaise: cgst, sgstPaise: sgst, igstPaise: igst, totalPaise: taxable + tax };
    });
    const sum = (k) => out.reduce((a, l) => a + l[k], 0n);
    return { lines: out, taxablePaise: sum("taxablePaise"), cgstPaise: sum("cgstPaise"), sgstPaise: sum("sgstPaise"), igstPaise: sum("igstPaise"), totalPaise: sum("totalPaise"), interState };
}
/** Simplified GSTR-1 B2C summary (illustrative; verify against current GSTN schema before filing). */
export function gstr1B2cSummary(invoices) {
    const byRate = new Map();
    for (const inv of invoices)
        for (const l of inv.lines) {
            const e = byRate.get(l.gstRateBp) ?? { taxable: 0n, tax: 0n };
            e.taxable += l.taxablePaise;
            e.tax += l.cgstPaise + l.sgstPaise + l.igstPaise;
            byRate.set(l.gstRateBp, e);
        }
    return [...byRate.entries()].map(([bp, v]) => ({ ratePercent: bp / 100, taxablePaise: v.taxable.toString(), taxPaise: v.tax.toString() }));
}
