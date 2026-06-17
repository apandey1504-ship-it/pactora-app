import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// Add these values in `.env.local` from Supabase Dashboard -> Project Settings -> API:
// NEXT_PUBLIC_SUPABASE_URL=...
// NEXT_PUBLIC_SUPABASE_ANON_KEY=...
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient<Database>(supabaseUrl, supabaseAnonKey)
    : null;

export const isSupabaseConfigured = Boolean(supabase);

export const databaseTables = [
  "profiles",
  "companies",
  "company_members",
  "projects",
  "project_participants",
  "milestones",
  "change_requests",
  "change_request_comments",
  "messages",
  "documents",
  "payments",
  "disputes",
  "trust_scores",
  "audit_logs",
  "notifications"
] as const;
