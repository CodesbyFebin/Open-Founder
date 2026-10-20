import { Paise } from "./money.js";
export declare const GST_RATES_BP: readonly [0, 25, 300, 500, 1200, 1800, 2800];
export interface GstLineInput {
    description: string;
    hsnSac?: string;
    quantity: number;
    unitPricePaise: Paise;
    gstRateBp: number;
}
export interface GstLine extends GstLineInput {
    taxablePaise: Paise;
    cgstPaise: Paise;
    sgstPaise: Paise;
    igstPaise: Paise;
    totalPaise: Paise;
}
export interface GstInvoiceTotals {
    lines: GstLine[];
    taxablePaise: Paise;
    cgstPaise: Paise;
    sgstPaise: Paise;
    igstPaise: Paise;
    totalPaise: Paise;
    interState: boolean;
}
export declare const GSTIN_REGEX: RegExp;
export declare function isValidGstin(g: string): boolean;
/** Intra-state supply => CGST+SGST (half each); inter-state => IGST. */
export declare function computeGst(lines: GstLineInput[], supplierStateCode: string, placeOfSupplyStateCode: string): GstInvoiceTotals;
/** Simplified GSTR-1 B2C summary (illustrative; verify against current GSTN schema before filing). */
export declare function gstr1B2cSummary(invoices: GstInvoiceTotals[]): {
    ratePercent: number;
    taxablePaise: string;
    taxPaise: string;
}[];
