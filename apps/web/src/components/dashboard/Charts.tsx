"use client";
// Note: recharts has no DoughnutChart/Doughnut exports; a PieChart with innerRadius is the doughnut.
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import SampleBadge from "./SampleBadge";
// SAMPLE DATA — illustrative only, not read from your database.
const revenueData = [
  { name: "Mon", revenue: 18200, orders: 32 }, { name: "Tue", revenue: 22400, orders: 41 }, { name: "Wed", revenue: 19800, orders: 35 },
  { name: "Thu", revenue: 28500, orders: 52 }, { name: "Fri", revenue: 24580, orders: 47 }, { name: "Sat", revenue: 31200, orders: 58 }, { name: "Sun", revenue: 27800, orders: 49 },
];
const paymentMethods = [
  { name: "UPI", value: 62, color: "#00b894" }, { name: "Cash", value: 18, color: "#fdcb6e" }, { name: "Card", value: 14, color: "#6c5ce7" }, { name: "Wallet", value: 6, color: "#fd79a8" },
];
const plData = [
  { month: "Apr", revenue: 42000, expenses: 18000 }, { month: "May", revenue: 55000, expenses: 22000 }, { month: "Jun", revenue: 48000, expenses: 15000 },
  { month: "Jul", revenue: 62000, expenses: 25000 }, { month: "Aug", revenue: 58000, expenses: 19000 }, { month: "Sep", revenue: 71000, expenses: 28000 },
  { month: "Oct", revenue: 68000, expenses: 21000 }, { month: "Nov", revenue: 78500, expenses: 23000 },
];
const tip = { contentStyle: { background: "#0f172a", border: "1px solid #334155", borderRadius: 8 } };
function Panel({ title, sample, children }: { title: string; sample: string; children: React.ReactNode }) {
  return <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4"><h3 className="mb-3 mt-0 text-sm font-semibold">{title}<SampleBadge label={sample} /></h3><div className="h-64">{children}</div></div>;
}
export default function Charts({ sampleLabel }: { sampleLabel: string }) {
  return (<div className="mb-4 grid gap-4 lg:grid-cols-3">
    <div className="lg:col-span-2"><Panel title="Weekly revenue" sample={sampleLabel}><ResponsiveContainer><LineChart data={revenueData}>
      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" /><XAxis dataKey="name" stroke="#64748b" /><YAxis stroke="#64748b" /><Tooltip {...tip} />
      <Line type="monotone" dataKey="revenue" stroke="#a855f7" strokeWidth={3} /></LineChart></ResponsiveContainer></Panel></div>
    <Panel title="Payment methods" sample={sampleLabel}><ResponsiveContainer><PieChart>
      <Pie data={paymentMethods} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>{paymentMethods.map((p) => <Cell key={p.name} fill={p.color} />)}</Pie>
      <Tooltip {...tip} /><Legend /></PieChart></ResponsiveContainer></Panel>
    <div className="lg:col-span-3"><Panel title="Profit & loss (₹)" sample={sampleLabel}><ResponsiveContainer><BarChart data={plData}>
      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" /><XAxis dataKey="month" stroke="#64748b" /><YAxis stroke="#64748b" /><Tooltip {...tip} /><Legend />
      <Bar dataKey="revenue" fill="#00b894" radius={[6, 6, 0, 0]} /><Bar dataKey="expenses" fill="#fd79a8" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></Panel></div>
  </div>);
}
