"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { rupeesToPaise } from "@open-founder/core/money";
import { buildUpiUri } from "@open-founder/core/upi";
import UpiQr from "@/components/UpiQr";
export default function QuickUpi({ tr }: { tr: (k: string) => string }) {
  const [vpa, setVpa] = useState(""); const [amount, setAmount] = useState(""); const [uri, setUri] = useState(""); const [err, setErr] = useState("");
  useEffect(() => { setVpa(localStorage.getItem("of_vpa") ?? ""); }, []);
  const gen = () => { setErr(""); setUri("");
    try { const p = rupeesToPaise(amount); if (p <= 0n) throw new Error("enter an amount");
      setUri(buildUpiUri({ vpa, payeeName: "Open Founder Store", amountPaise: p, txnRef: `DASH${Date.now()}` })); localStorage.setItem("of_vpa", vpa);
    } catch (e) { setErr((e as Error).message); } };
  return (<div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
    <h3 className="mb-3 mt-0 text-sm font-semibold">💳 Zero-fee UPI QR</h3>
    <div className="mb-2 flex flex-col gap-2">
      <input value={vpa} onChange={(e) => setVpa(e.target.value)} placeholder="yourname@bank (VPA)" />
      <input value={amount} onChange={(e) => setAmount(e.target.value)} inputMode="decimal" placeholder={tr("amount")} />
      <button type="button" onClick={gen}>{tr("generateQr")}</button></div>
    {err && <p className="text-sm text-red-400">{err}</p>}
    {uri && <UpiQr uri={uri} />}
    <p className="mb-0 text-xs text-slate-500">Verified checkout with webhook confirmation: <Link href="/checkout">UPI Checkout →</Link></p>
  </div>);
}
