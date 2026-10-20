"use client";
import LocalCrud from "@/components/LocalCrud";
export default function Staff() { return <><h1>Staff</h1><LocalCrud kind="staff" title="Team" fields={[{ key: "name", label: "Name" }, { key: "mobile", label: "Mobile" }, { key: "role", label: "Role", type: "select", options: ["OWNER", "MANAGER", "CASHIER", "STAFF"] }]} /></>; }
