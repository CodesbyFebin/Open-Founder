/** @open-founder/sdk — typed client for the Open Founder REST API. Zero dependencies; works in Node 18+ and browsers. */
export interface SdkOptions {
    baseUrl: string;
    apiKey: string;
    fetch?: typeof fetch;
}
export interface Product {
    id: string;
    name: string;
    sku: string;
    hsnSac?: string | null;
    pricePaise: string;
    gstRateBp: number;
    stock: number;
}
export interface CheckoutResponse {
    orderId: string;
    sessionRef: string;
    upiUri?: string;
    amountPaise: string;
    expiresAt: string;
}
export interface InvoiceLine {
    description: string;
    hsnSac?: string;
    quantity: number;
    unitPricePaise: string;
    gstRateBp: number;
}
export declare class OpenFounderClient {
    private o;
    private f;
    constructor(o: SdkOptions);
    private req;
    products: {
        list: () => Promise<{
            products: Product[];
        }>;
        create: (p: Omit<Product, "id">) => Promise<{
            product: Product;
        }>;
    };
    checkout: {
        create: (i: {
            items: {
                productId: string;
                quantity: number;
            }[];
            customerMobile?: string;
            customerName?: string;
            placeOfSupplyStateCode?: string;
        }) => Promise<CheckoutResponse>;
        status: (sessionRef: string) => Promise<{
            status: string;
            utr?: string;
        }>;
    };
    invoices: {
        preview: (i: {
            lines: InvoiceLine[];
            placeOfSupplyStateCode: string;
        }) => Promise<Record<string, unknown>>;
    };
    expenses: {
        create: (e: {
            description: string;
            amountPaise: string;
            gstPaise?: string;
            category: string;
        }) => Promise<unknown>;
    };
    bookings: {
        create: (b: {
            customerName: string;
            customerMobile: string;
            service: string;
            startsAt: string;
        }) => Promise<unknown>;
    };
    assistant: {
        ask: (message: string) => Promise<{
            reply: string;
        }>;
    };
}
