import type { RealtimeChannel } from "@supabase/supabase-js";
import { formatCurrency, formatDate, formatTime, normalizeStatus } from "@/lib/format";
import {
  changeRequests as mockChangeRequests,
  documents as mockDocuments,
  messages as mockMessages,
  milestones as mockMilestones,
  mockUser,
  projects as mockProjects,
  trustScores as mockTrustScores
} from "@/lib/mock-data";
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
    title: row.title,
    requester: `User ${row.requested_by.slice(0, 8)}`,
    impact: `${cost} and ${row.impact_days} day${row.impact_days === 1 ? "" : "s"}`,
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

  const { error } = await client.from("audit_logs").insert([
    {
      ...input,
      metadata: input.metadata ?? {}
    }
  ]);

  if (error) {
    console.warn("Pactora audit log skipped:", error.message);
  }
}

export async function getCurrentProfile(): Promise<ServiceResult<Profile | null>> {
  const client = requireSupabase();

  if (!client) {
    return {
      data: {
        id: mockUser.id,
        full_name: mockUser.fullName,
        email: mockUser.email,
        phone: null,
        role: mockUser.role,
        avatar_url: null,
        kyc_status: "mock",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      source: "mock"
    };
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

  return { data: mapProject(payload as ProjectRow), source: "supabase" };
}

export async function getProjects(): Promise<ServiceResult<Project[]>> {
  const client = requireSupabase();

  if (!client) {
    return { data: mockProjects, source: "mock" };
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
    return { data: mockProjects.find((project) => project.id === id) ?? null, source: "mock" };
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
    return { data: mockMilestones, source: "mock" };
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

  return { data: mapChangeRequest(ensureData(data)), source: "supabase" };
}

export async function getChangeRequestsByProject(projectId?: string): Promise<ServiceResult<ChangeRequest[]>> {
  const client = requireSupabase();

  if (!client) {
    return { data: mockChangeRequests, source: "mock" };
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
  return updateChangeRequest(id, {
    approved_by_client: true,
    status: "approved",
    approved_at: new Date().toISOString()
  });
}

export async function rejectChangeRequest(id: string) {
  return updateChangeRequest(id, { status: "rejected" });
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

  return { data: mapMessage(ensureData(data)), source: "supabase" };
}

export async function getMessagesByProject(projectId?: string): Promise<ServiceResult<Message[]>> {
  const client = requireSupabase();

  if (!client) {
    return { data: mockMessages, source: "mock" };
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
    const data = projectId ? mockDocuments.filter((document) => document.projectId === projectId) : mockDocuments;
    return { data, source: "mock" };
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
    return { data: mockTrustScores.find((score) => score.companyId === companyId) ?? mockTrustScores[0] ?? null, source: "mock" };
  }

  const { data, error } = await client.from("trust_scores").select("*").eq("company_id", companyId).maybeSingle();
  throwIfError(error);

  return { data: data ? mapTrustScore(data) : null, source: "supabase" };
}

export async function calculateTrustScorePlaceholder(companyId = mockUser.companyId) {
  const client = requireSupabase();

  if (!client) {
    return { data: mockTrustScores[0]?.score ?? 70, source: "mock" as const };
  }

  const { data, error } = await client.rpc("calculate_basic_trust_score", { company_id: companyId });
  throwIfError(error);

  return { data, source: "supabase" as const };
}

export async function getAllUsers(): Promise<ServiceResult<Profile[]>> {
  const client = requireSupabase();

  if (!client) {
    return {
      data: [
        {
          id: mockUser.id,
          full_name: mockUser.fullName,
          email: mockUser.email,
          phone: null,
          role: mockUser.role,
          avatar_url: null,
          kyc_status: "mock",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ],
      source: "mock"
    };
  }

  const { data, error } = await client.from("profiles").select("*").order("created_at", { ascending: false });
  throwIfError(error);

  return { data: data ?? [], source: "supabase" };
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

  const { data, error } = await client.from("disputes").update({ status }).eq("id", id).select("*").single();
  throwIfError(error);
  const dispute = ensureData(data);
  await writeAuditLog({
    user_id: await getAuthenticatedUserId(),
    project_id: dispute.project_id,
    action: "dispute.status_updated",
    metadata: {
      dispute_id: id,
      status
    }
  });

  return { data: dispute, source: "supabase" };
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
