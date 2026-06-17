"use client";

import { getMessagesByProject } from "@/services/pactoraService";
import { useService } from "./use-service";

export function useMessages(projectId?: string) {
  return useService(() => getMessagesByProject(projectId), [], [projectId]);
}
