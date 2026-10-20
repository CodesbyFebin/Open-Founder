"use client";
import Link from "next/link";
import { createContext, useContext, useEffect, useState } from "react";
import { LOCALES, Locale, t } from "@/lib/i18n";
import { flushOutbox } from "@/lib/localdb";
const Ctx = createContext<{ locale: Locale; tr: (k: string) => string }>({ locale: "en", tr: (k) => k });
export const useI18n = () => useContext(Ctx);
const NAV = ["atlas:/", "store:/store", "checkout:/checkout", "pos:/pos", "billing:/billing", "expenses:/expenses", "bookings:/bookings", "staff:/staff", "crm:/crm", "card:/card", "assistant:/assistant"];
export default function AppShell({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en"); const [online, setOnline] = useState(true);
  useEffect(() => {
    const saved = localStorage.getItem("of_locale") as Locale | null; if (saved && LOCALES.includes(saved)) setLocale(saved);
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => undefined);
    const upd = () => { setOnline(navigator.onLine); if (navigator.onLine) void flushOutbox(); }; upd();
    addEventListener("online", upd); addEventListener("offline", upd); return () => { removeEventListener("online", upd); removeEventListener("offline", upd); };
  }, []);
  const tr = (k: string) => t(locale, k);
  return (<Ctx.Provider value={{ locale, tr }}><div className="wrap">
    <nav className="side"><div className="brand">🚀 Open Founder</div>
      {NAV.map((n) => { const [k, h] = n.split(":"); return <Link key={h} href={h}>{tr(k)}</Link>; })}
      <div style={{ marginTop: 12 }}><select value={locale} onChange={(e) => { const l = e.target.value as Locale; setLocale(l); localStorage.setItem("of_locale", l); }}>
        {LOCALES.map((l) => <option key={l} value={l}>{l.toUpperCase()}</option>)}</select></div>
      <div className="muted" style={{ marginTop: 8 }}><a href="/prototype.html">Prototype</a> · <a href="/downloads/">SDK</a></div>
    </nav>
    <main>{!online && <div className="card badge">{tr("offline")}</div>}{children}</main></div></Ctx.Provider>);
}
