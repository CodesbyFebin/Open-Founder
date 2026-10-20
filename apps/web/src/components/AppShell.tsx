"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { LOCALES, Locale, t } from "@/lib/i18n";
import { flushOutbox } from "@/lib/localdb";
import { activeModule } from "@/lib/modules";
import Sidebar from "./Sidebar";
const Ctx = createContext<{ locale: Locale; tr: (k: string) => string }>({ locale: "en", tr: (k) => k });
export const useI18n = () => useContext(Ctx);
const FLAGS: Record<Locale, string> = { en: "🌐 EN", hi: "🇮🇳 हि", ml: "🌴 ML", ta: "🏛️ TA" };
export default function AppShell({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en"); const [online, setOnline] = useState(true); const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname() ?? "/";
  useEffect(() => {
    // Browser-only APIs live inside the effect so server rendering never touches navigator/localStorage.
    const saved = localStorage.getItem("of_locale") as Locale | null; if (saved && LOCALES.includes(saved)) setLocale(saved);
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => undefined);
    const upd = () => { setOnline(navigator.onLine); if (navigator.onLine) void flushOutbox(); }; upd();
    addEventListener("online", upd); addEventListener("offline", upd); return () => { removeEventListener("online", upd); removeEventListener("offline", upd); };
  }, []);
  const tr = (k: string) => t(locale, k);
  const mod = activeModule(pathname);
  return (<Ctx.Provider value={{ locale, tr }}><div className="min-h-screen">
    {!online && <div className="fixed inset-x-0 top-0 z-[200] bg-yellow-600 py-1 text-center text-sm text-white">⚠️ {tr("offline")}</div>}
    <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} tr={tr} />
    <div className="md:ml-64">
      <header className="of-header sticky top-0 z-30 flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-4 py-3 backdrop-blur md:px-6">
        <div className="flex items-center gap-3">
          <button type="button" className="tw rounded-md border border-slate-700 bg-transparent px-2 py-1 text-xl text-slate-200 md:hidden" onClick={() => setSidebarOpen((o) => !o)} aria-label="Toggle menu">☰</button>
          <h2 className="m-0 text-lg font-semibold">{mod ? `${mod.icon} ${tr(mod.key)}` : "Open Founder"}</h2>
        </div>
        <select aria-label="Language" value={locale} onChange={(e) => { const l = e.target.value as Locale; setLocale(l); localStorage.setItem("of_locale", l); }}>
          {LOCALES.map((l) => <option key={l} value={l}>{FLAGS[l]}</option>)}</select>
      </header>
      <main className="of-main">{children}</main>
    </div>
    {pathname !== "/assistant" && <Link href="/assistant" aria-label={tr("assistant")} className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-2xl shadow-lg transition-transform hover:scale-110">🤖</Link>}
  </div></Ctx.Provider>);
}
