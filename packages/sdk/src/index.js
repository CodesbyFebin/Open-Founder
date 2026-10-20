export class OpenFounderClient {
    o;
    f;
    constructor(o) {
        this.o = o;
        this.f = o.fetch ?? fetch;
    }
    async req(method, path, body) {
        const r = await this.f(`${this.o.baseUrl.replace(/\/$/, "")}/api/v1${path}`, { method, headers: { "Content-Type": "application/json", Authorization: `Bearer ${this.o.apiKey}` }, body: body ? JSON.stringify(body) : undefined });
        const j = await r.json().catch(() => ({}));
        if (!r.ok)
            throw new Error(j.error ?? `HTTP ${r.status}`);
        return j;
    }
    products = { list: () => this.req("GET", "/products"),
        create: (p) => this.req("POST", "/products", p) };
    checkout = { create: (i) => this.req("POST", "/checkout", i),
        status: (sessionRef) => this.req("GET", `/checkout/${encodeURIComponent(sessionRef)}`) };
    invoices = { preview: (i) => this.req("POST", "/invoices/preview", i) };
    expenses = { create: (e) => this.req("POST", "/expenses", e) };
    bookings = { create: (b) => this.req("POST", "/bookings", b) };
    assistant = { ask: (message) => this.req("POST", "/assistant", { message }) };
}
