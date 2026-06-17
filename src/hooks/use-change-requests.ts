"use client";

import { changeRequests as mockChangeRequests } from "@/lib/mock-data";
import { isSupabaseConfigured } from "@/lib/supabase";
import { getChangeRequestsByProject } from "@/services/pactoraService";
import { useService } from "./use-service";

export function useChangeRequests(projectId?: string) {
  return useService(() => getChangeRequestsByProject(projectId), isSupabaseConfigured ? [] : mockChangeRequests, [projectId]);
}
