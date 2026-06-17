import { projects as mockProjects } from "@/lib/mock-data";
import { formatCurrency, formatDate, normalizeStatus } from "@/lib/format";
import { supabase } from "@/lib/supabase";
import { Project, ServiceResult } from "@/types";
import type { Database } from "@/types/database";

type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];
type ProjectInsert = Database["public"]["Tables"]["projects"]["Insert"];

function mapProject(row: ProjectRow): Project {
  return {
    id: row.id,
    name: row.title,
    company: row.client_company_id ? `Company ${row.client_company_id.slice(0, 8)}` : "Client company",
    counterparty: row.contractor_company_id ? `Company ${row.contractor_company_id.slice(0, 8)}` : "Contractor company",
    value: formatCurrency(row.project_value),
    progress: row.status === "completed" ? 100 : row.status === "active" ? 64 : 36,
    status: normalizeStatus(row.status),
    dueDate: formatDate(row.due_date),
    trustScore: 86
  };
}

export async function listProjects(): Promise<ServiceResult<Project[]>> {
  if (!supabase) {
    return { data: mockProjects, source: "mock" };
  }

  const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false });

  if (error || !data) {
    return { data: mockProjects, source: "mock" };
  }

  return { data: data.map(mapProject), source: "supabase" };
}

export async function getProject(id: string): Promise<ServiceResult<Project | null>> {
  if (!supabase) {
    return { data: mockProjects.find((project) => project.id === id) ?? null, source: "mock" };
  }

  const { data, error } = await supabase.from("projects").select("*").eq("id", id).maybeSingle();

  if (error || !data) {
    return { data: mockProjects.find((project) => project.id === id) ?? null, source: "mock" };
  }

  return { data: mapProject(data), source: "supabase" };
}

export async function createProject(project: ProjectInsert) {
  if (!supabase) {
    return { data: null, source: "mock" as const };
  }

  const { data, error } = await supabase.from("projects").insert([project]).select("*").single();

  if (error) {
    throw error;
  }

  return { data: mapProject(data), source: "supabase" as const };
}
