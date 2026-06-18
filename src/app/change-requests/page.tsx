"use client";

import { FormEvent, useState } from "react";
import { GitPullRequest, Plus } from "lucide-react";
import { ChangeRequestCard } from "@/components/ChangeRequestCard";
import { DataSourceBadge } from "@/components/DataSourceBadge";
import { DashboardShell } from "@/components/DashboardShell";
import { EmptyState, ErrorState, LoadingState } from "@/components/ResourceState";
import { useAuth } from "@/hooks/use-auth";
import { useChangeRequests } from "@/hooks/use-change-requests";
import { useMilestones } from "@/hooks/use-milestones";
import { useProjects } from "@/hooks/use-projects";
import { approveChangeRequest, contractorRespondToChangeRequest, createChangeRequest, rejectChangeRequest } from "@/services/pactoraService";

export default function ChangeRequestsPage() {
  const { profile } = useAuth();
  const { data: changeRequests, source, loading, error, refetch } = useChangeRequests();
  const { data: projects } = useProjects();
  const { data: milestones } = useMilestones();
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function handleCreateChangeRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSaving(true);
    setFormError(null);

    try {
      await createChangeRequest({
        project_id: String(form.get("projectId") ?? ""),
        milestone_id: String(form.get("milestoneId") ?? "") || null,
        requested_by: profile?.id ?? "",
        title: String(form.get("title") ?? ""),
        description: String(form.get("description") ?? ""),
        impact_cost: Number(form.get("impactCost") ?? 0),
        impact_days: Number(form.get("impactDays") ?? 0),
        status: "requested"
      });
      event.currentTarget.reset();
      setShowForm(false);
      await refetch();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Change request could not be created.");
    } finally {
      setSaving(false);
    }
  }

  async function updateAndRefresh(action: (id: string) => Promise<unknown>, id: string) {
    try {
      await action(id);
      await refetch();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Change request update failed.");
    }
  }

  return (
    <DashboardShell
      title="Change requests"
      subtitle="Document scope, timeline, and cost changes before they affect the agreement."
      action={<><DataSourceBadge source={source} loading={loading} /><button onClick={() => setShowForm((value) => !value)} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-purple px-4 py-3 text-sm font-black text-white sm:w-auto"><Plus size={17} /> Request change</button></>}
    >
      {showForm ? (
        <form onSubmit={handleCreateChangeRequest} className="mb-6 rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
          <div className="grid gap-4 md:grid-cols-6">
            <select name="projectId" required className="rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-purple">
              <option value="">Project</option>
              {projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
            </select>
            <select name="milestoneId" className="rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-purple">
              <option value="">Milestone optional</option>
              {milestones.map((milestone) => <option key={milestone.id} value={milestone.id}>{milestone.title}</option>)}
            </select>
            <input name="title" required placeholder="Request title" className="rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-purple" />
            <input name="impactCost" type="number" min="0" placeholder="Impact cost" className="rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-purple" />
            <input name="impactDays" type="number" min="0" placeholder="Impact days" className="rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-purple" />
            <button disabled={saving} className="rounded-lg bg-navy px-4 py-3 text-sm font-black text-white disabled:opacity-50">{saving ? "Saving" : "Save request"}</button>
          </div>
          <textarea name="description" placeholder="Description" className="mt-4 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-purple" />
        </form>
      ) : null}
      {error ? <div className="mb-6"><ErrorState message={`Supabase request failed: ${error}`} /></div> : null}
      {formError ? <div className="mb-6"><ErrorState message={formError} /></div> : null}
      <div className="mb-6 rounded-lg bg-navy p-5 text-white sm:p-6">
        <div className="flex items-center gap-3">
          <GitPullRequest className="text-emerald" />
          <p className="font-black">Every change is linked to its commercial impact and approval trail.</p>
        </div>
      </div>
      {loading ? <LoadingState /> : null}
      {!loading && changeRequests.length === 0 ? <EmptyState message="No change requests found." /> : null}
      <div className="grid gap-5 lg:grid-cols-3">
        {changeRequests.map((request) => (
          <ChangeRequestCard
            key={request.id}
            request={request}
            onContractorAccept={(id) => updateAndRefresh((requestId) => contractorRespondToChangeRequest(requestId, true), id)}
            onApprove={(id) => updateAndRefresh(approveChangeRequest, id)}
            onReject={(id) => updateAndRefresh(rejectChangeRequest, id)}
          />
        ))}
      </div>
    </DashboardShell>
  );
}
