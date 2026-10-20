import Link from "next/link";
import SampleBadge from "./SampleBadge";
// SAMPLE conversation — shows how order notifications look. Live sending goes through the messaging adapters (WAHA / Cloud API).
export default function WhatsAppPreview({ sampleLabel }: { sampleLabel: string }) {
  return (<div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
    <h3 className="mb-3 mt-0 text-sm font-semibold">💬 WhatsApp Hub<SampleBadge label={sampleLabel} /></h3>
    <div className="space-y-2 text-sm">
      <div className="max-w-[80%] rounded-xl bg-slate-800 px-3 py-2">Hi, do you have wireless earbuds?</div>
      <div className="ml-auto max-w-[80%] rounded-xl bg-emerald-700/50 px-3 py-2">Great choice! 🎧 Our Wireless Pro Earbuds are ₹1,299. Want me to create an order?</div>
      <div className="ml-auto max-w-[80%] rounded-xl bg-emerald-700/50 px-3 py-2">✅ Order #1042 confirmed. GST receipt attached.</div>
    </div>
    <p className="mb-0 mt-3 text-xs text-slate-500">Configure WAHA or WhatsApp Cloud API in <code>.env</code>. Leads &amp; follow-ups: <Link href="/crm">CRM →</Link></p>
  </div>);
}
