"use client";
/** Minimal IndexedDB store + outbox for offline-first operation. Records sync to /api/v1/sync when online. */
const DB = "open-founder"; const VER = 1;
function open(): Promise<IDBDatabase> {
  return new Promise((res, rej) => { const r = indexedDB.open(DB, VER);
    r.onupgradeneeded = () => { const d = r.result; if (!d.objectStoreNames.contains("records")) d.createObjectStore("records", { keyPath: "id" }); if (!d.objectStoreNames.contains("outbox")) d.createObjectStore("outbox", { keyPath: "id" }); };
    r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });
}
export interface LocalRecord { id: string; kind: string; data: Record<string, string | number | boolean>; updatedAt: number; }
async function tx<T>(store: string, mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const d = await open(); return new Promise((res, rej) => { const r = fn(d.transaction(store, mode).objectStore(store)); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });
}
export async function listRecords(kind: string): Promise<LocalRecord[]> { const all = await tx<LocalRecord[]>("records", "readonly", (s) => s.getAll() as IDBRequest<LocalRecord[]>); return all.filter((r) => r.kind === kind).sort((a, b) => b.updatedAt - a.updatedAt); }
export async function putRecord(kind: string, data: LocalRecord["data"], id = crypto.randomUUID()) {
  const rec: LocalRecord = { id, kind, data, updatedAt: Date.now() }; await tx("records", "readwrite", (s) => s.put(rec)); await tx("outbox", "readwrite", (s) => s.put(rec)); void flushOutbox(); return rec;
}
export async function deleteRecord(id: string) { await tx("records", "readwrite", (s) => s.delete(id)); }
export async function flushOutbox() {
  if (typeof navigator !== "undefined" && !navigator.onLine) return;
  const key = localStorage.getItem("of_api_key"); if (!key) return; // sync only once the user configured an API key
  const items = await tx<LocalRecord[]>("outbox", "readonly", (s) => s.getAll() as IDBRequest<LocalRecord[]>); if (!items.length) return;
  const r = await fetch("/api/v1/sync", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` }, body: JSON.stringify({ records: items }) }).catch(() => null);
  if (r?.ok) for (const i of items) await tx("outbox", "readwrite", (s) => s.delete(i.id));
}
