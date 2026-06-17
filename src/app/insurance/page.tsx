"use client";

import { ShieldCheck, ShieldPlus, WalletCards, AlertTriangle } from "lucide-react";
import { DashboardCard } from "@/components/DashboardCard";
import { DashboardShell } from "@/components/DashboardShell";
import { useProjects } from "@/hooks/use-projects";

const coverageRows = [
  { name: "Scope-change protection", status: "Available", detail: "Flags unfunded scope movement before approval." },
  { name: "Milestone assurance reserve", status: "Coming soon", detail: "Placeholder for payment hold and release workflows." },
  { name: "Dispute prevention review", status: "Active", detail: "Highlights missing evidence and approval gaps." }
];

export default function InsurancePage() {
  const { data: projects, source } = useProjects();
  const protectedValue = projects.reduce((total, project) => total + Number(project.value.replace(/[^0-9.-]+/g, "")), 0);
  const reserveTarget = Math.round(protectedValue * 0.03);
  const protectedDays = projects.length * 14;
  const stats = [
    { label: "Protected value", value: `$${(protectedValue / 1000000).toFixed(1)}M`, delta: source },
    { label: "Reserve target", value: `$${reserveTarget.toLocaleString()}`, delta: "3% estimate" },
    { label: "Time protected", value: `${protectedDays} days`, delta: "Delay exposure" },
    { label: "Risk alerts", value: "AI ready", delta: "Progress checks" }
  ];

  return (
    <DashboardShell
      title="Insurance"
      subtitle="Plan agreement protection, milestone assurance reserves, and dispute-prevention coverage."
    >
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => (
          <DashboardCard key={stat.label} {...stat} icon={[ShieldPlus, WalletCards, AlertTriangle, ShieldCheck][index]} />
        ))}
      </div>

      <section className="mt-8 rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        <h2 className="text-lg font-black text-navy">Cost and time protection catalog</h2>
        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {coverageRows.map((row) => (
            <div key={row.name} className="rounded-lg border border-slate-100 bg-cloud p-5">
              <p className="font-black text-navy">{row.name}</p>
              <p className="mt-2 text-sm font-black text-emerald">{row.status}</p>
              <p className="mt-3 text-sm font-semibold leading-6 text-slate-500">{row.detail}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="mt-6 rounded-lg bg-navy p-6 text-white shadow-soft">
        <p className="text-sm font-black uppercase tracking-wide text-emerald">Major sell point</p>
        <h2 className="mt-3 text-3xl font-black">Protect project cost and timeline before disputes start.</h2>
        <p className="mt-3 max-w-3xl text-sm font-semibold leading-6 text-white/70">
          Pactora records baseline value, expected delivery windows, approved changes, reserve assumptions, and milestone evidence so clients and contractors can see what cost and time exposure is protected.
        </p>
      </section>
    </DashboardShell>
  );
}
