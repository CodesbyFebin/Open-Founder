"use client";
import { useState } from "react";
import { computeGst } from "@open-founder/core/gst";
import { paiseToRupeeString as r, rupeesToPaise } from "@open-founder/core/money";
type L = { description: string; hsn: string; qty: string; price: string; gst: string };
export default function Billing() {
  const [seller, setSeller] = useState("32"); const [pos, setPos] = useState("32"); const [lines, setLines] = useState<L[]>([{ description: "Item", hsn: "", qty: "1", price: "100", gst: "18" }]);
  let res; let err = "";
  try { res = computeGst(lines.map((l) => ({ description: l.description, hsnSac: l.hsn, quantity: Number(l.qty), unitPricePaise: rupeesToPaise(l.price), gstRateBp: Math.round(Number(l.gst) * 100) })), seller, pos); } catch (e) { err = (e as Error).message; }
  const set = (i: number, k: keyof L, v: string) => setLines(lines.map((l, j) => (j === i ? { ...l, [k]: v } : l)));
  return (<><h1>GST Billing & Invoice</h1><div className="card">
    <div className="row noprint">Seller state code <input value={seller} onChange={(e) => setSeller(e.target.value)} size={3} /> Place of supply <input value={pos} onChange={(e) => setPos(e.target.value)} size={3} /> <button onClick={() => print()}>Print / PDF</button></div>
    <table><thead><tr><th>Description</th><th>HSN</th><th>Qty</th><th>Price ₹</th><th>GST %</th></tr></thead><tbody>{lines.map((l, i) => <tr key={i}>{(Object.keys(l) as (keyof L)[]).map((k) => <td key={k}><input value={l[k]} onChange={(e) => set(i, k, e.target.value)} /></td>)}</tr>)}</tbody></table>
    <button className="ghost noprint" onClick={() => setLines([...lines, { description: "", hsn: "", qty: "1", price: "0", gst: "18" }])}>+ line</button>
    {err ? <p style={{ color: "#f87171" }}>{err}</p> : res && <table style={{ marginTop: 12 }}><tbody>
      <tr><td>Supply type</td><td>{res.interState ? "Inter-state (IGST)" : "Intra-state (CGST + SGST)"}</td></tr><tr><td>Taxable</td><td>₹{r(res.taxablePaise)}</td></tr>
      <tr><td>CGST</td><td>₹{r(res.cgstPaise)}</td></tr><tr><td>SGST</td><td>₹{r(res.sgstPaise)}</td></tr><tr><td>IGST</td><td>₹{r(res.igstPaise)}</td></tr><tr><th>Total</th><th>₹{r(res.totalPaise)}</th></tr></tbody></table>}
    <p className="muted">Computation aid only — confirm filings with a qualified CA.</p></div></>);
}
