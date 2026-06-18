"use client";

import { CreditCard, LockKeyhole, WalletCards } from "lucide-react";
import { DataSourceBadge } from "@/components/DataSourceBadge";
import { DashboardCard } from "@/components/DashboardCard";
import { DashboardShell } from "@/components/DashboardShell";
import { StatusBadge } from "@/components/StatusBadge";
import { useMilestones } from "@/hooks/use-milestones";
import { useProjects } from "@/hooks/use-projects";

function amountValue(amount: string) {
  return Number(amount.replace(/[^0-9.-]+/g, "")) || 0;
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

export default function PaymentsPage() {
  const { data: milestones, source, loading } = useMilestones();
  const { data: projects } = useProjects();
  const milestoneValue = milestones.reduce((total, milestone) => total + amountValue(milestone.amount), 0);
  const releasedValue = milestones
    .filter((milestone) => milestone.status === "paid" || milestone.status === "approved")
    .reduce((total, milestone) => total + amountValue(milestone.amount), 0);
  const heldValue = Math.max(milestoneValue - releasedValue, 0);
  const projectCost = projects.reduce((total, project) => total + amountValue(project.value), 0);
  const stats = [
    { label: "Project cost", value: formatMoney(projectCost), delta: "Tracked" },
    { label: "Held value", value: formatMoney(heldValue), delta: "Pending release" },
    { label: "Released value", value: formatMoney(releasedValue), delta: "Approved" },
    { label: "Payment rails", value: "Placeholder", delta: "No live money movement" }
  ];

  return (
    <DashboardShell
      title="Payments"
      subtitle="Placeholder for payment holds, release readiness, and future payment provider integrations."
      action={<div className="flex flex-wrap items-center gap-3"><DataSourceBadge source={source} loading={loading} /><button className="inline-flex items-center gap-2 rounded-lg bg-navy px-4 py-3 text-sm font-black text-white"><LockKeyhole size={17} /> Payments disabled</button></div>}
    >
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => (
          <DashboardCard key={stat.label} {...stat} icon={[WalletCards, LockKeyhole, CreditCard, CreditCard][index]} />
        ))}
      </div>
      <section className="mt-6 rounded-lg border border-slate-200 bg-white p-8 shadow-soft">
        <CreditCard className="text-purple" size={34} />
        <h2 className="mt-5 text-3xl font-black tracking-tight text-navy">Payment rails are not integrated yet.</h2>
        <p className="mt-3 max-w-2xl font-medium leading-7 text-slate-600">
          Pactora is structured to connect payment status to milestone approvals later. For now, this page shows release readiness without moving money.
        </p>
      </section>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {milestones.map((milestone) => (
          <div key={milestone.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-black text-navy">{milestone.title}</p>
                <p className="mt-2 text-sm font-semibold text-slate-500">{milestone.amount} · Due {milestone.dueDate}</p>
              </div>
              <StatusBadge status={milestone.status} />
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg bg-cloud p-3">
                <p className="text-xs font-black uppercase tracking-wide text-slate-500">Hold</p>
                <p className="mt-1 font-black text-navy">{milestone.status === "approved" || milestone.status === "paid" ? "$0" : milestone.amount}</p>
              </div>
              <div className="rounded-lg bg-cloud p-3">
                <p className="text-xs font-black uppercase tracking-wide text-slate-500">Released</p>
                <p className="mt-1 font-black text-navy">{milestone.status === "approved" || milestone.status === "paid" ? milestone.amount : "$0"}</p>
              </div>
              <div className="rounded-lg bg-cloud p-3">
                <p className="text-xs font-black uppercase tracking-wide text-slate-500">Rule</p>
                <p className="mt-1 font-black text-navy">Client approval</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}
