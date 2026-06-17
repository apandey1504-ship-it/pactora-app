"use client";

import { getCompanyTrustScore } from "@/services/pactoraService";
import { TrustScore } from "@/types";
import { useService } from "./use-service";

export function useTrustScores() {
  return useService(async () => ({ data: [], source: "supabase" as const }), [], []);
}

export function useTrustScore(companyId = "") {
  return useService<TrustScore | null>(() => getCompanyTrustScore(companyId), null, [companyId]);
}
