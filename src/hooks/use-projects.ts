"use client";

import { getProjectById, getProjects } from "@/services/pactoraService";
import { Project } from "@/types";
import { useService } from "./use-service";

export function useProjects() {
  return useService(() => getProjects(), [], []);
}

export function useProject(projectId: string) {
  return useService<Project | null>(() => getProjectById(projectId), null, [projectId]);
}
