import { formatCurrency, formatDate, normalizeStatus } from "@/lib/format";
import { milestones as mockMilestones } from "@/lib/mock-data";
import { supabase } from "@/lib/supabase";
import { Milestone, ServiceResult } from "@/types";
import type { Database } from "@/types/database";

type MilestoneRow = Database["public"]["Tables"]["milestones"]["Row"];
type MilestoneInsert = Database["public"]["Tables"]["milestones"]["Insert"];
type MilestoneStatus = NonNullable<Database["public"]["Tables"]["milestones"]["Update"]["status"]>;

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

export async function listMilestones(projectId?: string): Promise<ServiceResult<Milestone[]>> {
  if (!supabase) {
    return { data: mockMilestones, source: "mock" };
  }

  let query = supabase.from("milestones").select("*").order("due_date", { ascending: true });

  if (projectId) {
    query = query.eq("project_id", projectId);
  }

  const { data, error } = await query;

  if (error || !data) {
    return { data: mockMilestones, source: "mock" };
  }

  return { data: data.map(mapMilestone), source: "supabase" };
}

export async function createMilestone(milestone: MilestoneInsert) {
  if (!supabase) {
    return { data: null, source: "mock" as const };
  }

  const { data, error } = await supabase.from("milestones").insert([milestone]).select("*").single();

  if (error) {
    throw error;
  }

  return { data: mapMilestone(data), source: "supabase" as const };
}

export async function updateMilestoneStatus(id: string, status: MilestoneStatus) {
  if (!supabase) {
    return { data: null, source: "mock" as const };
  }

  const { data, error } = await supabase.from("milestones").update({ status }).eq("id", id).select("*").single();

  if (error) {
    throw error;
  }

  return { data: mapMilestone(data), source: "supabase" as const };
}
