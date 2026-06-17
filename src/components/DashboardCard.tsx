import { LucideIcon } from "lucide-react";

export function DashboardCard({
  label,
  value,
  delta,
  icon: Icon
}: {
  label: string;
  value: string;
  delta: string;
  icon: LucideIcon;
}) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-500">{label}</p>
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-purple/10 text-purple">
          <Icon size={18} />
        </span>
      </div>
      <div className="mt-5 flex items-end justify-between">
        <p className="text-3xl font-black tracking-tight text-navy">{value}</p>
        <p className="text-sm font-bold text-emerald">{delta}</p>
      </div>
    </section>
  );
}
