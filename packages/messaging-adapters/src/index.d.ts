export interface OutboundMessage {
    to: string;
    text: string;
    templateName?: string;
}
export interface MessagingAdapter {
    readonly name: string;
    send(m: OutboundMessage): Promise<{
        id: string;
    }>;
}
export declare class ConsoleAdapter implements MessagingAdapter {
    readonly name = "console";
    send(m: OutboundMessage): Promise<{
        id: string;
    }>;
}
/** Official WhatsApp Cloud API (Meta Graph). Requires your own token + phone number id. */
export declare class WhatsAppCloudAdapter implements MessagingAdapter {
    private cfg;
    readonly name = "whatsapp-cloud";
    constructor(cfg: {
        token: string;
        phoneNumberId: string;
        apiVersion?: string;
    });
    send(m: OutboundMessage): Promise<{
        id: string;
    }>;
}
/** Self-hosted WAHA HTTP API (https://waha.devlike.pro). */
export declare class WahaAdapter implements MessagingAdapter {
    private cfg;
    readonly name = "waha";
    constructor(cfg: {
        baseUrl: string;
        apiKey?: string;
        session?: string;
    });
    send(m: OutboundMessage): Promise<{
        id: string;
    }>;
}
export declare function messagingAdapterFromEnv(env?: Record<string, string | undefined>): MessagingAdapter;
export declare const templates: {
    orderConfirmed: (order: string, amount: string) => string;
    paymentReceived: (amount: string, utr: string) => string;
    bookingReminder: (when: string) => string;
};
