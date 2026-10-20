import SampleBadge from "./SampleBadge";
type Tone = "emerald" | "purple" | "cyan" | "pink";
// Static class map: Tailwind can only keep classes it can see in full in the source.
const TONE: Record<Tone, string> = {
  emerald: "bg-emerald-500/20 text-emerald-300",
  purple: "bg-purple-500/20 text-purple-300",
  cyan: "bg-cyan-500/20 text-cyan-300",
  pink: "bg-pink-500/20 text-pink-300",
};
const STATS: { label: string; value: string; change: string; icon: string; tone: Tone }[] = [
  { label: "Today's Revenue", value: "₹24,580", change: "+12.5%", icon: "💰", tone: "emerald" },
  { label: "Orders", value: "47", change: "+8.2%", icon: "📦", tone: "purple" },
  { label: "UPI Payments", value: "62%", change: "+4.1%", icon: "💳", tone: "cyan" },
  { label: "New Customers", value: "18", change: "+22%", icon: "🎯", tone: "pink" },
];
export default function StatCards({ sampleLabel }: { sampleLabel: string }) {
  return (<div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">{STATS.map((s) => (
    <div key={s.label} className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
      <div className={`mb-2 flex h-10 w-10 items-center justify-center rounded-xl text-xl ${TONE[s.tone]}`}>{s.icon}</div>
      <div className="text-xs text-slate-400">{s.label}<SampleBadge label={sampleLabel} /></div>
      <div className="text-2xl font-bold">{s.value}</div><div className="text-xs text-emerald-400">{s.change}</div>
    </div>))}</div>);
}
