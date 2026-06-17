"use client";

import { BarChart3, CheckCircle2, Clock3, DollarSign } from "lucide-react";
import type { Milestone, Project, Status } from "@/types";
import { StatusBadge } from "./StatusBadge";

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

const statusLabels: Record<Status, string> = {
  active: "In progress",
  pending: "Pending",
  submitted: "Submitted",
  approved: "Approved",
  revision_requested: "Revision requested",
  rejected: "Rejected",
  in_review: "In review",
  paid: "Paid",
  disputed: "Disputed",
  resolved: "Resolved",
  frozen: "Paused"
};

const statusColors: Record<Status, string> = {
  active: "bg-purple",
  pending: "bg-slate-300",
  submitted: "bg-purple",
  approved: "bg-emerald",
  revision_requested: "bg-amber-400",
  rejected: "bg-rose-400",
  in_review: "bg-amber-400",
  paid: "bg-navy",
  disputed: "bg-rose-600",
  resolved: "bg-emerald",
  frozen: "bg-slate-500"
};

export function MilestoneOverview({
  milestones,
  projects,
  selectedProjectId,
  onSelectProject
}: {
  milestones: Milestone[];
  projects: Project[];
  selectedProjectId: string;
  onSelectProject: (projectId: string) => void;
}) {
  const selectedMilestones = selectedProjectId === "all"
    ? milestones
    : milestones.filter((milestone) => milestone.projectId === selectedProjectId);
  const totalValue = selectedMilestones.reduce((total, milestone) => total + amountValue(milestone.amount), 0);
  const approvedCount = selectedMilestones.filter((milestone) => milestone.status === "approved" || milestone.status === "paid").length;
  const pendingCount = selectedMilestones.filter((milestone) => milestone.status === "pending" || milestone.status === "in_review" || milestone.status === "submitted").length;
  const completion = selectedMilestones.length ? Math.round((approvedCount / selectedMilestones.length) * 100) : 0;
  const visibleStatuses = Array.from(new Set(selectedMilestones.map((milestone) => milestone.status)));

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-lg font-black text-navy">
            <BarChart3 size={20} />
            Milestone assurance
          </div>
          <p className="mt-1 text-sm font-semibold text-slate-500">Select a project to review delivery, value, and approval progress.</p>
        </div>
        <select
          value={selectedProjectId}
          onChange={(event) => onSelectProject(event.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-black text-navy outline-none focus:border-purple"
        >
          <option value="all">All projects</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>{project.name}</option>
          ))}
        </select>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <div className="rounded-lg bg-cloud p-4">
          <DollarSign className="text-purple" size={20} />
          <p className="mt-2 text-2xl font-black text-navy">{formatMoney(totalValue)}</p>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Milestone value</p>
        </div>
        <div className="rounded-lg bg-cloud p-4">
          <CheckCircle2 className="text-emerald" size={20} />
          <p className="mt-2 text-2xl font-black text-navy">{completion}%</p>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Approved progress</p>
        </div>
        <div className="rounded-lg bg-cloud p-4">
          <Clock3 className="text-amber-500" size={20} />
          <p className="mt-2 text-2xl font-black text-navy">{pendingCount}</p>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Pending decisions</p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {visibleStatuses.length === 0 ? (
          <p className="rounded-lg bg-cloud p-4 text-sm font-bold text-slate-500">No milestones yet for this selection.</p>
        ) : null}
        {visibleStatuses.map((status) => {
          const count = selectedMilestones.filter((milestone) => milestone.status === status).length;
          const percent = selectedMilestones.length ? Math.round((count / selectedMilestones.length) * 100) : 0;

          return (
            <div key={status}>
              <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                <span className="font-black text-navy">{statusLabels[status]}</span>
                <span className="font-bold text-slate-500">{count} milestone{count === 1 ? "" : "s"}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div className={`h-full rounded-full ${statusColors[status]}`} style={{ width: `${percent}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      {selectedMilestones.length > 0 ? (
        <div className="mt-5 space-y-3">
          {selectedMilestones.slice(0, 4).map((milestone) => (
            <div key={milestone.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-100 p-3">
              <div>
                <p className="font-black text-navy">{milestone.title}</p>
                <p className="text-sm font-semibold text-slate-500">{milestone.amount} · Due {milestone.dueDate}</p>
              </div>
              <StatusBadge status={milestone.status} />
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
