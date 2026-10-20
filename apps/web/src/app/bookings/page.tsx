"use client";
import LocalCrud from "@/components/LocalCrud";
export default function Bookings() { return <><h1>Appointments</h1><LocalCrud kind="booking" title="Bookings" fields={[{ key: "customer", label: "Customer" }, { key: "mobile", label: "Mobile" }, { key: "service", label: "Service" }, { key: "when", label: "When", type: "datetime-local" }]} /></>; }
