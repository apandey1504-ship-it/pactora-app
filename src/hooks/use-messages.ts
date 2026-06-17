"use client";

import { messages as mockMessages } from "@/lib/mock-data";
import { isSupabaseConfigured } from "@/lib/supabase";
import { getMessagesByProject } from "@/services/pactoraService";
import { useService } from "./use-service";

export function useMessages(projectId?: string) {
  return useService(() => getMessagesByProject(projectId), isSupabaseConfigured ? [] : mockMessages, [projectId]);
}
