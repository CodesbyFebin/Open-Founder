"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { buildUpiUri } from "@open-founder/core/upi";
import { rupeesToPaise } from "@open-founder/core/money";
import UpiQr from "@/components/UpiQr";
function Inner() {
  const sp = useSearchParams(); const [vpa, setVpa] = useState(""); const [name, setName] = useState("My Store"); const [amount, setAmount] = useState(sp.get("amount") ?? "");
  useEffect(() => { setVpa(localStorage.getItem("of_vpa") ?? ""); }, []);
  let uri = ""; let err = "";
  try { if (vpa && amount) uri = buildUpiUri({ vpa, payeeName: name, amountPaise: rupeesToPaise(amount), txnRef: `OF${Date.now().toString(36).toUpperCase()}`, note: sp.get("note") ?? undefined }); } catch (e) { err = (e as Error).message; }
  return (<><h1>UPI Checkout</h1><div className="card"><p className="muted">Zero-fee direct UPI: customers pay your VPA via a dynamic QR. Server-side checkout (POST /api/v1/checkout) creates a tracked session; payment is confirmed by signed webhook or the IMAP bank-alert observer, with UTR replay protection.</p>
    <div className="row"><input placeholder="Your UPI VPA (name@bank)" value={vpa} onChange={(e) => { setVpa(e.target.value); localStorage.setItem("of_vpa", e.target.value); }} />
      <input placeholder="Payee name" value={name} onChange={(e) => setName(e.target.value)} /><input placeholder="Amount ₹" value={amount} onChange={(e) => setAmount(e.target.value)} /></div>
    {err && <p style={{ color: "#f87171" }}>{err}</p>}{uri && <UpiQr uri={uri} />}
    <p className="muted">⚠️ Never share your UPI PIN. Collecting money never requires entering a PIN.</p></div></>);
}
export default function Checkout() { return <Suspense><Inner /></Suspense>; }
