"use client";
import LocalCrud from "@/components/LocalCrud";
export default function Expenses() { return (<><h1>Expenses & Inventory</h1>
  <LocalCrud kind="expense" title="Expenses (with GST paid for ITC)" fields={[{ key: "description", label: "Description" }, { key: "category", label: "Category", type: "select", options: ["Rent", "Inventory", "Salary", "Marketing", "Utilities", "Software", "Other"] }, { key: "amount", label: "Amount ₹", type: "number" }, { key: "gst", label: "GST paid ₹", type: "number" }]}
    footer={(rows) => <p>Total ₹{rows.reduce((a, r) => a + Number(r.data.amount), 0).toFixed(2)} · ITC ₹{rows.reduce((a, r) => a + Number(r.data.gst), 0).toFixed(2)}</p>} />
  <LocalCrud kind="stockmove" title="Stock movements" fields={[{ key: "sku", label: "SKU" }, { key: "qty", label: "Qty (+in / −out)", type: "number" }, { key: "reason", label: "Reason" }]} /></>); }
