"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Clock3, FolderKanban, MessageSquare, Plus, ShieldCheck, WalletCards } from "lucide-react";
import { DataSourceBadge } from "@/components/DataSourceBadge";
import { DashboardCard } from "@/components/DashboardCard";
import { DashboardShell } from "@/components/DashboardShell";
import { MilestoneOverview } from "@/components/MilestoneOverview";
import { ProjectActivityPanel } from "@/components/ProjectActivityPanel";
import { ProjectCard } from "@/components/ProjectCard";
import { EmptyState, ErrorState, LoadingState } from "@/components/ResourceState";
import { useAuth } from "@/hooks/use-auth";
import { useMilestones } from "@/hooks/use-milestones";
import { useProjects } from "@/hooks/use-projects";
import { createProject } from "@/services/pactoraService";

const actionLinks = [
  { label: "Review contracts", href: "/contracts" },
  { label: "Check insurance", href: "/insurance" },
  { label: "Verify banking/company", href: "/verification" },
  { label: "Run AI assurance", href: "/ai-assurance" },
  { label: "Invite contractor", href: "/projects" },
  { label: "Add milestones", href: "/milestones" },
  { label: "Request change", href: "/change-requests" },
  { label: "Approve/reject milestone", href: "/milestones" },
  { label: "View messages", href: "/messages" },
  { label: "View trust score", href: "/trust-score" }
];

export default function ClientDashboardPage() {
  const icons = [FolderKanban, ShieldCheck, CheckCircle2, MessageSquare];
  const { profile } = useAuth();
  const { data: projects, source, loading, error, refetch } = useProjects();
  const { data: milestones, loading: milestonesLoading } = useMilestones();
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState("all");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const protectedValue = projects.reduce((total, project) => total + Number(project.value.replace(/[^0-9.-]+/g, "")), 0);
  const protectedTimeDays = projects.length * 14;
  const insuranceReserve = Math.round(protectedValue * 0.03);
  const averageTrust = Math.round(projects.reduce((total, project) => total + project.trustScore, 0) / Math.max(projects.length, 1));
  const pendingMilestones = milestones.filter((milestone) => milestone.status === "pending" || milestone.status === "submitted" || milestone.status === "revision_requested");
  const dashboardStats = [
    { label: "Active projects", value: String(projects.length), delta: profile?.role ?? "client" },
    { label: "Protected value", value: `$${(protectedValue / 1000000).toFixed(1)}M`, delta: source },
    { label: "Milestones due", value: String(pendingMilestones.length), delta: milestonesLoading ? "Loading" : "Needs action" },
    { label: "Trust score", value: String(averageTrust), delta: "Excellent" }
  ];

  async function handleCreateProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    setSaving(true);
    setFormError(null);

    try {
      await createProject({
        title: String(form.get("title") ?? ""),
        description: [
          String(form.get("description") ?? ""),
          `Protection plan: ${String(form.get("protectionPlan") ?? "standard")}`,
          `Estimated time exposure: ${String(form.get("timeExposure") ?? "0")} days`,
          `Cost reserve target: ${String(form.get("costReserve") ?? "0")}%`
        ].filter(Boolean).join("\n"),
        projectValue: Number(form.get("projectValue") ?? 0),
        dueDate: String(form.get("dueDate") ?? ""),
        createdBy: profile?.id ?? ""
      });
      formElement.reset();
      setShowProjectForm(false);
      await refetch();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Project could not be created.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <DashboardShell
      title="Client dashboard"
      subtitle="Manage project assurance, approvals, change requests, and contractor trust."
      allowedRoles={["client"]}
      action={<><DataSourceBadge source={source} loading={loading} /><button onClick={() => setShowProjectForm((value) => !value)} className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-purple px-4 py-3 text-sm font-black text-white sm:w-auto"><Plus size={17} /> Create project</button></>}
    >
      {showProjectForm ? (
        <form onSubmit={handleCreateProject} className="mb-6 rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
          <div className="grid gap-4 md:grid-cols-4">
            <input name="title" required placeholder="Project title" className="rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-purple" />
            <input name="projectValue" type="number" min="0" placeholder="Project value" className="rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-purple" />
            <input name="dueDate" type="date" className="rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-purple" />
            <button disabled={saving} className="rounded-lg bg-navy px-4 py-3 text-sm font-black text-white disabled:opacity-50">{saving ? "Saving" : "Save project"}</button>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <select name="protectionPlan" className="rounded-lg border border-slate-200 px-4 py-3 text-sm font-bold text-navy outline-none focus:border-purple">
              <option value="standard">Standard protection</option>
              <option value="cost-time">Cost + time protected</option>
              <option value="premium">Premium insurance review</option>
            </select>
            <input name="timeExposure" type="number" min="0" placeholder="Time risk days" className="rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-purple" />
            <input name="costReserve" type="number" min="0" max="100" placeholder="Cost reserve %" className="rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-purple" />
          </div>
          <textarea name="description" placeholder="Description" className="mt-4 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-purple" />
          {formError ? <p className="mt-3 text-sm font-bold text-rose-700">{formError}</p> : null}
        </form>
      ) : null}
      {error ? <div className="mb-6"><ErrorState message={`Supabase request failed: ${error}`} /></div> : null}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat, index) => (
          <DashboardCard key={stat.label} {...stat} icon={icons[index]} />
        ))}
      </div>
      <section className="mt-6 grid gap-5 lg:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
          <WalletCards className="text-purple" size={22} />
          <p className="mt-4 text-sm font-bold text-slate-500">Estimated insurance reserve</p>
          <p className="mt-2 text-3xl font-black text-navy">${insuranceReserve.toLocaleString()}</p>
          <p className="mt-2 text-sm font-semibold text-slate-500">Suggested 3% protection reserve against approved scope or delivery risk.</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
          <Clock3 className="text-emerald" size={22} />
          <p className="mt-4 text-sm font-bold text-slate-500">Time cost protected</p>
          <p className="mt-2 text-3xl font-black text-navy">{protectedTimeDays} days</p>
          <p className="mt-2 text-sm font-semibold text-slate-500">Tracks due-date exposure, timeline extensions, and disputed delivery delays.</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
          <ShieldCheck className="text-purple" size={22} />
          <p className="mt-4 text-sm font-bold text-slate-500">Protection mode</p>
          <p className="mt-2 text-3xl font-black text-navy">Cost + time</p>
          <p className="mt-2 text-sm font-semibold text-slate-500">Major project changes are captured before they create unpaid work or delay claims.</p>
        </div>
      </section>
      <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-5">
          <MilestoneOverview
            milestones={milestones}
            projects={projects}
            selectedProjectId={selectedProjectId}
            onSelectProject={setSelectedProjectId}
          />
          {loading ? <LoadingState /> : null}
          {!loading && projects.length === 0 ? <EmptyState message="No projects yet. Create your first protected agreement." /> : null}
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
        <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
          <h2 className="text-lg font-black text-navy">Client actions</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <button onClick={() => setShowProjectForm(true)} className="w-full rounded-lg bg-cloud px-4 py-3 text-left text-sm font-black text-navy transition hover:bg-purple hover:text-white">
              Create project
            </button>
            {actionLinks.map((action) => (
              <Link key={action.label} href={action.href} className="block w-full rounded-lg bg-cloud px-4 py-3 text-left text-sm font-black text-navy transition hover:bg-purple hover:text-white">
                {action.label}
              </Link>
            ))}
          </div>
          <div className="mt-5 rounded-lg bg-navy p-4 text-white">
            <p className="text-sm font-black">Selected project</p>
            <p className="mt-2 text-sm font-semibold text-white/70">
              {selectedProjectId === "all"
                ? "Showing assurance across every project."
                : projects.find((project) => project.id === selectedProjectId)?.name ?? "Project selected."}
            </p>
          </div>
        </aside>
      </section>
      <div className="mt-6">
        <ProjectActivityPanel title="Agreement activity" />
      </div>
    </DashboardShell>
  );
}
