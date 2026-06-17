"use client";

import Link from "next/link";
import { FileText, GitPullRequest, ShieldCheck, Stamp } from "lucide-react";
import { DashboardCard } from "@/components/DashboardCard";
import { DashboardShell } from "@/components/DashboardShell";
import { DocumentUploadPanel } from "@/components/DocumentUploadPanel";
import { EmptyState } from "@/components/ResourceState";
import { StatusBadge } from "@/components/StatusBadge";
import { useAuth } from "@/hooks/use-auth";
import { useDocuments } from "@/hooks/use-documents";
import { useProjects } from "@/hooks/use-projects";

const contractStages = [
  { title: "Scope baseline", detail: "Signed scope, value, due date, and acceptance criteria." },
  { title: "Approval rules", detail: "Client and contractor decision points tied to milestones." },
  { title: "Change control", detail: "Cost, timeline, and approval impact captured before work shifts." }
];

export default function ContractsPage() {
  const { data: projects, source, loading } = useProjects();
  const uploadProjectId = projects[0]?.id;
  const { profile } = useAuth();
  const { data: documents, refetch: refetchDocuments } = useDocuments(uploadProjectId);
  const stats = [
    { label: "Contracts", value: String(projects.length), delta: source },
    { label: "Protected value", value: `$${(projects.reduce((total, project) => total + Number(project.value.replace(/[^0-9.-]+/g, "")), 0) / 1000000).toFixed(1)}M`, delta: "Tracked" },
    { label: "Change controls", value: "Live", delta: "Audit-ready" },
    { label: "Approvals", value: "Role based", delta: "Client + contractor" }
  ];

  return (
    <DashboardShell
      title="Contracts"
      subtitle="Review agreement baselines, approval rules, scope controls, and active contract risk."
      action={<Link href="/projects" className="rounded-lg bg-purple px-4 py-3 text-sm font-black text-white">View projects</Link>}
    >
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => (
          <DashboardCard key={stat.label} {...stat} icon={[FileText, ShieldCheck, GitPullRequest, Stamp][index]} />
        ))}
      </div>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft">
          <div className="border-b border-slate-100 p-5">
            <h2 className="text-lg font-black text-navy">Active contract registry</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {loading ? <p className="p-5 text-sm font-bold text-slate-500">Loading contracts...</p> : null}
            {!loading && projects.length === 0 ? <div className="p-5"><EmptyState message="No contract-backed projects yet." /></div> : null}
            {projects.map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`} className="grid gap-4 p-5 transition hover:bg-cloud md:grid-cols-[1fr_150px_140px] md:items-center">
                <div>
                  <p className="font-black text-navy">{project.name}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-500">{project.company} · {project.counterparty}</p>
                </div>
                <p className="text-sm font-black text-navy">{project.value}</p>
                <StatusBadge status={project.status} />
              </Link>
            ))}
          </div>
        </div>

        <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
          <h2 className="text-lg font-black text-navy">Contract controls</h2>
          <div className="mt-5 space-y-3">
            {contractStages.map((stage) => (
              <div key={stage.title} className="rounded-lg bg-cloud p-4">
                <p className="font-black text-navy">{stage.title}</p>
                <p className="mt-1 text-sm font-semibold leading-6 text-slate-500">{stage.detail}</p>
              </div>
            ))}
          </div>
        </aside>
      </section>
      {uploadProjectId ? (
        <section className="mt-6">
          <DocumentUploadPanel
            projectId={uploadProjectId}
            uploadedBy={profile?.id}
            documents={documents}
            onUploaded={refetchDocuments}
          />
        </section>
      ) : null}
    </DashboardShell>
  );
}
