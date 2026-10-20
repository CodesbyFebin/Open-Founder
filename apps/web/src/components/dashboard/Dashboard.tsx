"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useI18n } from "@/components/AppShell";
import { MODULES } from "@/lib/modules";
import Charts from "./Charts";
import QuickAssistant from "./QuickAssistant";
import QuickPos from "./QuickPos";
import QuickUpi from "./QuickUpi";
import StatCards from "./StatCards";
import WhatsAppPreview from "./WhatsAppPreview";
export default function Dashboard() {
  const { tr } = useI18n(); const sample = tr("sample");
  return (<motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
    <div className="mb-4"><h1 className="m-0 text-2xl font-bold">{tr("dashboard")}</h1>
      <p className="muted">Figures marked “{sample}” are illustrative until your own sales are recorded. POS totals, UPI QR and the assistant below are live.</p></div>
    <StatCards sampleLabel={sample} />
    <Charts sampleLabel={sample} />
    <div className="mb-4 grid gap-4 lg:grid-cols-3"><QuickPos sampleLabel={sample} /><QuickUpi tr={tr} /><QuickAssistant tr={tr} /></div>
    <div className="mb-4 grid gap-4 lg:grid-cols-3"><WhatsAppPreview sampleLabel={sample} />
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 lg:col-span-2"><h3 className="mb-3 mt-0 text-sm font-semibold">⚡ Modules</h3>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">{MODULES.filter((m) => m.id !== "dashboard").map((m) => (
          <Link key={m.id} href={m.href} className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm text-slate-200 hover:border-emerald-500">{m.icon} {tr(m.key)}</Link>))}</div></div>
    </div>
  </motion.div>);
}
