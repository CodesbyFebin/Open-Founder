"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { computeGst, GST_RATES_BP } from "@open-founder/core/gst";
import { paiseToRupeeString, rupeesToPaise } from "@open-founder/core/money";
import { listRecords } from "@/lib/localdb";
import SampleBadge from "./SampleBadge";
interface Item { id: string; name: string; unitPricePaise: bigint; gstRateBp: number; icon: string }
// SAMPLE catalogue used only when no products exist yet in the local store.
const SAMPLE: Item[] = [
  { id: "s1", name: "Wireless Earbuds", unitPricePaise: 129900n, gstRateBp: 1800, icon: "🎧" },
  { id: "s2", name: "Phone Case", unitPricePaise: 49900n, gstRateBp: 1800, icon: "📱" },
  { id: "s3", name: "USB-C Cable", unitPricePaise: 19900n, gstRateBp: 1800, icon: "🔌" },
  { id: "s4", name: "Power Bank", unitPricePaise: 99900n, gstRateBp: 1800, icon: "🔋" },
];
const toBp = (pct: unknown) => { const bp = Math.round(Number(pct) * 100); return (GST_RATES_BP as readonly number[]).includes(bp) ? bp : 1800; };
const inr = (p: bigint) => `₹${paiseToRupeeString(p)}`;
export default function QuickPos({ sampleLabel }: { sampleLabel: string }) {
  const [items, setItems] = useState<Item[]>(SAMPLE); const [isSample, setIsSample] = useState(true); const [cart, setCart] = useState<Record<string, number>>({});
  useEffect(() => { listRecords("product").then((rs) => { if (!rs.length) return; setIsSample(false); setItems(rs.map((r) => {
    let price = 0n; try { price = rupeesToPaise(String(r.data.price ?? 0)); } catch { /* skip bad price */ }
    return { id: r.id, name: String(r.data.name ?? "Item"), unitPricePaise: price, gstRateBp: toBp(r.data.gst), icon: "📦" }; }).filter((i) => i.unitPricePaise > 0n)); }).catch(() => undefined); }, []);
  // Totals come from the core GST engine (bigint paise, intra-state CGST+SGST split).
  const totals = useMemo(() => { const lines = items.filter((i) => (cart[i.id] ?? 0) > 0).map((i) => ({ description: i.name, quantity: cart[i.id], unitPricePaise: i.unitPricePaise, gstRateBp: i.gstRateBp }));
    return lines.length ? computeGst(lines, "32", "32") : null; }, [items, cart]);
  const add = (id: string, d: number) => setCart((c) => { const n = Math.max(0, (c[id] ?? 0) + d); const next = { ...c, [id]: n }; if (!n) delete next[id]; return next; });
  return (<div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
    <h3 className="mb-3 mt-0 text-sm font-semibold">🖥️ Quick POS{isSample && <SampleBadge label={sampleLabel} />}</h3>
    <div className="mb-3 grid grid-cols-2 gap-2">{items.slice(0, 6).map((i) => (
      <button type="button" key={i.id} onClick={() => add(i.id, 1)} className="tw rounded-xl border border-slate-700 bg-slate-950 p-2 text-left text-slate-200 hover:border-emerald-500">
        <div>{i.icon} {i.name}</div><div className="text-xs text-slate-400">{inr(i.unitPricePaise)} + {i.gstRateBp / 100}% GST{cart[i.id] ? ` · ×${cart[i.id]}` : ""}</div></button>))}</div>
    {totals ? (<div className="space-y-1 text-sm">
      <div className="flex justify-between"><span>Taxable</span><span>{inr(totals.taxablePaise)}</span></div>
      <div className="flex justify-between text-slate-400"><span>CGST</span><span>{inr(totals.cgstPaise)}</span></div>
      <div className="flex justify-between text-slate-400"><span>SGST</span><span>{inr(totals.sgstPaise)}</span></div>
      <div className="flex justify-between font-bold"><span>Total</span><span>{inr(totals.totalPaise)}</span></div>
      <div className="flex gap-2 pt-2"><button type="button" className="tw rounded-lg border border-slate-700 bg-transparent px-3 py-1 text-slate-300" onClick={() => setCart({})}>Clear</button>
        <Link href="/pos" className="rounded-lg bg-emerald-500 px-3 py-1 font-semibold text-emerald-950">Open full POS →</Link></div>
    </div>) : <p className="m-0 text-sm text-slate-400">Tap items to build a bill. <Link href="/pos">Full POS</Link> records sales and deducts stock.</p>}
  </div>);
}
