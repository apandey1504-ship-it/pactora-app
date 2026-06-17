import { trustScores as mockTrustScores } from "@/lib/mock-data";
import { supabase } from "@/lib/supabase";
import { ServiceResult, TrustScore } from "@/types";
import type { Database } from "@/types/database";

type TrustScoreRow = Database["public"]["Tables"]["trust_scores"]["Row"];
type TrustScoreInsert = Database["public"]["Tables"]["trust_scores"]["Insert"];

function mapTrustScore(row: TrustScoreRow): TrustScore {
  return {
    id: row.id,
    companyId: row.company_id,
    score: row.score,
    signal: {
      completion_rate: row.completion_rate,
      on_time_rate: row.on_time_rate,
      dispute_rate: row.dispute_rate,
      payment_reliability: row.payment_reliability
    },
    createdAt: row.created_at
  };
}

export async function listTrustScores(): Promise<ServiceResult<TrustScore[]>> {
  if (!supabase) {
    return { data: mockTrustScores, source: "mock" };
  }

  const { data, error } = await supabase.from("trust_scores").select("*").order("created_at", { ascending: false });

  if (error || !data) {
    return { data: mockTrustScores, source: "mock" };
  }

  return { data: data.map(mapTrustScore), source: "supabase" };
}

export async function getTrustScore(companyId: string): Promise<ServiceResult<TrustScore | null>> {
  if (!supabase) {
    return { data: mockTrustScores.find((score) => score.companyId === companyId) ?? mockTrustScores[0] ?? null, source: "mock" };
  }

  const { data, error } = await supabase
    .from("trust_scores")
    .select("*")
    .eq("company_id", companyId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return { data: mockTrustScores.find((score) => score.companyId === companyId) ?? mockTrustScores[0] ?? null, source: "mock" };
  }

  return { data: mapTrustScore(data), source: "supabase" };
}

export async function createTrustScore(trustScore: TrustScoreInsert) {
  if (!supabase) {
    return { data: null, source: "mock" as const };
  }

  const { data, error } = await supabase.from("trust_scores").insert([trustScore]).select("*").single();

  if (error) {
    throw error;
  }

  return { data: mapTrustScore(data), source: "supabase" as const };
}
