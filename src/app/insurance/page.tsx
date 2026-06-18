"use client";

import { AlertTriangle, FileSignature, ShieldCheck, ShieldPlus, WalletCards } from "lucide-react";
import { DashboardCard } from "@/components/DashboardCard";
import { DashboardShell } from "@/components/DashboardShell";
import { useProjects } from "@/hooks/use-projects";

const coverageRows = [
  { name: "Scope-change protection", status: "Available", detail: "Flags unfunded scope movement before approval." },
  { name: "Milestone assurance reserve", status: "Provider ready", detail: "Connects to held funds and release workflows when payment rails are enabled." },
  { name: "Timeline delay protection", status: "Beta", detail: "Tracks time-cost exposure, approved extensions, and delay disputes." }
];

const coverageCategories = [
  "Cost overrun coverage",
  "Timeline delay coverage",
  "Milestone non-delivery coverage",
  "Scope-change reserve",
  "Dispute review support"
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
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-navy">Cost and time protection catalog</h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">Build a project protection plan both client and contractor can review before signing.</p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-lg bg-purple px-4 py-3 text-sm font-black text-white">
            <FileSignature size={17} /> Prepare DocuSign packet
          </button>
        </div>
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
      <section className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <form className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
          <h2 className="text-lg font-black text-navy">Protection plan builder</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <select className="rounded-lg border border-slate-200 px-4 py-3 text-sm font-bold text-navy outline-none focus:border-purple">
              <option>Select project</option>
              {projects.map((project) => <option key={project.id}>{project.name}</option>)}
            </select>
            <input placeholder="Contractor or insurer name" className="rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-purple" />
            <select className="rounded-lg border border-slate-200 px-4 py-3 text-sm font-bold text-navy outline-none focus:border-purple">
              <option>Basic review plan</option>
              <option>Premium cost + time plan</option>
              <option>Enterprise insured workflow</option>
            </select>
            <input type="number" min="0" placeholder="Estimated premium" className="rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-purple" />
            <select className="md:col-span-2 rounded-lg border border-slate-200 px-4 py-3 text-sm font-bold text-navy outline-none focus:border-purple">
              {coverageCategories.map((category) => <option key={category}>{category}</option>)}
            </select>
            <textarea placeholder="Coverage notes, exclusions, claim trigger, or insurer requirement" className="md:col-span-2 min-h-28 rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-purple" />
          </div>
          <button type="button" className="mt-4 rounded-lg bg-navy px-4 py-3 text-sm font-black text-white">Save protection draft</button>
        </form>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
          <h2 className="text-lg font-black text-navy">Signing and verification</h2>
          <div className="mt-5 space-y-3">
            {["Client reviews coverage", "Contractor accepts plan", "DocuSign packet prepared", "Insurance certificate uploaded", "Admin verifies coverage"].map((step, index) => (
              <div key={step} className="flex items-center gap-3 rounded-lg bg-cloud p-4">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white text-sm font-black text-purple ring-1 ring-slate-200">{index + 1}</span>
                <p className="text-sm font-black text-navy">{step}</p>
              </div>
            ))}
          </div>
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
