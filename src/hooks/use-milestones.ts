"use client";

import { milestones as mockMilestones } from "@/lib/mock-data";
import { isSupabaseConfigured } from "@/lib/supabase";
import { getMilestonesByProject } from "@/services/pactoraService";
import { useService } from "./use-service";

export function useMilestones(projectId?: string) {
  return useService(() => getMilestonesByProject(projectId), isSupabaseConfigured ? [] : mockMilestones, [projectId]);
}
