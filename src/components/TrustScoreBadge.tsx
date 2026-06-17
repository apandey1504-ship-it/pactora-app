export function TrustScoreBadge({ score }: { score: number }) {
  const label = score >= 90 ? "Excellent" : score >= 75 ? "Strong" : "Watch";

  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-sm font-bold text-navy ring-1 ring-slate-200">
      <span className="h-2.5 w-2.5 rounded-full bg-emerald" />
      {score} {label}
    </div>
  );
}
