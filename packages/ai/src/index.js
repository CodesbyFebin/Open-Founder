/** Any OpenAI-compatible /chat/completions endpoint (OpenAI, Groq, Together, Ollama, LM Studio, vLLM...). */
export class OpenAICompatibleProvider {
    cfg;
    name = "openai-compatible";
    constructor(cfg) {
        this.cfg = cfg;
    }
    async chat(messages) {
        const r = await fetch(`${this.cfg.baseUrl.replace(/\/$/, "")}/chat/completions`, { method: "POST",
            headers: { "Content-Type": "application/json", ...(this.cfg.apiKey ? { Authorization: `Bearer ${this.cfg.apiKey}` } : {}) },
            body: JSON.stringify({ model: this.cfg.model, messages }) });
        if (!r.ok)
            throw new Error(`LLM error ${r.status}`);
        const j = (await r.json());
        return j.choices?.[0]?.message?.content ?? "";
    }
}
/** Offline fallback: deterministic rule-based drafts so the app works without any API key. */
export class OfflineProvider {
    name = "offline";
    async chat(messages) {
        const q = messages.filter((m) => m.role === "user").at(-1)?.content.toLowerCase() ?? "";
        if (q.includes("gst"))
            return "GST tip: intra-state sales use CGST+SGST (split equally); inter-state sales use IGST. Open Billing to generate an invoice.";
        if (q.includes("store") || q.includes("website"))
            return "Open Store Builder: add products with HSN and GST rate, then publish. Checkout uses your UPI VPA.";
        if (q.includes("offer letter"))
            return "OFFER LETTER (draft)\nDear [Name],\nWe are pleased to offer you the role of [Role] at [Company], starting [Date], with CTC ₹[Amount]...";
        return "I'm running in offline mode (no LLM configured). Set LLM_BASE_URL / LLM_API_KEY / LLM_MODEL to enable full answers. Try asking about GST, store setup, or an offer letter.";
    }
}
export const SYSTEM_PROMPT = "You are Open Founder's assistant for Indian small businesses. Be concise, practical, and flag when a CA/lawyer should verify. Never request passwords, OTPs, or UPI PINs.";
export function llmFromEnv(env = process.env) {
    return env.LLM_BASE_URL ? new OpenAICompatibleProvider({ baseUrl: env.LLM_BASE_URL, apiKey: env.LLM_API_KEY, model: env.LLM_MODEL ?? "gpt-4o-mini" }) : new OfflineProvider();
}
