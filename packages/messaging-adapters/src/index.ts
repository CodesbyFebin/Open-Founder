export interface OutboundMessage { to: string; text: string; templateName?: string; }
export interface MessagingAdapter { readonly name: string; send(m: OutboundMessage): Promise<{ id: string }>; }
export class ConsoleAdapter implements MessagingAdapter { readonly name = "console";
  async send(m: OutboundMessage) { console.log(`[whatsapp:console] -> ${m.to}: ${m.text}`); return { id: `console-${Date.now()}` }; } }
/** Official WhatsApp Cloud API (Meta Graph). Requires your own token + phone number id. */
export class WhatsAppCloudAdapter implements MessagingAdapter { readonly name = "whatsapp-cloud";
  constructor(private cfg: { token: string; phoneNumberId: string; apiVersion?: string }) {}
  async send(m: OutboundMessage) {
    const r = await fetch(`https://graph.facebook.com/${this.cfg.apiVersion ?? "v21.0"}/${this.cfg.phoneNumberId}/messages`, { method: "POST",
      headers: { Authorization: `Bearer ${this.cfg.token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ messaging_product: "whatsapp", to: m.to.replace(/\D/g, ""), type: "text", text: { body: m.text } }) });
    if (!r.ok) throw new Error(`WhatsApp Cloud error ${r.status}`); const j = (await r.json()) as { messages?: { id: string }[] };
    return { id: j.messages?.[0]?.id ?? "unknown" };
  }
}
/** Self-hosted WAHA HTTP API (https://waha.devlike.pro). */
export class WahaAdapter implements MessagingAdapter { readonly name = "waha";
  constructor(private cfg: { baseUrl: string; apiKey?: string; session?: string }) {}
  async send(m: OutboundMessage) {
    const r = await fetch(`${this.cfg.baseUrl}/api/sendText`, { method: "POST", headers: { "Content-Type": "application/json", ...(this.cfg.apiKey ? { "X-Api-Key": this.cfg.apiKey } : {}) },
      body: JSON.stringify({ session: this.cfg.session ?? "default", chatId: `${m.to.replace(/\D/g, "")}@c.us`, text: m.text }) });
    if (!r.ok) throw new Error(`WAHA error ${r.status}`); const j = (await r.json()) as { id?: string }; return { id: j.id ?? "unknown" };
  }
}
export function messagingAdapterFromEnv(env: Record<string, string | undefined> = process.env): MessagingAdapter {
  switch ((env.MESSAGING_PROVIDER ?? "console").toLowerCase()) {
    case "whatsapp-cloud": return new WhatsAppCloudAdapter({ token: env.WHATSAPP_CLOUD_TOKEN ?? "", phoneNumberId: env.WHATSAPP_CLOUD_PHONE_ID ?? "" });
    case "waha": return new WahaAdapter({ baseUrl: env.WAHA_BASE_URL ?? "http://waha:3000", apiKey: env.WAHA_API_KEY });
    default: return new ConsoleAdapter();
  }
}
export const templates = {
  orderConfirmed: (order: string, amount: string) => `✅ Order ${order} confirmed. Amount paid: ₹${amount}. Thank you!`,
  paymentReceived: (amount: string, utr: string) => `💰 Payment of ₹${amount} received (UTR ${utr}).`,
  bookingReminder: (when: string) => `📅 Reminder: your appointment is at ${when}.`,
};
