"use client";

import { useEffect, useState } from "react";
import { Activity, Building2, FolderKanban, PauseCircle, ShieldAlert, Users } from "lucide-react";
import { AuditTimeline } from "@/components/AuditTimeline";
import { DataSourceBadge } from "@/components/DataSourceBadge";
import { DashboardCard } from "@/components/DashboardCard";
import { DashboardShell } from "@/components/DashboardShell";
import { EmptyState, ErrorState, LoadingState } from "@/components/ResourceState";
import { StatusBadge } from "@/components/StatusBadge";
import { useAllCompanies, useAllDisputes, useAllUsers, useStaffAccessGrants } from "@/hooks/use-admin";
import { useProjects } from "@/hooks/use-projects";
import { normalizeStatus } from "@/lib/format";
import {
  getAuditLogs,
  updateCompanyVerificationStatus,
  updateDisputeStatus,
  updateProjectStatus,
  upsertStaffAccessGrant,
  type AuditLogRow
} from "@/services/pactoraService";

export default function AdminDashboardPage() {
  const icons = [Users, FolderKanban, ShieldAlert, Building2];
  const { data: projects, source, loading, error, refetch: refetchProjects } = useProjects();
  const { data: users, loading: usersLoading, error: usersError } = useAllUsers();
  const { data: disputes, loading: disputesLoading, error: disputesError, refetch: refetchDisputes } = useAllDisputes();
  const { data: companies, loading: companiesLoading, error: companiesError, refetch: refetchCompanies } = useAllCompanies();
  const { data: staffGrants, loading: staffGrantsLoading, error: staffGrantsError, refetch: refetchStaffGrants } = useStaffAccessGrants();
  const [adminError, setAdminError] = useState<string | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLogRow[]>([]);
  const [auditError, setAuditError] = useState<string | null>(null);
  const [accessUserId, setAccessUserId] = useState("");
  const [accessLevel, setAccessLevel] = useState("operations");
  const [accessPermissions, setAccessPermissions] = useState({
    can_view_all_data: true,
    can_manage_projects: true,
    can_manage_payments: false,
    can_review_disputes: true,
    can_verify_companies: false,
    can_export_worksheets: false
  });
  const fundedVolume = projects.reduce((total, project) => total + Number(project.value.replace(/[^0-9.-]+/g, "")), 0);
  const estimatedPlatformFees = Math.round(fundedVolume * 0.03);
  const estimatedMrr = Math.max(companies.length - 1, 0) * 49;
  const paidPlans = Math.max(companies.length - 1, 0);
  const adminStats = [
    { label: "Users", value: String(users.length), delta: source },
    { label: "Projects", value: String(projects.length), delta: source },
    { label: "Disputes", value: String(disputes.length), delta: disputes.length ? "Needs review" : "Clear" },
    { label: "Verifications", value: String(companies.filter((company) => company.verification_status === "verified").length), delta: "Verified" }
  ];

  async function handleDisputeStatus(id: string, status: "resolved" | "rejected" | "under_review") {
    setAdminError(null);

    try {
      await updateDisputeStatus(id, status);
      await refetchDisputes();
      await loadAuditLogs();
    } catch (error) {
      setAdminError(error instanceof Error ? error.message : "Dispute update failed.");
    }
  }

  async function handleProjectStatus(id: string, status: "paused" | "active") {
    setAdminError(null);

    try {
      await updateProjectStatus(id, status);
      await refetchProjects();
      await loadAuditLogs();
    } catch (error) {
      setAdminError(error instanceof Error ? error.message : "Project update failed.");
    }
  }

  async function handleCompanyVerification(id: string, status: "verified" | "rejected" | "pending" | "unverified") {
    setAdminError(null);

    try {
      await updateCompanyVerificationStatus(id, status);
      await refetchCompanies();
      await loadAuditLogs();
    } catch (error) {
      setAdminError(error instanceof Error ? error.message : "Company verification update failed.");
    }
  }

  async function handleStaffAccessSubmit() {
    if (!accessUserId) {
      setAdminError("Choose a staff user before saving access.");
      return;
    }

    setAdminError(null);

    try {
      await upsertStaffAccessGrant({
        user_id: accessUserId,
        access_level: accessLevel,
        ...accessPermissions
      });
      await refetchStaffGrants();
      await loadAuditLogs();
    } catch (error) {
      setAdminError(error instanceof Error ? error.message : "Staff access update failed.");
    }
  }

  async function loadAuditLogs() {
    try {
      const result = await getAuditLogs();
      setAuditLogs(result.data);
      setAuditError(null);
    } catch (error) {
      setAuditError(error instanceof Error ? error.message : "Audit logs could not be loaded.");
    }
  }

  useEffect(() => {
    void loadAuditLogs();
  }, []);

  return (
    <DashboardShell
      title="Admin dashboard"
      subtitle="Review platform health, disputes, business verification, and project controls."
      allowedRoles={["admin"]}
      action={<><DataSourceBadge source={source} loading={loading} /><button className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-navy px-4 py-3 text-sm font-black text-white sm:w-auto"><PauseCircle size={17} /> Freeze project</button></>}
    >
      {error ? <div className="mb-6"><ErrorState message={`Projects request failed: ${error}`} /></div> : null}
      {usersError ? <div className="mb-6"><ErrorState message={`Users request failed: ${usersError}`} /></div> : null}
      {disputesError ? <div className="mb-6"><ErrorState message={`Disputes request failed: ${disputesError}`} /></div> : null}
      {companiesError ? <div className="mb-6"><ErrorState message={`Companies request failed: ${companiesError}`} /></div> : null}
      {staffGrantsError ? <div className="mb-6"><ErrorState message={`Staff access request failed: ${staffGrantsError}`} /></div> : null}
      {adminError ? <div className="mb-6"><ErrorState message={adminError} /></div> : null}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {adminStats.map((stat, index) => (
          <DashboardCard key={stat.label} {...stat} icon={icons[index]} />
        ))}
      </div>
      <section className="mt-8 rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-purple">Estimated / Demo Data</p>
          <h2 className="mt-2 text-lg font-black text-navy">Revenue model</h2>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          {[
            { label: "Monthly recurring revenue", value: `$${estimatedMrr.toLocaleString()}` },
            { label: "Funded milestone volume", value: `$${fundedVolume.toLocaleString()}` },
            { label: "Estimated platform fees", value: `$${estimatedPlatformFees.toLocaleString()}` },
            { label: "Active paid plans", value: String(paidPlans) },
            { label: "Verification revenue", value: "$0" },
            { label: "Dispute fees", value: "$0" }
          ].map((item) => (
            <div key={item.label} className="rounded-lg bg-cloud p-4">
              <p className="text-xs font-black uppercase tracking-wide text-slate-500">{item.label}</p>
              <p className="mt-2 text-2xl font-black text-navy">{item.value}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm font-semibold leading-6 text-slate-500">
          Future revenue streams include monthly subscriptions, platform transaction fees, business verification fees, dispute documentation/review fees, insurance partner commission, trust-score subscriptions, trade assurance fees, and invoice financing referral revenue.
        </p>
      </section>
      <section className="mt-8 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft">
        <div className="border-b border-slate-100 p-5">
          <h2 className="text-lg font-black text-navy">Admin review queue</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {loading ? <div className="p-5"><LoadingState /></div> : null}
          {!loading && projects.length === 0 ? <div className="p-5"><EmptyState message="No projects found." /></div> : null}
          {projects.map((project) => (
            <div key={project.id} className="grid gap-4 p-5 md:grid-cols-[1fr_160px_160px_140px] md:items-center">
              <div>
                <p className="font-black text-navy">{project.name}</p>
                <p className="text-sm font-semibold text-slate-500">{project.company} and {project.counterparty}</p>
              </div>
              <p className="text-sm font-black text-navy">{project.value}</p>
              <StatusBadge status={project.status} />
              <div className="flex flex-wrap gap-2">
                <button onClick={() => handleProjectStatus(project.id, "paused")} className="rounded-lg bg-cloud px-4 py-2.5 text-sm font-black text-navy">Freeze</button>
                <button onClick={() => handleProjectStatus(project.id, "active")} className="rounded-lg bg-emerald px-4 py-2.5 text-sm font-black text-white">Unfreeze</button>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="mt-6 grid gap-6 xl:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
          <h2 className="text-lg font-black text-navy">Users</h2>
          {usersLoading ? <div className="mt-4"><LoadingState /></div> : null}
          {!usersLoading && users.length === 0 ? <div className="mt-4"><EmptyState message="No users found." /></div> : null}
          <div className="mt-4 space-y-3">
            {users.map((user) => (
              <div key={user.id} className="rounded-lg bg-cloud p-4">
                <p className="font-black text-navy">{user.full_name ?? user.email}</p>
                <p className="text-sm font-semibold text-slate-500">{user.role} · {user.kyc_status}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
          <h2 className="text-lg font-black text-navy">Company verification</h2>
          {companiesLoading ? <div className="mt-4"><LoadingState /></div> : null}
          {!companiesLoading && companies.length === 0 ? <div className="mt-4"><EmptyState message="No companies found." /></div> : null}
          <div className="mt-4 space-y-3">
            {companies.map((company) => (
              <div key={company.id} className="rounded-lg bg-cloud p-4">
                <p className="font-black text-navy">{company.name}</p>
                <p className="text-sm font-semibold text-slate-500">{company.business_type ?? "Business"} · {company.verification_status}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button onClick={() => handleCompanyVerification(company.id, "pending")} className="rounded-lg bg-white px-3 py-2 text-xs font-black text-navy ring-1 ring-slate-200">Pending</button>
                  <button onClick={() => handleCompanyVerification(company.id, "verified")} className="rounded-lg bg-emerald px-3 py-2 text-xs font-black text-white">Verify</button>
                  <button onClick={() => handleCompanyVerification(company.id, "rejected")} className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-black text-rose-700">Reject</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
          <h2 className="text-lg font-black text-navy">Disputes</h2>
          {disputesLoading ? <div className="mt-4"><LoadingState /></div> : null}
          {!disputesLoading && disputes.length === 0 ? <div className="mt-4"><EmptyState message="No disputes found." /></div> : null}
          <div className="mt-4 space-y-3">
            {disputes.map((dispute) => (
              <div key={dispute.id} className="rounded-lg bg-cloud p-4">
                <p className="font-black text-navy">{dispute.reason}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <StatusBadge status={normalizeStatus(dispute.status)} />
                  <p className="text-sm font-semibold text-slate-500">{new Date(dispute.created_at).toLocaleDateString()}</p>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button onClick={() => handleDisputeStatus(dispute.id, "under_review")} className="rounded-lg bg-purple px-3 py-2 text-xs font-black text-white">Review</button>
                  <button onClick={() => handleDisputeStatus(dispute.id, "resolved")} className="rounded-lg bg-emerald px-3 py-2 text-xs font-black text-white">Resolve</button>
                  <button onClick={() => handleDisputeStatus(dispute.id, "rejected")} className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-black text-rose-700">Reject</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-purple">Pactora staff only</p>
            <h2 className="mt-1 text-lg font-black text-navy">User access delegation</h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              Delegate internal staff access for data review, dispute operations, payments, verification, and worksheet exports.
            </p>
          </div>
          <button onClick={handleStaffAccessSubmit} className="rounded-lg bg-navy px-4 py-3 text-sm font-black text-white">
            Save access
          </button>
        </div>
        <div className="mt-5 grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-lg bg-cloud p-4">
            <label className="block">
              <span className="text-xs font-black uppercase tracking-wide text-slate-500">Staff user</span>
              <select
                value={accessUserId}
                onChange={(event) => setAccessUserId(event.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-black text-navy outline-none focus:border-purple focus:ring-4 focus:ring-purple/10"
              >
                <option value="">Choose user</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.full_name ?? user.email} · {user.role}
                  </option>
                ))}
              </select>
            </label>
            <label className="mt-4 block">
              <span className="text-xs font-black uppercase tracking-wide text-slate-500">Access level</span>
              <select
                value={accessLevel}
                onChange={(event) => setAccessLevel(event.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-black text-navy outline-none focus:border-purple focus:ring-4 focus:ring-purple/10"
              >
                <option value="viewer">Viewer</option>
                <option value="operations">Operations</option>
                <option value="finance">Finance</option>
                <option value="verification">Verification</option>
                <option value="super_admin">Super admin</option>
              </select>
            </label>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {[
                ["can_view_all_data", "All data"],
                ["can_manage_projects", "Project controls"],
                ["can_manage_payments", "Payments"],
                ["can_review_disputes", "Disputes"],
                ["can_verify_companies", "Verification"],
                ["can_export_worksheets", "Worksheet export"]
              ].map(([key, label]) => (
                <label key={key} className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-black text-navy ring-1 ring-slate-200">
                  <input
                    type="checkbox"
                    checked={accessPermissions[key as keyof typeof accessPermissions]}
                    onChange={(event) =>
                      setAccessPermissions((current) => ({
                        ...current,
                        [key]: event.target.checked
                      }))
                    }
                    className="h-4 w-4 accent-purple"
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>
          <div className="rounded-lg bg-cloud p-4">
            <h3 className="text-sm font-black uppercase tracking-wide text-slate-500">Current staff access</h3>
            {staffGrantsLoading ? <div className="mt-4"><LoadingState /></div> : null}
            {!staffGrantsLoading && staffGrants.length === 0 ? <div className="mt-4"><EmptyState message="No delegated staff access yet." /></div> : null}
            <div className="mt-4 grid gap-3">
              {staffGrants.map((grant) => {
                const user = users.find((item) => item.id === grant.user_id);
                const permissions = [
                  grant.can_view_all_data ? "All data" : null,
                  grant.can_manage_projects ? "Projects" : null,
                  grant.can_manage_payments ? "Payments" : null,
                  grant.can_review_disputes ? "Disputes" : null,
                  grant.can_verify_companies ? "Verification" : null,
                  grant.can_export_worksheets ? "Worksheet export" : null
                ].filter(Boolean);

                return (
                  <div key={grant.id} className="rounded-lg bg-white p-4 ring-1 ring-slate-200">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-black text-navy">{user?.full_name ?? user?.email ?? `User ${grant.user_id.slice(0, 8)}`}</p>
                      <span className="rounded-full bg-purple/10 px-3 py-1 text-xs font-black uppercase tracking-wide text-purple">{grant.access_level}</span>
                    </div>
                    <p className="mt-2 text-sm font-semibold text-slate-500">{permissions.join(" · ") || "No permissions enabled"}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
      <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        <div className="flex items-center gap-2">
          <Activity size={20} className="text-purple" />
          <h2 className="text-lg font-black text-navy">Audit log</h2>
        </div>
        {auditError ? <div className="mt-4"><ErrorState message={`Audit log request failed: ${auditError}`} /></div> : null}
        {!auditError && auditLogs.length === 0 ? <div className="mt-4"><EmptyState message="No audit events yet." /></div> : null}
        <div className="mt-4"><AuditTimeline logs={auditLogs} /></div>
      </section>
    </DashboardShell>
  );
}
