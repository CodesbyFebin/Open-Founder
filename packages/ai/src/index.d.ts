export interface ChatMessage {
    role: "system" | "user" | "assistant";
    content: string;
}
export interface LlmProvider {
    readonly name: string;
    chat(messages: ChatMessage[]): Promise<string>;
}
/** Any OpenAI-compatible /chat/completions endpoint (OpenAI, Groq, Together, Ollama, LM Studio, vLLM...). */
export declare class OpenAICompatibleProvider implements LlmProvider {
    private cfg;
    readonly name = "openai-compatible";
    constructor(cfg: {
        baseUrl: string;
        apiKey?: string;
        model: string;
    });
    chat(messages: ChatMessage[]): Promise<string>;
}
/** Offline fallback: deterministic rule-based drafts so the app works without any API key. */
export declare class OfflineProvider implements LlmProvider {
    readonly name = "offline";
    chat(messages: ChatMessage[]): Promise<"GST tip: intra-state sales use CGST+SGST (split equally); inter-state sales use IGST. Open Billing to generate an invoice." | "Open Store Builder: add products with HSN and GST rate, then publish. Checkout uses your UPI VPA." | "OFFER LETTER (draft)\nDear [Name],\nWe are pleased to offer you the role of [Role] at [Company], starting [Date], with CTC ₹[Amount]..." | "I'm running in offline mode (no LLM configured). Set LLM_BASE_URL / LLM_API_KEY / LLM_MODEL to enable full answers. Try asking about GST, store setup, or an offer letter.">;
}
export declare const SYSTEM_PROMPT = "You are Open Founder's assistant for Indian small businesses. Be concise, practical, and flag when a CA/lawyer should verify. Never request passwords, OTPs, or UPI PINs.";
export declare function llmFromEnv(env?: Record<string, string | undefined>): LlmProvider;
