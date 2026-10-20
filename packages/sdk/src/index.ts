/** @open-founder/sdk — typed client for the Open Founder REST API. Zero dependencies; works in Node 18+ and browsers. */
export interface SdkOptions { baseUrl: string; apiKey: string; fetch?: typeof fetch; }
export interface Product { id: string; name: string; sku: string; hsnSac?: string | null; pricePaise: string; gstRateBp: number; stock: number; }
export interface CheckoutResponse { orderId: string; sessionRef: string; upiUri?: string; amountPaise: string; expiresAt: string; }
export interface InvoiceLine { description: string; hsnSac?: string; quantity: number; unitPricePaise: string; gstRateBp: number; }
export class OpenFounderClient {
  private f: typeof fetch;
  constructor(private o: SdkOptions) { this.f = o.fetch ?? fetch; }
  private async req<T>(method: string, path: string, body?: unknown): Promise<T> {
    const r = await this.f(`${this.o.baseUrl.replace(/\/$/, "")}/api/v1${path}`, { method, headers: { "Content-Type": "application/json", Authorization: `Bearer ${this.o.apiKey}` }, body: body ? JSON.stringify(body) : undefined });
    const j = await r.json().catch(() => ({})); if (!r.ok) throw new Error((j as { error?: string }).error ?? `HTTP ${r.status}`); return j as T;
  }
  products = { list: () => this.req<{ products: Product[] }>("GET", "/products"),
    create: (p: Omit<Product, "id">) => this.req<{ product: Product }>("POST", "/products", p) };
  checkout = { create: (i: { items: { productId: string; quantity: number }[]; customerMobile?: string; customerName?: string; placeOfSupplyStateCode?: string }) => this.req<CheckoutResponse>("POST", "/checkout", i),
    status: (sessionRef: string) => this.req<{ status: string; utr?: string }>("GET", `/checkout/${encodeURIComponent(sessionRef)}`) };
  invoices = { preview: (i: { lines: InvoiceLine[]; placeOfSupplyStateCode: string }) => this.req<Record<string, unknown>>("POST", "/invoices/preview", i) };
  expenses = { create: (e: { description: string; amountPaise: string; gstPaise?: string; category: string }) => this.req("POST", "/expenses", e) };
  bookings = { create: (b: { customerName: string; customerMobile: string; service: string; startsAt: string }) => this.req("POST", "/bookings", b) };
  assistant = { ask: (message: string) => this.req<{ reply: string }>("POST", "/assistant", { message }) };
}
