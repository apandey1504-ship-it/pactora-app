"use client";

import { CreditCard, LockKeyhole } from "lucide-react";
import { DataSourceBadge } from "@/components/DataSourceBadge";
import { DashboardShell } from "@/components/DashboardShell";
import { useMilestones } from "@/hooks/use-milestones";

export default function PaymentsPage() {
  const { data: milestones, source, loading } = useMilestones();

  return (
    <DashboardShell
      title="Payments"
      subtitle="Placeholder for payment holds, release readiness, and future payment provider integrations."
      action={<div className="flex flex-wrap items-center gap-3"><DataSourceBadge source={source} loading={loading} /><button className="inline-flex items-center gap-2 rounded-lg bg-navy px-4 py-3 text-sm font-black text-white"><LockKeyhole size={17} /> Payments disabled</button></div>}
    >
      <section className="rounded-lg border border-slate-200 bg-white p-8 shadow-soft">
        <CreditCard className="text-purple" size={34} />
        <h2 className="mt-5 text-3xl font-black tracking-tight text-navy">Payment rails are not integrated yet.</h2>
        <p className="mt-3 max-w-2xl font-medium leading-7 text-slate-600">
          Pactora is structured to connect payment status to milestone approvals later. For now, this page shows release readiness without moving money.
        </p>
      </section>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {milestones.map((milestone) => (
          <div key={milestone.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
            <p className="font-black text-navy">{milestone.title}</p>
            <p className="mt-2 text-sm font-semibold text-slate-500">{milestone.amount} · {milestone.status.replace("_", " ")}</p>
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}
