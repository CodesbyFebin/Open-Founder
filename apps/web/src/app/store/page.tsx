"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import LocalCrud from "@/components/LocalCrud";
import { listRecords, LocalRecord } from "@/lib/localdb";
export default function Store() {
  const [items, setItems] = useState<LocalRecord[]>([]); useEffect(() => { listRecords("product").then(setItems).catch(() => undefined); }, []);
  return (<><h1>Store Builder</h1>
    <LocalCrud kind="product" title="Catalog (also used by POS & inventory)" fields={[{ key: "name", label: "Name" }, { key: "sku", label: "SKU" }, { key: "hsn", label: "HSN/SAC" }, { key: "price", label: "Price ₹ (excl. GST)", type: "number" }, { key: "gst", label: "GST %", type: "select", options: ["0", "5", "12", "18", "28"] }, { key: "stock", label: "Stock", type: "number" }]} />
    <div className="card"><h2>Storefront preview</h2><p className="muted">Reload after adding products.</p><div className="grid">{items.map((p) => { const gross = (Number(p.data.price) * (1 + Number(p.data.gst) / 100)).toFixed(2);
      return <div className="card" key={p.id}><h3>{String(p.data.name)}</h3><p>₹{gross} <span className="muted">incl. GST</span></p><Link href={`/checkout?amount=${gross}&note=${encodeURIComponent(String(p.data.name))}`}>Buy with UPI →</Link></div>; })}</div></div></>);
}
