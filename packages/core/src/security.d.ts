export declare function hmacSha256Hex(secret: string, body: string): string;
export declare function verifyHmac(secret: string, body: string, sigHex: string): boolean;
/** Replay guard interface; production impl is DB-backed via unique UTR constraint. */
export interface ReplayStore {
    claim(key: string): Promise<boolean>;
}
export declare class MemoryReplayStore implements ReplayStore {
    private ttlMs;
    private seen;
    constructor(ttlMs?: number);
    claim(key: string): Promise<boolean>;
}
/** Fixed-window in-memory rate limiter (use Redis in multi-instance deployments). */
export declare class RateLimiter {
    private limit;
    private windowMs;
    private hits;
    constructor(limit: number, windowMs: number);
    check(key: string): {
        ok: boolean;
        remaining: number;
    };
}
export declare function scoreCheckoutRisk(i: {
    mobile?: string;
    amountPaise: bigint;
    payerVpa?: string;
    blocklist?: string[];
}): {
    score: number;
    reasons: string[];
    blocked: boolean;
};
