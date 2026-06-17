"use client";

import { getAllDisputes, getAllUsers } from "@/services/pactoraService";
import type { Dispute, Profile } from "@/services/pactoraService";
import { useService } from "./use-service";

export function useAllUsers() {
  return useService<Profile[]>(() => getAllUsers(), [], []);
}

export function useAllDisputes() {
  return useService<Dispute[]>(() => getAllDisputes(), [], []);
}
