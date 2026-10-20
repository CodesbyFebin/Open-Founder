"use client";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
function Inner() {
  const sp = useSearchParams(); const [q, setQ] = useState(sp.get("q") ? `Help me with: ${sp.get("q")}` : ""); const [log, setLog] = useState<{ who: string; text: string }[]>([]); const [busy, setBusy] = useState(false);
  const send = async () => { if (!q.trim()) return; setBusy(true); const msg = q; setLog((l) => [...l, { who: "you", text: msg }]); setQ("");
    const r = await fetch("/api/v1/assistant", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: msg }) }).then((x) => x.json()).catch(() => ({ error: "offline" }));
    setLog((l) => [...l, { who: "assistant", text: r.reply ?? `Error: ${r.error}` }]); setBusy(false); };
  return (<><h1>AI Assistant</h1><div className="card">{log.map((m, i) => <p key={i} style={{ whiteSpace: "pre-wrap" }}><b>{m.who}:</b> {m.text}</p>)}
    <div className="row"><textarea rows={3} style={{ flex: 1 }} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ask about GST, drafting a policy, store setup…" /><button disabled={busy} onClick={send}>Send</button></div>
    <p className="muted">Provider is pluggable (any OpenAI-compatible endpoint, incl. local Ollama). Falls back to offline rule-based answers.</p></div></>);
}
export default function Assistant() { return <Suspense><Inner /></Suspense>; }
