"use client";
import { useState } from "react";
import UpiQr from "@/components/UpiQr";
export default function Card() {
  const [c, setC] = useState({ name: "Your Name", title: "Founder", phone: "+91", email: "", website: "" });
  const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${c.name}\nTITLE:${c.title}\nTEL:${c.phone}\nEMAIL:${c.email}\nURL:${c.website}\nEND:VCARD`;
  return (<><h1>Digital Business Card</h1><div className="card"><div className="row">{(Object.keys(c) as (keyof typeof c)[]).map((k) => <input key={k} placeholder={k} value={c[k]} onChange={(e) => setC({ ...c, [k]: e.target.value })} />)}</div>
    <div className="card" style={{ maxWidth: 360 }}><h2>{c.name}</h2><p>{c.title}</p><p className="muted">{c.phone} · {c.email} · {c.website}</p><UpiQr uri={vcard} /></div></div></>);
}
