export default function SampleBadge({ label }: { label: string }) {
  return <span className="ml-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-300">{label}</span>;
}
