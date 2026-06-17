import { changeRequests as mockChangeRequests } from "@/lib/mock-data";
import { normalizeStatus } from "@/lib/format";
import { supabase } from "@/lib/supabase";
import { ChangeRequest, ServiceResult } from "@/types";
import type { Database } from "@/types/database";

type ChangeRequestRow = Database["public"]["Tables"]["change_requests"]["Row"];
type ChangeRequestInsert = Database["public"]["Tables"]["change_requests"]["Insert"];
type ChangeRequestStatus = NonNullable<Database["public"]["Tables"]["change_requests"]["Update"]["status"]>;

function mapChangeRequest(row: ChangeRequestRow): ChangeRequest {
  return {
    id: row.id,
    title: row.title,
    requester: row.requested_by ? `User ${row.requested_by.slice(0, 8)}` : "Project stakeholder",
    impact: `${formatImpactCost(row.impact_cost)} and ${row.impact_days} day${row.impact_days === 1 ? "" : "s"}`,
    status: normalizeStatus(row.status),
    summary: row.description ?? "No summary provided."
  };
}

function formatImpactCost(value: number) {
  if (!value) {
    return "No cost change";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

export async function listChangeRequests(projectId?: string): Promise<ServiceResult<ChangeRequest[]>> {
  if (!supabase) {
    return { data: mockChangeRequests, source: "mock" };
  }

  let query = supabase.from("change_requests").select("*").order("created_at", { ascending: false });

  if (projectId) {
    query = query.eq("project_id", projectId);
  }

  const { data, error } = await query;

  if (error || !data) {
    return { data: mockChangeRequests, source: "mock" };
  }

  return { data: data.map(mapChangeRequest), source: "supabase" };
}

export async function createChangeRequest(changeRequest: ChangeRequestInsert) {
  if (!supabase) {
    return { data: null, source: "mock" as const };
  }

  const { data, error } = await supabase.from("change_requests").insert([changeRequest]).select("*").single();

  if (error) {
    throw error;
  }

  return { data: mapChangeRequest(data), source: "supabase" as const };
}

export async function updateChangeRequestStatus(id: string, status: ChangeRequestStatus) {
  if (!supabase) {
    return { data: null, source: "mock" as const };
  }

  const { data, error } = await supabase.from("change_requests").update({ status }).eq("id", id).select("*").single();

  if (error) {
    throw error;
  }

  return { data: mapChangeRequest(data), source: "supabase" as const };
}
