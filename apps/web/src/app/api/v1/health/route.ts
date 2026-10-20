import { json } from "@/lib/api";
export async function GET() { return json({ ok: true, payment: process.env.PAYMENT_PROVIDER ?? "direct-upi", messaging: process.env.MESSAGING_PROVIDER ?? "console" }); }
