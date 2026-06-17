"use client";

import { getAllCompanies, getAllDisputes, getAllUsers } from "@/services/pactoraService";
import type { Company, Dispute, Profile } from "@/services/pactoraService";
import { useService } from "./use-service";

export function useAllUsers() {
  return useService<Profile[]>(() => getAllUsers(), [], []);
}

export function useAllDisputes() {
  return useService<Dispute[]>(() => getAllDisputes(), [], []);
}

export function useAllCompanies() {
  return useService<Company[]>(() => getAllCompanies(), [], []);
}
