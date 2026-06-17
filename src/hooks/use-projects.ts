"use client";

import { projects as mockProjects } from "@/lib/mock-data";
import { isSupabaseConfigured } from "@/lib/supabase";
import { getProjectById, getProjects } from "@/services/pactoraService";
import { Project } from "@/types";
import { useService } from "./use-service";

export function useProjects() {
  return useService(() => getProjects(), isSupabaseConfigured ? [] : mockProjects, []);
}

export function useProject(projectId: string) {
  const fallback = isSupabaseConfigured ? null : mockProjects.find((project) => project.id === projectId) ?? null;

  return useService<Project | null>(() => getProjectById(projectId), fallback, [projectId]);
}
