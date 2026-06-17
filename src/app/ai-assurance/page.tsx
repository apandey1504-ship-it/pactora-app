"use client";

import { AlertTriangle, CheckCircle2, GitCompareArrows, Sparkles } from "lucide-react";
import { DashboardCard } from "@/components/DashboardCard";
import { DashboardShell } from "@/components/DashboardShell";
import { MilestoneOverview } from "@/components/MilestoneOverview";
import { useMilestones } from "@/hooks/use-milestones";
import { useProjects } from "@/hooks/use-projects";
import { useState } from "react";

export default function AiAssurancePage() {
  const { data: projects } = useProjects();
  const { data: milestones } = useMilestones();
  const [selectedProjectId, setSelectedProjectId] = useState("all");
  const selectedMilestones = selectedProjectId === "all" ? milestones : milestones.filter((milestone) => milestone.projectId === selectedProjectId);
  const pending = selectedMilestones.filter((milestone) => milestone.status === "pending" || milestone.status === "in_review");
  const approved = selectedMilestones.filter((milestone) => milestone.status === "approved" || milestone.status === "paid");
  const issueCount = pending.length + (projects.length === 0 ? 1 : 0);
  const confidence = selectedMilestones.length ? Math.round((approved.length / selectedMilestones.length) * 100) : 0;
  const insights = [
    projects.length === 0 ? "No active project exists yet. Create a project before AI assurance can compare contract scope against progress." : "Project registry is available for AI review.",
    pending.length ? `${pending.length} milestone decision${pending.length === 1 ? "" : "s"} still need evidence or approval.` : "No pending milestone blockers detected.",
    "Contract, insurance, category, milestone, and message data are structured for a future AI model integration."
  ];

  return (
    <DashboardShell
      title="AI Assurance"
      subtitle="Cross-check progress, contract risk, issues, milestone evidence, and trust signals."
    >
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Review confidence", value: `${confidence}%`, delta: "Milestone based" },
          { label: "Open issues", value: String(issueCount), delta: issueCount ? "Needs review" : "Clear" },
          { label: "Scope checks", value: "Ready", delta: "Contract-aware" },
          { label: "AI mode", value: "Placeholder", delta: "No paid API yet" }
        ].map((stat, index) => (
          <DashboardCard key={stat.label} {...stat} icon={[Sparkles, AlertTriangle, GitCompareArrows, CheckCircle2][index]} />
        ))}
      </div>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <MilestoneOverview
          milestones={milestones}
          projects={projects}
          selectedProjectId={selectedProjectId}
          onSelectProject={setSelectedProjectId}
        />
        <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
          <h2 className="text-lg font-black text-navy">AI issue scan</h2>
          <div className="mt-5 space-y-3">
            {insights.map((insight) => (
              <div key={insight} className="rounded-lg bg-cloud p-4 text-sm font-bold leading-6 text-slate-600">
                {insight}
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-lg bg-navy p-4 text-white">
            <p className="text-sm font-black">Future AI integration</p>
            <p className="mt-2 text-sm font-semibold leading-6 text-white/70">
              This page is ready for an AI service to compare contract scope, milestone evidence, messages, changes, disputes, and payment status.
            </p>
          </div>
        </aside>
      </section>
    </DashboardShell>
  );
}
