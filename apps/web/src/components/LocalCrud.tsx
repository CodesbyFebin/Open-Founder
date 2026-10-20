"use client";
import { useEffect, useState } from "react";
import { deleteRecord, listRecords, LocalRecord, putRecord } from "@/lib/localdb";
import { useI18n } from "./AppShell";
export interface Field { key: string; label: string; type?: "text" | "number" | "date" | "datetime-local" | "select"; options?: string[]; }
export default function LocalCrud({ kind, title, fields, footer }: { kind: string; title: string; fields: Field[]; footer?: (rows: LocalRecord[]) => React.ReactNode }) {
  const { tr } = useI18n(); const [rows, setRows] = useState<LocalRecord[]>([]); const [form, setForm] = useState<Record<string, string>>({});
  const load = () => listRecords(kind).then(setRows).catch(() => setRows([]));
  useEffect(() => { void load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const add = async () => {
    const data: LocalRecord["data"] = {}; for (const f of fields) { const v = (form[f.key] ?? "").trim(); if (!v) return alert(`${f.label} required`); data[f.key] = f.type === "number" ? Number(v) : v.slice(0, 500); }
    await putRecord(kind, data); setForm({}); void load();
  };
  return (<div className="card"><h2>{title}</h2>
    <div className="row">{fields.map((f) => f.type === "select"
      ? <select key={f.key} value={form[f.key] ?? ""} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}><option value="">{f.label}</option>{f.options!.map((o) => <option key={o}>{o}</option>)}</select>
      : <input key={f.key} placeholder={f.label} type={f.type ?? "text"} value={form[f.key] ?? ""} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} />)}
      <button onClick={add}>{tr("add")}</button></div>
    <table><thead><tr>{fields.map((f) => <th key={f.key}>{f.label}</th>)}<th /></tr></thead>
      <tbody>{rows.map((r) => <tr key={r.id}>{fields.map((f) => <td key={f.key}>{String(r.data[f.key] ?? "")}</td>)}<td><button className="ghost" onClick={() => deleteRecord(r.id).then(load)}>✕</button></td></tr>)}</tbody></table>
    {footer?.(rows)}</div>);
}
