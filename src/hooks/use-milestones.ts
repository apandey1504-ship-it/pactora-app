"use client";

import { getMilestonesByProject } from "@/services/pactoraService";
import { useService } from "./use-service";

export function useMilestones(projectId?: string) {
  return useService(() => getMilestonesByProject(projectId), [], [projectId]);
}
