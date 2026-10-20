"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CATEGORIES, MODULES, activeModule } from "@/lib/modules";
export default function Sidebar({ open, onClose, tr }: { open: boolean; onClose: () => void; tr: (k: string) => string }) {
  const pathname = usePathname() ?? "/"; const current = activeModule(pathname);
  return (<>
    {open && <div className="fixed inset-0 z-40 bg-black/60 md:hidden" onClick={onClose} aria-hidden />}
    {/* Always visible on md+; slide-in drawer only on mobile. */}
    <aside className={`of-side fixed inset-y-0 left-0 z-50 w-64 overflow-y-auto border-r border-slate-800 bg-slate-900 p-4 transition-transform duration-200 md:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
      <div className="mb-4 text-lg font-extrabold">🚀 Open Founder</div>
      {CATEGORIES.map((cat) => (<div key={cat} className="mb-3">
        <div className="mb-1 px-2 text-[11px] uppercase tracking-wider text-slate-500">{tr(cat)}</div>
        {MODULES.filter((m) => m.category === cat).map((m) => (
          <Link key={m.id} href={m.href} onClick={onClose}
            className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm ${current?.id === m.id ? "bg-emerald-500/15 text-emerald-300" : "text-slate-300 hover:bg-slate-800"}`}>
            <span>{m.icon}</span><span>{tr(m.key)}</span></Link>))}
      </div>))}
      <div className="mt-4 text-xs text-slate-500"><a href="/prototype.html">Prototype</a> · <a href="/downloads/">SDK</a></div>
    </aside></>);
}
