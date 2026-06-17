"use client";

import { mockUser, trustScores as mockTrustScores } from "@/lib/mock-data";
import { isSupabaseConfigured } from "@/lib/supabase";
import { getCompanyTrustScore } from "@/services/pactoraService";
import { TrustScore } from "@/types";
import { useService } from "./use-service";

export function useTrustScores() {
  return useService(async () => ({ data: isSupabaseConfigured ? [] : mockTrustScores, source: isSupabaseConfigured ? "supabase" : "mock" }), isSupabaseConfigured ? [] : mockTrustScores, []);
}

export function useTrustScore(companyId = mockUser.companyId) {
  const fallback = isSupabaseConfigured ? null : mockTrustScores.find((score) => score.companyId === companyId) ?? mockTrustScores[0] ?? null;

  return useService<TrustScore | null>(() => getCompanyTrustScore(companyId), fallback, [companyId]);
}
