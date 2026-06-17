import type { RealtimeChannel } from "@supabase/supabase-js";
import { formatCurrency, formatDate, formatTime, normalizeStatus } from "@/lib/format";
import { mockUser } from "@/lib/mock-data";
import { supabase } from "@/lib/supabase";
import type { ChangeRequest, Message, Milestone, Project, ProjectDocument, ServiceResult, TrustScore } from "@/types";
import type { Database, DisputeStatus, MilestoneStatus, ProjectStatus } from "@/types/database";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Company = Database["public"]["Tables"]["companies"]["Row"];
export type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];
export type ProjectInsert = Database["public"]["Tables"]["projects"]["Insert"];
export type MilestoneRow = Database["public"]["Tables"]["milestones"]["Row"];
export type MilestoneInsert = Database["public"]["Tables"]["milestones"]["Insert"];
export type ChangeRequestRow = Database["public"]["Tables"]["change_requests"]["Row"];
export type ChangeRequestInsert = Database["public"]["Tables"]["change_requests"]["Insert"];
export type MessageRow = Database["public"]["Tables"]["messages"]["Row"];
export type MessageInsert = Database["public"]["Tables"]["messages"]["Insert"];
export type DocumentRow = Database["public"]["Tables"]["documents"]["Row"];
export type DocumentInsert = Database["public"]["Tables"]["documents"]["Insert"];
export type Payment = Database["public"]["Tables"]["payments"]["Row"];
export type Dispute = Database["public"]["Tables"]["disputes"]["Row"];
export type DisputeInsert = Database["public"]["Tables"]["disputes"]["Insert"];
export type TrustScoreRow = Database["public"]["Tables"]["trust_scores"]["Row"];
export type AuditLogRow = Database["public"]["Tables"]["audit_logs"]["Row"];
export type AuditLogInsert = Database["public"]["Tables"]["audit_logs"]["Insert"];

function requireSupabase() {
  if (!supabase) {
    return null;
  }

  return supabase;
}

function mapProject(row: ProjectRow, trustScore = 86): Project {
  return {
    id: row.id,
    name: row.title,
    company: `Company ${row.client_company_id.slice(0, 8)}`,
    counterparty: row.contractor_company_id ? `Company ${row.contractor_company_id.slice(0, 8)}` : "Unassigned contractor",
    value: formatCurrency(row.project_value),
    progress: row.status === "completed" ? 100 : row.status === "active" ? 64 : 24,
    status: normalizeStatus(row.status),
    dueDate: formatDate(row.due_date),
    trustScore
  };
}

function mapMilestone(row: MilestoneRow): Milestone {
  return {
    id: row.id,
    projectId: row.project_id,
    title: row.title,
    owner: row.submitted_at ? "Contractor" : "Client",
    amount: formatCurrency(row.amount),
    dueDate: formatDate(row.due_date),
    status: normalizeStatus(row.status)
  };
}

function mapChangeRequest(row: ChangeRequestRow): ChangeRequest {
  const cost = row.impact_cost
    ? formatCurrency(row.impact_cost)
    : "No cost change";

  return {
    id: row.id,
    projectId: row.project_id,
    milestoneId: row.milestone_id,
    title: row.title,
    requester: `User ${row.requested_by.slice(0, 8)}`,
    impact: `${cost} and ${row.impact_days} day${row.impact_days === 1 ? "" : "s"}`,
    impactCost: row.impact_cost,
    impactDays: row.impact_days,
    status: normalizeStatus(row.status),
    summary: row.description ?? "No summary provided."
  };
}

function mapMessage(row: MessageRow, sender?: Pick<Profile, "full_name" | "role"> | null): Message {
  return {
    id: row.id,
    author: sender?.full_name ?? `User ${row.sender_id.slice(0, 8)}`,
    role: sender?.role ?? "client",
    body: row.message,
    time: formatTime(row.created_at)
  };
}

function mapDocument(row: DocumentRow): ProjectDocument {
  return {
    id: row.id,
    projectId: row.project_id,
    name: row.file_name,
    fileUrl: row.file_url,
    category: row.file_type ?? "Document",
    createdAt: formatDate(row.created_at)
  };
}

function mapTrustScore(row: TrustScoreRow): TrustScore {
  return {
    id: row.id,
    companyId: row.company_id,
    score: row.score,
    signal: {
      completion_rate: row.completion_rate,
      on_time_rate: row.on_time_rate,
      dispute_rate: row.dispute_rate,
      payment_reliability: row.payment_reliability
    },
    createdAt: row.created_at
  };
}

function throwIfError(error: { message: string } | null) {
  if (error) {
    throw new Error(error.message);
  }
}

function ensureData<T>(data: T | null, message = "Supabase did not return a record."): T {
  if (!data) {
    throw new Error(message);
  }

  return data;
}

async function getAuthenticatedUserId() {
  const client = requireSupabase();

  if (!client) {
    return mockUser.id;
  }

  const { data, error } = await client.auth.getUser();
  throwIfError(error);

  return data.user?.id ?? mockUser.id;
}

async function writeAuditLog(input: AuditLogInsert) {
  const client = requireSupabase();

  if (!client) {
    return;
  }

  await client.from("audit_logs").insert([
    {
      ...input,
      metadata: input.metadata ?? {}
    }
  ]);
}

async function getProjectNotificationRecipients(projectId: string, excludeUserId?: string) {
  const client = requireSupabase();

  if (!client) {
    return [];
  }

  const { data: participants } = await client
    .from("project_participants")
    .select("user_id")
    .eq("project_id", projectId);
  const userIds = (participants ?? [])
    .map((participant) => participant.user_id)
    .filter((userId) => userId && userId !== excludeUserId);

  if (!userIds.length) {
    return [];
  }

  const { data: profiles } = await client
    .from("profiles")
    .select("id, email, full_name")
    .in("id", userIds);

  return (profiles ?? []).filter((profile) => Boolean(profile.email));
}

async function getAdminNotificationRecipients() {
  const client = requireSupabase();

  if (!client) {
    return [];
  }

  const { data } = await client
    .from("profiles")
    .select("id, email, full_name")
    .eq("role", "admin");

  return (data ?? []).filter((profile) => Boolean(profile.email));
}

async function notifyUsers(input: {
  userIds?: string[];
  projectId?: string | null;
  title: string;
  body: string;
}) {
  const client = requireSupabase();

  if (!client || !input.userIds?.length) {
    return;
  }

  await client.from("notifications").insert(
    input.userIds.map((userId) => ({
      user_id: userId,
      title: input.title,
      body: input.body
    }))
  );
}

async function sendWorkflowEmail(input: {
  to?: string[];
  subject: string;
  title: string;
  body: string;
  cta?: string;
}) {
  const recipients = (input.to ?? []).filter(Boolean);

  if (!recipients.length || typeof window === "undefined") {
    return;
  }

  await fetch("/api/notifications/email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      to: recipients,
      subject: input.subject,
      html: `
        <div style="font-family:Inter,Arial,sans-serif;line-height:1.6;color:#081A33">
          <p style="font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#635BFF">Pactora private beta</p>
          <h1 style="font-size:24px;margin:0 0 12px">${input.title}</h1>
          <p>${input.body}</p>
          ${input.cta ? `<p><a href="${input.cta}" style="display:inline-block;background:#635BFF;color:white;padding:12px 16px;border-radius:8px;text-decoration:none;font-weight:800">Open Pactora</a></p>` : ""}
        </div>
      `
    })
  }).catch(() => undefined);
}

function getAppOrigin() {
  return typeof window === "undefined" ? "" : window.location.origin;
}

export async function getCurrentProfile(): Promise<ServiceResult<Profile | null>> {
  const client = requireSupabase();

  if (!client) {
    return { data: null, source: "mock" };
  }

  const { data: authData, error: authError } = await client.auth.getUser();
  throwIfError(authError);

  const userId = authData.user?.id ?? mockUser.id;
  const { data, error } = await client.from("profiles").select("*").eq("id", userId).maybeSingle();
  throwIfError(error);

  return { data, source: "supabase" };
}

export function getDashboardPathForRole(role: Profile["role"]) {
  if (role === "admin") {
    return "/admin";
  }

  if (role === "contractor") {
    return "/dashboard/contractor";
  }

  return "/dashboard/client";
}

export async function createProject(input: {
  title: string;
  description?: string;
  projectValue?: number;
  dueDate?: string;
  clientCompanyId?: string;
  contractorCompanyId?: string | null;
  createdBy?: string;
}): Promise<ServiceResult<Project | null>> {
  const client = requireSupabase();

  if (!client) {
    return { data: null, source: "mock" };
  }

  const createdBy = input.createdBy ?? mockUser.id;
  const clientCompanyId = input.clientCompanyId ?? await getPrimaryCompanyId(createdBy);
  const projectId = crypto.randomUUID();
  const payload: ProjectInsert = {
    id: projectId,
    title: input.title,
    description: input.description ?? null,
    project_value: input.projectValue ?? 0,
    currency: "USD",
    status: "draft",
    due_date: input.dueDate || null,
    client_company_id: clientCompanyId,
    contractor_company_id: input.contractorCompanyId ?? null,
    created_by: createdBy
  };
  const { error } = await client.from("projects").insert([payload]);
  throwIfError(error);

  const { error: participantError } = await client.from("project_participants").insert([
    {
      project_id: projectId,
      user_id: createdBy,
      role: "client"
    }
  ]);
  throwIfError(participantError);

  await writeAuditLog({
    user_id: createdBy,
    project_id: projectId,
    action: "project.created",
    metadata: {
      title: input.title,
      project_value: payload.project_value,
      due_date: payload.due_date
    }
  });
  await sendWorkflowEmail({
    to: (await getProjectNotificationRecipients(projectId, createdBy)).map((profile) => profile.email),
    subject: `Pactora project created: ${input.title}`,
    title: "New protected project created",
    body: `${input.title} is now tracked in Pactora with audit logs, milestones, documents, and approvals.`,
    cta: `${getAppOrigin()}/projects/${projectId}`
  });

  return { data: mapProject(payload as ProjectRow), source: "supabase" };
}

export async function sendProjectInvite(input: {
  projectId: string;
  contractorEmail: string;
  invitedBy: string;
}): Promise<ServiceResult<boolean>> {
  const client = requireSupabase();

  if (!client) {
    return { data: false, source: "mock" };
  }

  const { data: project, error } = await client
    .from("projects")
    .select("title")
    .eq("id", input.projectId)
    .maybeSingle();
  throwIfError(error);

  await writeAuditLog({
    user_id: input.invitedBy,
    project_id: input.projectId,
    action: "project.invite_sent",
    metadata: { contractor_email: input.contractorEmail }
  });

  await sendWorkflowEmail({
    to: [input.contractorEmail],
    subject: `You were invited to Pactora: ${project?.title ?? "Protected project"}`,
    title: "Project invite",
    body: "You have been invited to review and accept a protected agreement in Pactora.",
    cta: `${getAppOrigin()}/projects/${input.projectId}`
  });

  return { data: true, source: "supabase" };
}

export async function getProjects(): Promise<ServiceResult<Project[]>> {
  const client = requireSupabase();

  if (!client) {
    return { data: [], source: "mock" };
  }

  const { data, error } = await client.from("projects").select("*").order("created_at", { ascending: false });
  throwIfError(error);

  return { data: (data ?? []).map((project) => mapProject(project)), source: "supabase" };
}

export async function getAllProjects() {
  return getProjects();
}

export async function getProjectById(id: string): Promise<ServiceResult<Project | null>> {
  const client = requireSupabase();

  if (!client) {
    return { data: null, source: "mock" };
  }

  const { data, error } = await client.from("projects").select("*").eq("id", id).maybeSingle();
  throwIfError(error);

  return { data: data ? mapProject(data) : null, source: "supabase" };
}

export async function updateProjectStatus(id: string, status: ProjectStatus): Promise<ServiceResult<Project | null>> {
  const client = requireSupabase();

  if (!client) {
    return { data: null, source: "mock" };
  }

  const { data, error } = await client.from("projects").update({ status }).eq("id", id).select("*").single();
  throwIfError(error);
  await writeAuditLog({
    user_id: await getAuthenticatedUserId(),
    project_id: id,
    action: "project.status_updated",
    metadata: { status }
  });

  return { data: mapProject(ensureData(data)), source: "supabase" };
}

export async function acceptProject(projectId: string): Promise<ServiceResult<Project | null>> {
  const client = requireSupabase();

  if (!client) {
    return { data: null, source: "mock" };
  }

  const { data: authData, error: authError } = await client.auth.getUser();
  throwIfError(authError);

  const userId = authData.user?.id;
  if (!userId) {
    throw new Error("Login as a contractor before accepting a project.");
  }

  const contractorCompanyId = await getPrimaryCompanyId(userId);
  const { error: participantError } = await client.from("project_participants").insert([
    {
      project_id: projectId,
      user_id: userId,
      role: "contractor"
    }
  ]);
  if (participantError && participantError.code !== "23505") {
    throwIfError(participantError);
  }

  const { data, error } = await client
    .from("projects")
    .update({
      contractor_company_id: contractorCompanyId,
      status: "active"
    })
    .eq("id", projectId)
    .select("*")
    .single();
  throwIfError(error);
  await writeAuditLog({
    user_id: userId,
    project_id: projectId,
    action: "project.accepted",
    metadata: { contractor_company_id: contractorCompanyId }
  });

  return { data: mapProject(ensureData(data)), source: "supabase" };
}

export async function createMilestone(input: MilestoneInsert): Promise<ServiceResult<Milestone | null>> {
  const client = requireSupabase();

  if (!client) {
    return { data: null, source: "mock" };
  }

  const { data, error } = await client.from("milestones").insert([input]).select("*").single();
  throwIfError(error);
  await writeAuditLog({
    user_id: await getAuthenticatedUserId(),
    project_id: input.project_id,
    action: "milestone.created",
    metadata: {
      milestone_id: data?.id,
      title: input.title,
      amount: input.amount,
      due_date: input.due_date
    }
  });

  return { data: mapMilestone(ensureData(data)), source: "supabase" };
}

export async function getMilestonesByProject(projectId?: string): Promise<ServiceResult<Milestone[]>> {
  const client = requireSupabase();

  if (!client) {
    return { data: [], source: "mock" };
  }

  let query = client.from("milestones").select("*").order("due_date", { ascending: true });
  if (projectId) {
    query = query.eq("project_id", projectId);
  }
  const { data, error } = await query;
  throwIfError(error);

  return { data: (data ?? []).map(mapMilestone), source: "supabase" };
}

async function updateMilestoneStatus(id: string, status: MilestoneStatus) {
  const client = requireSupabase();

  if (!client) {
    return { data: null, source: "mock" as const };
  }

  const timestamps: Partial<MilestoneRow> = {};
  if (status === "submitted") timestamps.submitted_at = new Date().toISOString();
  if (status === "approved") timestamps.approved_at = new Date().toISOString();
  if (status === "paid") timestamps.paid_at = new Date().toISOString();

  const { data, error } = await client.from("milestones").update({ status, ...timestamps }).eq("id", id).select("*").single();
  throwIfError(error);
  const milestone = ensureData(data);
  await writeAuditLog({
    user_id: await getAuthenticatedUserId(),
    project_id: milestone.project_id,
    action: "milestone.status_updated",
    metadata: {
      milestone_id: id,
      status
    }
  });
  const recipients = await getProjectNotificationRecipients(milestone.project_id);
  const emailMap: Partial<Record<MilestoneStatus, { subject: string; title: string; body: string }>> = {
    submitted: {
      subject: `Milestone submitted: ${milestone.title}`,
      title: "Milestone submitted",
      body: `${milestone.title} has been submitted for client approval.`
    },
    approved: {
      subject: `Milestone approved: ${milestone.title}`,
      title: "Milestone approved",
      body: `${milestone.title} has been approved in Pactora.`
    },
    revision_requested: {
      subject: `Revision requested: ${milestone.title}`,
      title: "Milestone revision requested",
      body: `${milestone.title} needs revision before approval.`
    },
    disputed: {
      subject: `Milestone disputed: ${milestone.title}`,
      title: "Milestone disputed",
      body: `${milestone.title} has been marked disputed.`
    }
  };
  const email = emailMap[status];
  if (email) {
    await sendWorkflowEmail({
      to: recipients.map((profile) => profile.email),
      ...email,
      cta: `${getAppOrigin()}/projects/${milestone.project_id}`
    });
  }

  return { data: mapMilestone(milestone), source: "supabase" as const };
}

export function submitMilestone(id: string) {
  return updateMilestoneStatus(id, "submitted");
}

export function approveMilestone(id: string) {
  return updateMilestoneStatus(id, "approved");
}

export function requestRevision(id: string) {
  return updateMilestoneStatus(id, "revision_requested");
}

export async function createChangeRequest(input: ChangeRequestInsert): Promise<ServiceResult<ChangeRequest | null>> {
  const client = requireSupabase();

  if (!client) {
    return { data: null, source: "mock" };
  }

  const { data, error } = await client.from("change_requests").insert([input]).select("*").single();
  throwIfError(error);
  await writeAuditLog({
    user_id: input.requested_by,
    project_id: input.project_id,
    action: "change_request.created",
    metadata: {
      change_request_id: data?.id,
      title: input.title,
      impact_cost: input.impact_cost,
      impact_days: input.impact_days,
      status: input.status
    }
  });
  const recipients = await getProjectNotificationRecipients(input.project_id, input.requested_by);
  await notifyUsers({
    userIds: recipients.map((profile) => profile.id),
    title: "Change request created",
    body: input.title
  });
  await sendWorkflowEmail({
    to: recipients.map((profile) => profile.email),
    subject: `Change request created: ${input.title}`,
    title: "Change request created",
    body: `${input.title} was created with ${formatCurrency(input.impact_cost ?? 0)} cost impact and ${input.impact_days ?? 0} day impact.`,
    cta: `${getAppOrigin()}/change-requests`
  });

  return { data: mapChangeRequest(ensureData(data)), source: "supabase" };
}

export async function getChangeRequestsByProject(projectId?: string): Promise<ServiceResult<ChangeRequest[]>> {
  const client = requireSupabase();

  if (!client) {
    return { data: [], source: "mock" };
  }

  let query = client.from("change_requests").select("*").order("created_at", { ascending: false });
  if (projectId) {
    query = query.eq("project_id", projectId);
  }
  const { data, error } = await query;
  throwIfError(error);

  return { data: (data ?? []).map(mapChangeRequest), source: "supabase" };
}

export async function contractorRespondToChangeRequest(id: string, approved: boolean) {
  const status = approved ? "client_review" : "rejected";
  return updateChangeRequest(id, { approved_by_contractor: approved, status });
}

export async function approveChangeRequest(id: string) {
  const client = requireSupabase();

  if (!client) {
    return { data: null, source: "mock" as const };
  }

  const { data: request, error: requestError } = await client
    .from("change_requests")
    .select("*")
    .eq("id", id)
    .single();
  throwIfError(requestError);
  const changeRequest = ensureData(request);

  const { data: approvedRequest, error: approvalError } = await client
    .from("change_requests")
    .update({
      approved_by_client: true,
      status: "approved",
      approved_at: new Date().toISOString()
    })
    .eq("id", id)
    .select("*")
    .single();
  throwIfError(approvalError);

  if (changeRequest.impact_cost !== 0) {
    const { data: project, error: projectReadError } = await client
      .from("projects")
      .select("project_value")
      .eq("id", changeRequest.project_id)
      .single();
    throwIfError(projectReadError);

    const { error: projectUpdateError } = await client
      .from("projects")
      .update({ project_value: (project?.project_value ?? 0) + changeRequest.impact_cost })
      .eq("id", changeRequest.project_id);
    throwIfError(projectUpdateError);
  }

  if (changeRequest.milestone_id && changeRequest.impact_days !== 0) {
    const { data: milestone, error: milestoneReadError } = await client
      .from("milestones")
      .select("due_date")
      .eq("id", changeRequest.milestone_id)
      .single();
    throwIfError(milestoneReadError);

    if (milestone?.due_date) {
      const dueDate = new Date(milestone.due_date);
      dueDate.setDate(dueDate.getDate() + changeRequest.impact_days);
      const { error: milestoneUpdateError } = await client
        .from("milestones")
        .update({ due_date: dueDate.toISOString().slice(0, 10) })
        .eq("id", changeRequest.milestone_id);
      throwIfError(milestoneUpdateError);
    }
  }

  await writeAuditLog({
    user_id: await getAuthenticatedUserId(),
    project_id: changeRequest.project_id,
    action: "change_request.approved",
    metadata: {
      change_request_id: id,
      milestone_id: changeRequest.milestone_id,
      project_value_delta: changeRequest.impact_cost,
      milestone_due_date_delta_days: changeRequest.impact_days
    }
  });
  const recipients = await getProjectNotificationRecipients(changeRequest.project_id);
  await sendWorkflowEmail({
    to: recipients.map((profile) => profile.email),
    subject: `Change request approved: ${changeRequest.title}`,
    title: "Change request approved",
    body: `${changeRequest.title} was approved. Project value and linked milestone due date were updated where applicable.`,
    cta: `${getAppOrigin()}/change-requests`
  });

  return { data: mapChangeRequest(ensureData(approvedRequest)), source: "supabase" as const };
}

export async function rejectChangeRequest(id: string) {
  const result = await updateChangeRequest(id, { status: "rejected" });
  return result;
}

async function updateChangeRequest(id: string, patch: Database["public"]["Tables"]["change_requests"]["Update"]) {
  const client = requireSupabase();

  if (!client) {
    return { data: null, source: "mock" as const };
  }

  const { data, error } = await client.from("change_requests").update(patch).eq("id", id).select("*").single();
  throwIfError(error);
  const changeRequest = ensureData(data);
  await writeAuditLog({
    user_id: await getAuthenticatedUserId(),
    project_id: changeRequest.project_id,
    action: "change_request.updated",
    metadata: {
      change_request_id: id,
      patch
    }
  });
  if (patch.status === "rejected") {
    const recipients = await getProjectNotificationRecipients(changeRequest.project_id);
    await sendWorkflowEmail({
      to: recipients.map((profile) => profile.email),
      subject: `Change request rejected: ${changeRequest.title}`,
      title: "Change request rejected",
      body: `${changeRequest.title} was rejected in Pactora.`,
      cta: `${getAppOrigin()}/change-requests`
    });
  }

  return { data: mapChangeRequest(changeRequest), source: "supabase" as const };
}

async function getPrimaryCompanyId(userId: string) {
  const client = requireSupabase();

  if (!client) {
    return mockUser.companyId;
  }

  const { data, error } = await client
    .from("company_members")
    .select("company_id")
    .eq("user_id", userId)
    .limit(1)
    .maybeSingle();
  throwIfError(error);

  if (data?.company_id) {
    return data.company_id;
  }

  const { data: profile, error: profileError } = await client
    .from("profiles")
    .select("email, full_name, role")
    .eq("id", userId)
    .maybeSingle();
  throwIfError(profileError);

  const companyId = crypto.randomUUID();
  const companyName =
    profile?.full_name?.trim() ||
    (profile?.email ? `${profile.email.split("@")[0]} Workspace` : "Pactora Workspace");

  const { error: companyError } = await client.from("companies").insert([
    {
      id: companyId,
      name: companyName,
      legal_name: companyName,
      business_type: profile?.role === "contractor" ? "Contractor" : "Client",
      country: "US",
      verification_status: "unverified"
    }
  ]);
  throwIfError(companyError);

  const { error: memberError } = await client.from("company_members").insert([
    {
      company_id: companyId,
      user_id: userId,
      role: profile?.role ?? "client"
    }
  ]);
  throwIfError(memberError);

  return companyId;
}

export async function sendMessage(input: MessageInsert): Promise<ServiceResult<Message | null>> {
  const client = requireSupabase();

  if (!client) {
    return { data: null, source: "mock" };
  }

  const { data, error } = await client.from("messages").insert([input]).select("*").single();
  throwIfError(error);
  await writeAuditLog({
    user_id: input.sender_id,
    project_id: input.project_id,
    action: "message.sent",
    metadata: {
      message_id: data?.id,
      message_type: input.message_type,
      preview: input.message.slice(0, 120)
    }
  });
  const recipients = await getProjectNotificationRecipients(input.project_id, input.sender_id);
  await notifyUsers({
    userIds: recipients.map((profile) => profile.id),
    title: "New project message",
    body: input.message.slice(0, 120)
  });
  await sendWorkflowEmail({
    to: recipients.map((profile) => profile.email),
    subject: "New Pactora project message",
    title: "New message",
    body: input.message.slice(0, 240),
    cta: `${getAppOrigin()}/messages`
  });

  return { data: mapMessage(ensureData(data)), source: "supabase" };
}

export async function getMessagesByProject(projectId?: string): Promise<ServiceResult<Message[]>> {
  const client = requireSupabase();

  if (!client) {
    return { data: [], source: "mock" };
  }

  let query = client.from("messages").select("*").order("created_at", { ascending: true });
  if (projectId) {
    query = query.eq("project_id", projectId);
  }
  const { data, error } = await query;
  throwIfError(error);

  return { data: (data ?? []).map((message) => mapMessage(message)), source: "supabase" };
}

export function subscribeToProjectMessages(projectId: string, onMessage: (message: Message) => void): RealtimeChannel | null {
  const client = requireSupabase();

  if (!client) {
    return null;
  }

  return client
    .channel(`project-messages-${projectId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `project_id=eq.${projectId}`
      },
      (payload) => {
        onMessage(mapMessage(payload.new as MessageRow));
      }
    )
    .subscribe();
}

export async function uploadDocument(
  input:
    | DocumentInsert
    | {
        projectId: string;
        milestoneId?: string | null;
        uploadedBy: string;
        file: File;
        category?: string;
      }
): Promise<ServiceResult<ProjectDocument | null>> {
  const client = requireSupabase();

  if (!client) {
    return { data: null, source: "mock" };
  }

  let documentInput: DocumentInsert;

  if ("file" in input) {
    const path = `${input.projectId}/${crypto.randomUUID()}-${input.file.name}`;
    const upload = await client.storage.from("pactora-documents").upload(path, input.file);
    throwIfError(upload.error);
    const { data: publicUrlData } = client.storage.from("pactora-documents").getPublicUrl(path);
    documentInput = {
      project_id: input.projectId,
      milestone_id: input.milestoneId ?? null,
      uploaded_by: input.uploadedBy,
      file_name: input.file.name,
      file_url: publicUrlData.publicUrl,
      file_type: input.category ?? input.file.type ?? "Document"
    };
  } else {
    documentInput = input;
  }

  const { data, error } = await client.from("documents").insert([documentInput]).select("*").single();
  throwIfError(error);
  await writeAuditLog({
    user_id: documentInput.uploaded_by,
    project_id: documentInput.project_id,
    action: "document.uploaded",
    metadata: {
      document_id: data?.id,
      milestone_id: documentInput.milestone_id,
      file_name: documentInput.file_name,
      file_type: documentInput.file_type
    }
  });

  return { data: mapDocument(ensureData(data)), source: "supabase" };
}

export async function getDocumentsByProject(projectId?: string): Promise<ServiceResult<ProjectDocument[]>> {
  const client = requireSupabase();

  if (!client) {
    return { data: [], source: "mock" };
  }

  let query = client.from("documents").select("*").order("created_at", { ascending: false });
  if (projectId) {
    query = query.eq("project_id", projectId);
  }
  const { data, error } = await query;
  throwIfError(error);

  return { data: (data ?? []).map(mapDocument), source: "supabase" };
}

export async function getCompanyTrustScore(companyId = mockUser.companyId): Promise<ServiceResult<TrustScore | null>> {
  const client = requireSupabase();

  if (!client) {
    return { data: null, source: "mock" };
  }

  const { data, error } = await client.from("trust_scores").select("*").eq("company_id", companyId).maybeSingle();
  throwIfError(error);

  return { data: data ? mapTrustScore(data) : null, source: "supabase" };
}

export async function calculateTrustScorePlaceholder(companyId = mockUser.companyId) {
  const client = requireSupabase();

  if (!client) {
    return { data: null, source: "mock" as const };
  }

  const { data, error } = await client.rpc("calculate_basic_trust_score", { company_id: companyId });
  throwIfError(error);

  return { data, source: "supabase" as const };
}

export async function getAllUsers(): Promise<ServiceResult<Profile[]>> {
  const client = requireSupabase();

  if (!client) {
    return { data: [], source: "mock" };
  }

  const { data, error } = await client.from("profiles").select("*").order("created_at", { ascending: false });
  throwIfError(error);

  return { data: data ?? [], source: "supabase" };
}

export async function getAllCompanies(): Promise<ServiceResult<Company[]>> {
  const client = requireSupabase();

  if (!client) {
    return { data: [], source: "mock" };
  }

  const { data, error } = await client.from("companies").select("*").order("created_at", { ascending: false });
  throwIfError(error);

  return { data: data ?? [], source: "supabase" };
}

export async function updateCompanyVerificationStatus(
  id: string,
  verificationStatus: "unverified" | "pending" | "verified" | "rejected"
): Promise<ServiceResult<Company | null>> {
  const client = requireSupabase();

  if (!client) {
    return { data: null, source: "mock" };
  }

  const { data, error } = await client
    .from("companies")
    .update({ verification_status: verificationStatus })
    .eq("id", id)
    .select("*")
    .single();
  throwIfError(error);
  const company = ensureData(data);

  await writeAuditLog({
    user_id: await getAuthenticatedUserId(),
    action: "company.verification_updated",
    metadata: {
      company_id: id,
      verification_status: verificationStatus
    }
  });

  return { data: company, source: "supabase" };
}

export async function getAllDisputes(): Promise<ServiceResult<Dispute[]>> {
  const client = requireSupabase();

  if (!client) {
    return { data: [], source: "mock" };
  }

  const { data, error } = await client.from("disputes").select("*").order("created_at", { ascending: false });
  throwIfError(error);

  return { data: data ?? [], source: "supabase" };
}

export async function updateDisputeStatus(id: string, status: DisputeStatus): Promise<ServiceResult<Dispute | null>> {
  const client = requireSupabase();

  if (!client) {
    return { data: null, source: "mock" };
  }

  const patch: Database["public"]["Tables"]["disputes"]["Update"] = { status };
  const userId = await getAuthenticatedUserId();

  if (status === "resolved" || status === "rejected") {
    patch.resolved_by = userId;
    patch.resolved_at = new Date().toISOString();
    patch.resolution = status === "resolved" ? "Resolved by admin review." : "Rejected by admin review.";
  }

  const { data, error } = await client.from("disputes").update(patch).eq("id", id).select("*").single();
  throwIfError(error);
  const dispute = ensureData(data);
  await writeAuditLog({
    user_id: userId,
    project_id: dispute.project_id,
    action: status === "resolved" ? "dispute.resolved" : "dispute.status_updated",
    metadata: {
      dispute_id: id,
      status,
      milestone_id: dispute.milestone_id,
      resolution: patch.resolution
    }
  });
  const participants = await getProjectNotificationRecipients(dispute.project_id);
  await sendWorkflowEmail({
    to: participants.map((profile) => profile.email),
    subject: `Dispute ${status}: ${dispute.reason}`,
    title: status === "resolved" ? "Dispute resolved" : "Dispute updated",
    body: `${dispute.reason} is now ${status}.`,
    cta: `${getAppOrigin()}/projects/${dispute.project_id}`
  });

  return { data: dispute, source: "supabase" };
}

export async function createDispute(input: DisputeInsert): Promise<ServiceResult<Dispute | null>> {
  const client = requireSupabase();

  if (!client) {
    return { data: null, source: "mock" };
  }

  const { data, error } = await client.from("disputes").insert([input]).select("*").single();
  throwIfError(error);
  const dispute = ensureData(data);

  if (input.milestone_id) {
    const { error: milestoneError } = await client
      .from("milestones")
      .update({ status: "disputed" })
      .eq("id", input.milestone_id);
    throwIfError(milestoneError);
  }

  const { error: projectError } = await client
    .from("projects")
    .update({ status: "disputed" })
    .eq("id", input.project_id);
  throwIfError(projectError);

  await writeAuditLog({
    user_id: input.raised_by,
    project_id: input.project_id,
    action: "dispute.raised",
    metadata: {
      dispute_id: dispute.id,
      milestone_id: input.milestone_id,
      reason: input.reason
    }
  });
  const admins = await getAdminNotificationRecipients();
  const participants = await getProjectNotificationRecipients(input.project_id, input.raised_by);
  await sendWorkflowEmail({
    to: [...admins, ...participants].map((profile) => profile.email),
    subject: `Dispute raised: ${input.reason}`,
    title: "Dispute raised",
    body: `${input.reason} was raised for a protected Pactora project.`,
    cta: `${getAppOrigin()}/dashboard/admin`
  });

  return { data: dispute, source: "supabase" };
}

export async function getDisputesByProject(projectId: string): Promise<ServiceResult<Dispute[]>> {
  const client = requireSupabase();

  if (!client) {
    return { data: [], source: "mock" };
  }

  const { data, error } = await client
    .from("disputes")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });
  throwIfError(error);

  return { data: data ?? [], source: "supabase" };
}

export async function getAuditLogs(limit = 25): Promise<ServiceResult<AuditLogRow[]>> {
  const client = requireSupabase();

  if (!client) {
    return { data: [], source: "mock" };
  }

  const { data, error } = await client
    .from("audit_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  throwIfError(error);

  return { data: data ?? [], source: "supabase" };
}
