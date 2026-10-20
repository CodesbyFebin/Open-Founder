"use client";
import LocalCrud from "@/components/LocalCrud";
export default function Crm() { return <><h1>CRM</h1><LocalCrud kind="lead" title="Leads pipeline" fields={[{ key: "name", label: "Name" }, { key: "mobile", label: "WhatsApp" }, { key: "stage", label: "Stage", type: "select", options: ["NEW", "CONTACTED", "QUALIFIED", "WON", "LOST"] }, { key: "notes", label: "Notes" }]}
  footer={(rows) => <p className="muted">{rows.length} leads · WhatsApp follow-ups are sent via the configured messaging adapter (MESSAGING_PROVIDER).</p>} /></>; }
