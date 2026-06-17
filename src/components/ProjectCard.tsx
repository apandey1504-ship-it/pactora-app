import Link from "next/link";
import { Project } from "@/types";
import { StatusBadge } from "./StatusBadge";
import { TrustScoreBadge } from "./TrustScoreBadge";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href={`/projects/${project.id}`} className="text-lg font-black text-navy hover:text-purple">
            {project.name}
          </Link>
          <p className="mt-1 text-sm font-medium text-slate-500">
            {project.company} with {project.counterparty}
          </p>
        </div>
        <StatusBadge status={project.status} />
      </div>
      <div className="mt-5 h-2 rounded-full bg-slate-100">
        <div className="h-2 rounded-full bg-purple" style={{ width: `${project.progress}%` }} />
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Value</p>
          <p className="mt-1 font-black text-navy">{project.value}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Due</p>
          <p className="mt-1 font-black text-navy">{project.dueDate}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Trust</p>
          <div className="mt-1">
            <TrustScoreBadge score={project.trustScore} />
          </div>
        </div>
      </div>
    </article>
  );
}
