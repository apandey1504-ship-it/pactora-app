"use client";

import { getDocumentsByProject } from "@/services/pactoraService";
import { useService } from "./use-service";

export function useDocuments(projectId?: string) {
  return useService(() => getDocumentsByProject(projectId), [], [projectId]);
}
