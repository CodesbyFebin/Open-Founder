"use client";
import Link from "next/link";
import { useState } from "react";
type Msg = { role: "bot" | "user"; content: string };
export default function QuickAssistant({ tr }: { tr: (k: string) => string }) {
  const [msgs, setMsgs] = useState<Msg[]>([{ role: "bot", content: "👋 Hi! I'm your AI Business Assistant. What would you like to build today?" }]);
  const [input, setInput] = useState(""); const [busy, setBusy] = useState(false);
  const send = async () => { const text = input.trim(); if (!text || busy) return; setInput(""); setBusy(true); setMsgs((m) => [...m, { role: "user", content: text }]);
    const r: { reply?: string; error?: string } = await fetch("/api/v1/assistant", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: text }) })
      .then((x) => x.json()).catch(() => ({ error: "offline" }));
    setMsgs((m) => [...m, { role: "bot", content: r.reply ?? `Error: ${r.error}` }]); setBusy(false); };
  return (<div className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900 p-4">
    <h3 className="mb-3 mt-0 text-sm font-semibold">🤖 {tr("assistant")} <Link href="/assistant" className="ml-2 text-xs font-normal">open →</Link></h3>
    <div className="mb-3 max-h-64 flex-1 space-y-2 overflow-y-auto">{msgs.map((m, i) => (
      <div key={i} className={`max-w-[85%] whitespace-pre-wrap rounded-xl px-3 py-2 text-sm ${m.role === "user" ? "ml-auto bg-purple-600/40" : "bg-slate-800"}`}>{m.content}</div>))}
      {busy && <div className="text-xs text-slate-500">…</div>}</div>
    <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); void send(); }}>
      <input className="flex-1" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about GST, store setup…" />
      <button type="submit" disabled={busy}>{tr("send")}</button></form>
  </div>);
}
