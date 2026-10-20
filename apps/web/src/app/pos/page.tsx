"use client";
import { useEffect, useState } from "react";
import { listRecords, LocalRecord, putRecord } from "@/lib/localdb";
import { buildUpiUri } from "@open-founder/core/upi";
import UpiQr from "@/components/UpiQr";
export default function Pos() {
  const [products, setProducts] = useState<LocalRecord[]>([]); const [cart, setCart] = useState<Record<string, number>>({}); const [method, setMethod] = useState("CASH"); const [msg, setMsg] = useState("");
  const load = () => listRecords("product").then(setProducts).catch(() => undefined); useEffect(() => { void load(); }, []);
  const linePaise = (p: LocalRecord) => Math.round(Number(p.data.price) * 100 * (1 + Number(p.data.gst) / 100));
  const totalPaise = products.reduce((a, p) => a + linePaise(p) * (cart[p.id] ?? 0), 0);
  const vpa = typeof window !== "undefined" ? localStorage.getItem("of_vpa") ?? "" : "";
  const complete = async () => { for (const p of products) if (cart[p.id]) await putRecord("product", { ...p.data, stock: Number(p.data.stock) - cart[p.id] }, p.id);
    await putRecord("sale", { method, totalPaise, at: new Date().toISOString() }); setCart({}); setMsg(`Sale recorded (${method}) — ₹${(totalPaise / 100).toFixed(2)}`); void load(); };
  return (<><h1>Point of Sale</h1><div className="grid">{products.map((p) => <div className="card" key={p.id}><b>{String(p.data.name)}</b><div className="muted">₹{(linePaise(p) / 100).toFixed(2)} · stock {String(p.data.stock)}</div>
    <button disabled={Number(p.data.stock) <= (cart[p.id] ?? 0)} onClick={() => setCart({ ...cart, [p.id]: (cart[p.id] ?? 0) + 1 })}>+ {cart[p.id] ?? 0}</button></div>)}</div>
    {!products.length && <p className="muted">Add products in Store first.</p>}
    <div className="card"><h2>Total ₹{(totalPaise / 100).toFixed(2)}</h2><div className="row">{["CASH", "CARD", "UPI"].map((m) => <button key={m} className={m === method ? "" : "ghost"} onClick={() => setMethod(m)}>{m}</button>)}</div>
      {method === "UPI" && totalPaise > 0 && (vpa ? <UpiQr uri={buildUpiUri({ vpa, payeeName: "Store", amountPaise: BigInt(totalPaise), txnRef: `POS${Date.now()}` })} /> : <p className="muted">Set your VPA on the Checkout page.</p>)}
      <button disabled={!totalPaise} onClick={complete}>Complete sale</button> <span>{msg}</span></div></>);
}
