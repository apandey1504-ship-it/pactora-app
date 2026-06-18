"use client";

import { getAllCompanies, getAllDisputes, getAllUsers, getStaffAccessGrants } from "@/services/pactoraService";
import type { Company, Dispute, Profile, StaffAccessGrant } from "@/services/pactoraService";
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

export function useStaffAccessGrants() {
  return useService<StaffAccessGrant[]>(() => getStaffAccessGrants(), [], []);
}
