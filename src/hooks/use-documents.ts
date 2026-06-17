"use client";

import { documents as mockDocuments } from "@/lib/mock-data";
import { isSupabaseConfigured } from "@/lib/supabase";
import { getDocumentsByProject } from "@/services/pactoraService";
import { useService } from "./use-service";

export function useDocuments(projectId?: string) {
  const fallback = isSupabaseConfigured ? [] : projectId ? mockDocuments.filter((document) => document.projectId === projectId) : mockDocuments;

  return useService(() => getDocumentsByProject(projectId), fallback, [projectId]);
}
