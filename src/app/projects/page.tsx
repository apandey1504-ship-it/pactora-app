"use client";

import { Plus } from "lucide-react";
import { DataSourceBadge } from "@/components/DataSourceBadge";
import { DashboardShell } from "@/components/DashboardShell";
import { ProjectCard } from "@/components/ProjectCard";
import { EmptyState, ErrorState, LoadingState } from "@/components/ResourceState";
import { useProjects } from "@/hooks/use-projects";

export default function ProjectsPage() {
  const { data: projects, source, loading, error } = useProjects();

  return (
    <DashboardShell
      title="Projects"
      subtitle="All protected agreements, counterparties, values, due dates, and trust signals."
      action={<div className="flex flex-wrap items-center gap-3"><DataSourceBadge source={source} loading={loading} /><a href="/dashboard/client" className="inline-flex items-center gap-2 rounded-lg bg-purple px-4 py-3 text-sm font-black text-white"><Plus size={17} /> Create project</a></div>}
    >
      {error ? <div className="mb-6"><ErrorState message={`Supabase request failed: ${error}`} /></div> : null}
      {loading ? <LoadingState /> : null}
      {!loading && projects.length === 0 ? <EmptyState message="No projects found." /> : null}
      <div className="space-y-5">
        {projects.map((project) => <ProjectCard key={project.id} project={project} />)}
      </div>
    </DashboardShell>
  );
}
