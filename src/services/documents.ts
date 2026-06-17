import { formatDate } from "@/lib/format";
import { documents as mockDocuments } from "@/lib/mock-data";
import { supabase } from "@/lib/supabase";
import { ProjectDocument, ServiceResult } from "@/types";
import type { Database } from "@/types/database";

type DocumentRow = Database["public"]["Tables"]["documents"]["Row"];
type DocumentInsert = Database["public"]["Tables"]["documents"]["Insert"];

function mapDocument(row: DocumentRow): ProjectDocument {
  return {
    id: row.id,
    projectId: row.project_id,
    name: row.file_name,
    fileUrl: row.file_url,
    createdAt: formatDate(row.created_at)
  };
}

export async function listDocuments(projectId?: string): Promise<ServiceResult<ProjectDocument[]>> {
  if (!supabase) {
    const data = projectId ? mockDocuments.filter((document) => document.projectId === projectId) : mockDocuments;
    return { data, source: "mock" };
  }

  let query = supabase.from("documents").select("*").order("created_at", { ascending: false });

  if (projectId) {
    query = query.eq("project_id", projectId);
  }

  const { data, error } = await query;

  if (error || !data) {
    const fallback = projectId ? mockDocuments.filter((document) => document.projectId === projectId) : mockDocuments;
    return { data: fallback, source: "mock" };
  }

  return { data: data.map(mapDocument), source: "supabase" };
}

export async function createDocument(document: DocumentInsert) {
  if (!supabase) {
    return { data: null, source: "mock" as const };
  }

  const { data, error } = await supabase.from("documents").insert([document]).select("*").single();

  if (error) {
    throw error;
  }

  return { data: mapDocument(data), source: "supabase" as const };
}
