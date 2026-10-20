/** Integer paise math. All money is stored as integer paise (bigint) — never floats. */
export type Paise = bigint;
export declare function rupeesToPaise(input: string | number): Paise;
export declare function paiseToRupeeString(p: Paise): string;
/** Multiply by basis points (1% = 100 bp) with half-up rounding. */
export declare function applyBasisPoints(amount: Paise, bp: number): Paise;
