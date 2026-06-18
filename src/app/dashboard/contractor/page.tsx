"use client";

import Link from "next/link";
import { Clock3, FileUp, GitPullRequest, MessageSquare, Send } from "lucide-react";
import { ChangeRequestCard } from "@/components/ChangeRequestCard";
import { DataSourceBadge } from "@/components/DataSourceBadge";
import { DashboardCard } from "@/components/DashboardCard";
import { DashboardShell } from "@/components/DashboardShell";
import { MilestoneTable } from "@/components/MilestoneTable";
import { ProjectActivityPanel } from "@/components/ProjectActivityPanel";
import { ErrorState } from "@/components/ResourceState";
import { useChangeRequests } from "@/hooks/use-change-requests";
import { useMilestones } from "@/hooks/use-milestones";
import { contractorRespondToChangeRequest, submitMilestone } from "@/services/pactoraService";

export default function ContractorDashboardPage() {
  const icons = [FileUp, Send, Clock3, MessageSquare];
  const { data: milestones, source: milestoneSource, loading, error, refetch: refetchMilestones } = useMilestones();
  const { data: changeRequests, refetch: refetchChanges } = useChangeRequests();
  const contractorStats = [
    { label: "Assigned milestones", value: String(milestones.length), delta: milestoneSource },
    { label: "Submitted work", value: String(milestones.filter((milestone) => milestone.status === "submitted").length), delta: "Awaiting client" },
    { label: "Extension requests", value: String(changeRequests.length), delta: "Change queue" },
    { label: "Messages", value: "Open", delta: "Project threads" }
  ];
  async function handleSubmitMilestone(id: string) {
    await submitMilestone(id);
    await refetchMilestones();
  }

  async function handleAcceptChange(id: string) {
    await contractorRespondToChangeRequest(id, true);
    await refetchChanges();
  }

  return (
    <DashboardShell
      title="Contractor dashboard"
      subtitle="Accept projects, submit work, request timeline changes, and keep clients aligned."
      allowedRoles={["contractor"]}
      action={<><DataSourceBadge source={milestoneSource} loading={loading} /><button className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-purple px-4 py-3 text-sm font-black text-white sm:w-auto"><FileUp size={17} /> Submit work</button></>}
    >
      {error ? <div className="mb-6"><ErrorState message={`Supabase request failed: ${error}`} /></div> : null}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {contractorStats.map((stat, index) => (
          <DashboardCard key={stat.label} {...stat} icon={icons[index]} />
        ))}
      </div>
      <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section>
          <div className="mb-4 grid gap-3 sm:grid-cols-2 xl:flex xl:flex-wrap">
            <Link href="/projects" className="rounded-lg bg-white px-4 py-2.5 text-center text-sm font-black text-navy ring-1 ring-slate-200">Accept project</Link>
            <Link href="/milestones" className="rounded-lg bg-white px-4 py-2.5 text-center text-sm font-black text-navy ring-1 ring-slate-200">Submit milestone work</Link>
            <Link href="/change-requests" className="rounded-lg bg-white px-4 py-2.5 text-center text-sm font-black text-navy ring-1 ring-slate-200">Request timeline extension</Link>
            <Link href="/messages" className="rounded-lg bg-white px-4 py-2.5 text-center text-sm font-black text-navy ring-1 ring-slate-200">Message client</Link>
          </div>
          <MilestoneTable milestones={milestones} onSubmit={handleSubmitMilestone} />
        </section>
        <section className="space-y-5">
          <div className="flex items-center gap-2 text-lg font-black text-navy">
            <GitPullRequest size={20} />
            Change responses
          </div>
          {changeRequests.slice(0, 2).map((request) => (
            <ChangeRequestCard key={request.id} request={request} onContractorAccept={handleAcceptChange} />
          ))}
        </section>
      </div>
      <div className="mt-6">
        <ProjectActivityPanel title="Work activity" />
      </div>
    </DashboardShell>
  );
}
