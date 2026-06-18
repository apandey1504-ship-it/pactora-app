"use client";

import { FormEvent, useState } from "react";
import { BadgeCheck, Plus } from "lucide-react";
import { DataSourceBadge } from "@/components/DataSourceBadge";
import { DashboardShell } from "@/components/DashboardShell";
import { MilestoneOverview } from "@/components/MilestoneOverview";
import { MilestoneTable } from "@/components/MilestoneTable";
import { EmptyState, ErrorState, LoadingState } from "@/components/ResourceState";
import { useMilestones } from "@/hooks/use-milestones";
import { useProjects } from "@/hooks/use-projects";
import { approveMilestone, createMilestone, requestRevision, submitMilestone } from "@/services/pactoraService";

export default function MilestonesPage() {
  const { data: milestones, source, loading, error, refetch } = useMilestones();
  const { data: projects } = useProjects();
  const [showForm, setShowForm] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState("all");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function handleCreateMilestone(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSaving(true);
    setFormError(null);

    try {
      await createMilestone({
        project_id: String(form.get("projectId") ?? ""),
        title: String(form.get("title") ?? ""),
        description: String(form.get("description") ?? ""),
        amount: Number(form.get("amount") ?? 0),
        currency: "USD",
        due_date: String(form.get("dueDate") ?? "") || null,
        status: "pending"
      });
      event.currentTarget.reset();
      setShowForm(false);
      await refetch();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Milestone could not be created.");
    } finally {
      setSaving(false);
    }
  }

  async function updateAndRefresh(action: (id: string) => Promise<unknown>, id: string) {
    try {
      await action(id);
      await refetch();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Milestone update failed.");
    }
  }

  return (
    <DashboardShell
      title="Milestones"
      subtitle="Track deliverables, approvals, acceptance evidence, and payment readiness."
      action={<><DataSourceBadge source={source} loading={loading} /><button onClick={() => setShowForm((value) => !value)} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-purple px-4 py-3 text-sm font-black text-white sm:w-auto"><Plus size={17} /> Add milestone</button></>}
    >
      {showForm ? (
        <form onSubmit={handleCreateMilestone} className="mb-6 rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
          <div className="grid gap-4 md:grid-cols-5">
            <select name="projectId" required className="rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-purple">
              <option value="">Project</option>
              {projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
            </select>
            <input name="title" required placeholder="Milestone title" className="rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-purple" />
            <input name="amount" type="number" min="0" placeholder="Amount" className="rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-purple" />
            <input name="dueDate" type="date" className="rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-purple" />
            <button disabled={saving} className="rounded-lg bg-navy px-4 py-3 text-sm font-black text-white disabled:opacity-50">{saving ? "Saving" : "Save milestone"}</button>
          </div>
          <textarea name="description" placeholder="Description" className="mt-4 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-purple" />
        </form>
      ) : null}
      {error ? <div className="mb-6"><ErrorState message={`Supabase request failed: ${error}`} /></div> : null}
      {formError ? <div className="mb-6"><ErrorState message={formError} /></div> : null}
      <div className="mb-5 grid gap-4 md:grid-cols-3">
        {["Awaiting approval", "Ready for evidence", "Payment eligible"].map((item) => (
          <div key={item} className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
            <BadgeCheck className="text-purple" size={22} />
            <p className="mt-3 font-black text-navy">{item}</p>
          </div>
        ))}
      </div>
      <div className="mb-6">
        <MilestoneOverview
          milestones={milestones}
          projects={projects}
          selectedProjectId={selectedProjectId}
          onSelectProject={setSelectedProjectId}
        />
      </div>
      {loading ? <LoadingState /> : null}
      {!loading && milestones.length === 0 ? <EmptyState message="No milestones found." /> : null}
      {milestones.length > 0 ? (
        <MilestoneTable
          milestones={milestones}
          onSubmit={(id) => updateAndRefresh(submitMilestone, id)}
          onApprove={(id) => updateAndRefresh(approveMilestone, id)}
          onRequestRevision={(id) => updateAndRefresh(requestRevision, id)}
        />
      ) : null}
    </DashboardShell>
  );
}
