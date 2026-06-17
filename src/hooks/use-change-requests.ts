"use client";

import { getChangeRequestsByProject } from "@/services/pactoraService";
import { useService } from "./use-service";

export function useChangeRequests(projectId?: string) {
  return useService(() => getChangeRequestsByProject(projectId), [], [projectId]);
}
