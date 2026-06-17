"use client";

import { FormEvent, useState } from "react";
import { Plus } from "lucide-react";
import { DataSourceBadge } from "@/components/DataSourceBadge";
import { DashboardShell } from "@/components/DashboardShell";
import { ProjectCard } from "@/components/ProjectCard";
import { EmptyState, ErrorState, LoadingState } from "@/components/ResourceState";
import { useAuth } from "@/hooks/use-auth";
import { useProjects } from "@/hooks/use-projects";
import { sendProjectInvite } from "@/services/pactoraService";

export default function ProjectsPage() {
  const { data: projects, source, loading, error } = useProjects();
  const { profile } = useAuth();
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null);
  const [sendingInvite, setSendingInvite] = useState(false);

  async function handleInvite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    setSendingInvite(true);
    setInviteError(null);
    setInviteSuccess(null);

    try {
      await sendProjectInvite({
        projectId: String(form.get("projectId") ?? ""),
        contractorEmail: String(form.get("email") ?? ""),
        invitedBy: profile?.id ?? ""
      });
      formElement.reset();
      setInviteSuccess("Project invite sent.");
    } catch (error) {
      setInviteError(error instanceof Error ? error.message : "Project invite could not be sent.");
    } finally {
      setSendingInvite(false);
    }
  }

  return (
    <DashboardShell
      title="Projects"
      subtitle="All protected agreements, counterparties, values, due dates, and trust signals."
      action={<div className="flex flex-wrap items-center gap-3"><DataSourceBadge source={source} loading={loading} /><a href="/dashboard/client" className="inline-flex items-center gap-2 rounded-lg bg-purple px-4 py-3 text-sm font-black text-white"><Plus size={17} /> Create project</a></div>}
    >
      {error ? <div className="mb-6"><ErrorState message={`Supabase request failed: ${error}`} /></div> : null}
      <form onSubmit={handleInvite} className="mb-6 grid gap-3 rounded-lg border border-slate-200 bg-white p-5 shadow-soft lg:grid-cols-[1fr_1fr_150px]">
        <select name="projectId" required className="rounded-lg border border-slate-200 px-4 py-3 text-sm font-bold text-navy outline-none focus:border-purple">
          <option value="">Project to invite into</option>
          {projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
        </select>
        <input name="email" type="email" required placeholder="Contractor email" className="rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-purple" />
        <button disabled={sendingInvite} className="rounded-lg bg-navy px-4 py-3 text-sm font-black text-white disabled:opacity-50">{sendingInvite ? "Sending" : "Send invite"}</button>
        {inviteError ? <p className="text-sm font-bold text-rose-700 lg:col-span-3">{inviteError}</p> : null}
        {inviteSuccess ? <p className="text-sm font-bold text-emerald lg:col-span-3">{inviteSuccess}</p> : null}
      </form>
      {loading ? <LoadingState /> : null}
      {!loading && projects.length === 0 ? <EmptyState message="No projects found." /> : null}
      <div className="space-y-5">
        {projects.map((project) => <ProjectCard key={project.id} project={project} />)}
      </div>
    </DashboardShell>
  );
}
