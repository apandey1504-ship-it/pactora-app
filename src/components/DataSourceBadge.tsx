"use client";

export function DataSourceBadge({ source, loading }: { source: "supabase" | "mock"; loading?: boolean }) {
  return (
    <span className="rounded-full bg-white px-3 py-1.5 text-xs font-black text-slate-500 ring-1 ring-slate-200">
      {loading ? "Loading data" : source === "supabase" ? "Live data" : "Setup required"}
    </span>
  );
}
