"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, Clock3, Plus, Send } from "lucide-react";
import { ChangeRequestCard } from "@/components/ChangeRequestCard";
import { DataSourceBadge } from "@/components/DataSourceBadge";
import { DashboardShell } from "@/components/DashboardShell";
import { DocumentUploadPanel } from "@/components/DocumentUploadPanel";
import { MilestoneTable } from "@/components/MilestoneTable";
import { StatusBadge } from "@/components/StatusBadge";
import { TrustScoreBadge } from "@/components/TrustScoreBadge";
import { useAuth } from "@/hooks/use-auth";
import { useChangeRequests } from "@/hooks/use-change-requests";
import { useDocuments } from "@/hooks/use-documents";
import { useMilestones } from "@/hooks/use-milestones";
import { useProject } from "@/hooks/use-projects";
import {
  acceptProject,
  approveChangeRequest,
  approveMilestone,
  createChangeRequest,
  createMilestone,
  rejectChangeRequest,
  requestRevision,
  submitMilestone
} from "@/services/pactoraService";

export default function ProjectDetailsPage({ params }: { params: { id: string } }) {
  const { data: project, source, loading } = useProject(params.id);
  const { data: milestones, refetch: refetchMilestones } = useMilestones(params.id);
  const { data: changeRequests, refetch: refetchChanges } = useChangeRequests(params.id);
  const { data: documents, refetch: refetchDocuments } = useDocuments(params.id);
  const { profile } = useAuth();
  const [showMilestoneForm, setShowMilestoneForm] = useState(false);
  const [projectError, setProjectError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function updateMilestone(action: (id: string) => Promise<unknown>, id: string) {
    await action(id);
    await refetchMilestones();
  }

  async function updateChange(action: (id: string) => Promise<unknown>, id: string) {
    await action(id);
    await refetchChanges();
  }

  async function handleAcceptProject() {
    setSaving(true);
    setProjectError(null);

    try {
      await acceptProject(params.id);
      window.location.reload();
    } catch (error) {
      setProjectError(error instanceof Error ? error.message : "Project could not be accepted.");
    } finally {
      setSaving(false);
    }
  }

  async function handleCreateMilestone(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    setSaving(true);
    setProjectError(null);

    try {
      await createMilestone({
        project_id: params.id,
        title: String(form.get("title") ?? ""),
        description: String(form.get("description") ?? ""),
        amount: Number(form.get("amount") ?? 0),
        currency: "USD",
        due_date: String(form.get("dueDate") ?? "") || null,
        status: "pending"
      });
      formElement.reset();
      setShowMilestoneForm(false);
      await refetchMilestones();
    } catch (error) {
      setProjectError(error instanceof Error ? error.message : "Milestone could not be created.");
    } finally {
      setSaving(false);
    }
  }

  async function handleTimelineExtension() {
    setSaving(true);
    setProjectError(null);

    try {
      await createChangeRequest({
        project_id: params.id,
        requested_by: profile?.id ?? "",
        title: "Timeline extension request",
        description: "Contractor requested extra delivery time for this project.",
        impact_cost: 0,
        impact_days: 7,
        status: "contractor_review",
        approved_by_client: false,
        approved_by_contractor: true
      });
      await refetchChanges();
    } catch (error) {
      setProjectError(error instanceof Error ? error.message : "Timeline extension request failed.");
    } finally {
      setSaving(false);
    }
  }

  if (!project) {
    return (
      <DashboardShell title="Project not found" subtitle="This project could not be loaded.">
        <div className="rounded-lg border border-slate-200 bg-white p-8 shadow-soft">
          <p className="font-bold text-slate-600">Check the project URL or create a new project.</p>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell
      title={project.name}
      subtitle={`${project.company} and ${project.counterparty}`}
      action={<div className="flex flex-wrap items-center gap-3"><DataSourceBadge source={source} loading={loading} /><TrustScoreBadge score={project.trustScore} /></div>}
    >
      {projectError ? (
        <div className="mb-6 rounded-lg bg-rose-50 p-4 text-sm font-bold text-rose-700">{projectError}</div>
      ) : null}
      <section className="mb-6 rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-navy">Contractor workflow</h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">Accept the project, set milestones, submit work, or request timeline changes.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={handleAcceptProject} disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-purple px-4 py-3 text-sm font-black text-white disabled:opacity-50">
              <CheckCircle2 size={17} /> Accept project
            </button>
            <button onClick={() => setShowMilestoneForm((value) => !value)} className="inline-flex items-center gap-2 rounded-lg bg-navy px-4 py-3 text-sm font-black text-white">
              <Plus size={17} /> Set milestone
            </button>
            <button onClick={handleTimelineExtension} disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-black text-navy ring-1 ring-slate-200 disabled:opacity-50">
              <Clock3 size={17} /> Request extension
            </button>
          </div>
        </div>
        {showMilestoneForm ? (
          <form onSubmit={handleCreateMilestone} className="mt-5 grid gap-4 lg:grid-cols-[1fr_150px_170px_150px]">
            <input name="title" required placeholder="Milestone title" className="rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-purple" />
            <input name="amount" type="number" min="0" placeholder="Amount" className="rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-purple" />
            <input name="dueDate" type="date" className="rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-purple" />
            <button disabled={saving} className="rounded-lg bg-purple px-4 py-3 text-sm font-black text-white disabled:opacity-50">{saving ? "Saving" : "Save"}</button>
            <textarea name="description" placeholder="Milestone evidence or acceptance criteria" className="lg:col-span-4 rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-purple" />
          </form>
        ) : null}
      </section>
      <section className="grid gap-5 md:grid-cols-4">
        {[
          ["Contract value", project.value],
          ["Progress", `${project.progress}%`],
          ["Due date", project.dueDate],
          ["Status", <StatusBadge key="status" status={project.status} />]
        ].map(([label, value]) => (
          <div key={String(label)} className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
            <p className="text-xs font-black uppercase tracking-wide text-slate-400">{label}</p>
            <div className="mt-3 text-2xl font-black text-navy">{value}</div>
          </div>
        ))}
      </section>
      <section className="mt-8">
        <h2 className="mb-4 text-xl font-black text-navy">Milestones</h2>
        <MilestoneTable
          milestones={milestones}
          onSubmit={(id) => updateMilestone(submitMilestone, id)}
          onApprove={(id) => updateMilestone(approveMilestone, id)}
          onRequestRevision={(id) => updateMilestone(requestRevision, id)}
        />
      </section>
      <section className="mt-8">
        <DocumentUploadPanel projectId={params.id} uploadedBy={profile?.id} documents={documents} onUploaded={refetchDocuments} />
      </section>
      <section className="mt-8 grid gap-5 lg:grid-cols-3">
        {changeRequests.map((request) => (
          <ChangeRequestCard
            key={request.id}
            request={request}
            onApprove={(id) => updateChange(approveChangeRequest, id)}
            onReject={(id) => updateChange(rejectChangeRequest, id)}
          />
        ))}
      </section>
    </DashboardShell>
  );
}
