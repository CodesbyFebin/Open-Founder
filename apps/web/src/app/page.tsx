"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ATLAS_TASKS, AtlasCategory } from "@open-founder/core/atlas";
import { useI18n } from "@/components/AppShell";
const CATS: AtlasCategory[] = ["legal", "finance", "hr", "product", "operations", "growth"];
export default function Atlas() {
  const { tr } = useI18n(); const [done, setDone] = useState<Record<string, boolean>>({}); const [cat, setCat] = useState<AtlasCategory | "all">("all");
  useEffect(() => { try { setDone(JSON.parse(localStorage.getItem("of_atlas") ?? "{}")); } catch { /* ignore */ } }, []);
  const toggle = (id: string) => { const n = { ...done, [id]: !done[id] }; setDone(n); localStorage.setItem("of_atlas", JSON.stringify(n)); };
  const tasks = ATLAS_TASKS.filter((x) => cat === "all" || x.category === cat); const pct = Math.round((Object.values(done).filter(Boolean).length / ATLAS_TASKS.length) * 100);
  return (<><h1>{tr("atlas")}</h1><p className="muted">Free, open checklists for starting and running a business — each task opens the tool that does the work. Progress: {pct}%</p>
    <div className="row">{(["all", ...CATS] as const).map((c) => <button key={c} className={cat === c ? "" : "ghost"} onClick={() => setCat(c)}>{c}</button>)}</div>
    <div className="grid">{tasks.map((x) => <div className="card" key={x.id}><span className="badge">{x.category}</span><h3>{x.title}</h3><p className="muted">{x.description}</p>
      <div className="row"><label><input type="checkbox" checked={!!done[x.id]} onChange={() => toggle(x.id)} /> done</label><Link href={x.route === "/assistant" ? `/assistant?q=${encodeURIComponent(x.title)}` : x.route}>Open →</Link></div></div>)}</div></>);
}
