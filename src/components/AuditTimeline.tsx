"use client";

import { Activity, CheckCircle2, FileText, GitPullRequest, MessageSquare, ShieldAlert } from "lucide-react";
import type { AuditLogRow } from "@/services/pactoraService";

const actionCopy: Record<string, { title: string; detail: (metadata: Record<string, unknown>) => string; icon: typeof Activity }> = {
  "project.created": {
    title: "Project created",
    detail: (metadata) => `${String(metadata.title ?? "A project")} was added to Pactora.`,
    icon: FileText
  },
  "project.status_updated": {
    title: "Project status updated",
    detail: (metadata) => `Project status changed to ${String(metadata.status ?? "updated")}.`,
    icon: CheckCircle2
  },
  "project.accepted": {
    title: "Project accepted",
    detail: () => "A contractor accepted the project and joined the agreement workflow.",
    icon: CheckCircle2
  },
  "milestone.created": {
    title: "Milestone added",
    detail: (metadata) => `${String(metadata.title ?? "A milestone")} was added with tracked acceptance criteria.`,
    icon: CheckCircle2
  },
  "milestone.status_updated": {
    title: "Milestone updated",
    detail: (metadata) => `Milestone moved to ${String(metadata.status ?? "a new status")}.`,
    icon: CheckCircle2
  },
  "change_request.created": {
    title: "Change request created",
    detail: (metadata) => `Cost impact ${String(metadata.impact_cost ?? 0)} and time impact ${String(metadata.impact_days ?? 0)} days were logged.`,
    icon: GitPullRequest
  },
  "change_request.approved": {
    title: "Change request approved",
    detail: (metadata) => `Approved change updated project value by ${String(metadata.project_value_delta ?? 0)} and timeline by ${String(metadata.milestone_due_date_delta_days ?? 0)} days.`,
    icon: GitPullRequest
  },
  "change_request.status_updated": {
    title: "Change request updated",
    detail: (metadata) => `Change request moved to ${String(metadata.status ?? "a new status")}.`,
    icon: GitPullRequest
  },
  "message.sent": {
    title: "Message sent",
    detail: () => "A project message was recorded in the agreement thread.",
    icon: MessageSquare
  },
  "document.uploaded": {
    title: "Document uploaded",
    detail: (metadata) => `${String(metadata.file_name ?? "A document")} was attached to the project.`,
    icon: FileText
  },
  "dispute.created": {
    title: "Dispute raised",
    detail: (metadata) => `${String(metadata.reason ?? "A dispute")} was opened for review.`,
    icon: ShieldAlert
  },
  "dispute.resolved": {
    title: "Dispute resolved",
    detail: () => "An admin completed dispute review and recorded the outcome.",
    icon: ShieldAlert
  },
  "dispute.status_updated": {
    title: "Dispute updated",
    detail: (metadata) => `Dispute status changed to ${String(metadata.status ?? "updated")}.`,
    icon: ShieldAlert
  },
  "company.verification_updated": {
    title: "Company verification updated",
    detail: (metadata) => `Company verification is now ${String(metadata.verification_status ?? "updated")}.`,
    icon: CheckCircle2
  },
  "project.invite_sent": {
    title: "Project invite sent",
    detail: (metadata) => `Invite sent to ${String(metadata.contractor_email ?? "a contractor")}.`,
    icon: MessageSquare
  }
};

function readableAction(action: string) {
  return action
    .replaceAll(".", " ")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getMetadata(log: AuditLogRow) {
  return (log.metadata && typeof log.metadata === "object" && !Array.isArray(log.metadata))
    ? log.metadata as Record<string, unknown>
    : {};
}

export function AuditTimeline({ logs, compact = false }: { logs: AuditLogRow[]; compact?: boolean }) {
  return (
    <div className="space-y-3">
      {logs.map((log) => {
        const metadata = getMetadata(log);
        const copy = actionCopy[log.action];
        const Icon = copy?.icon ?? Activity;

        return (
          <div key={log.id} className="rounded-lg bg-cloud p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex gap-3">
                <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white text-purple ring-1 ring-slate-200">
                  <Icon size={18} />
                </span>
                <div>
                  <p className="font-black text-navy">{copy?.title ?? readableAction(log.action)}</p>
                  <p className="mt-1 text-sm font-semibold leading-6 text-slate-500">
                    {copy?.detail(metadata) ?? "A Pactora activity was recorded."}
                  </p>
                </div>
              </div>
              <p className="text-xs font-black uppercase tracking-wide text-slate-400">{new Date(log.created_at).toLocaleString()}</p>
            </div>
            {!compact ? (
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold text-slate-500">
                <span className="rounded-full bg-white px-3 py-1 ring-1 ring-slate-200">
                  {log.project_id ? `Project ${log.project_id.slice(0, 8)}` : "Platform"}
                </span>
                <span className="rounded-full bg-white px-3 py-1 ring-1 ring-slate-200">
                  {log.user_id ? `User ${log.user_id.slice(0, 8)}` : "System"}
                </span>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
