import { supabase } from "@/lib/supabase";
import type { Profile, UserRole } from "@/types/database";

export type SignupInput = {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  countryCode?: string;
  country?: string;
};

function getAuthErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof error === "object" && error && "message" in error && typeof error.message === "string") {
    return error.message;
  }

  return "Authentication failed.";
}

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : typeof error === "object" && error && "message" in error && typeof error.message === "string"
      ? error.message
      : "";
}

function isMissingProfilesTableError(error: unknown) {
  const message = getErrorMessage(error);

  return message.includes("public.profiles") && message.includes("schema cache");
}

function isMissingWorkspaceTableError(error: unknown) {
  const message = getErrorMessage(error);

  return (message.includes("public.companies") || message.includes("public.company_members")) && message.includes("schema cache");
}

async function ensureDefaultWorkspace(profile: Profile) {
  if (!supabase) {
    return;
  }

  const { data: membership, error: membershipError } = await supabase
    .from("company_members")
    .select("id")
    .eq("user_id", profile.id)
    .limit(1)
    .maybeSingle();

  if (membershipError) {
    if (isMissingWorkspaceTableError(membershipError)) {
      return;
    }

    console.warn("Pactora workspace setup skipped:", membershipError.message);
    return;
  }

  if (membership) {
    return;
  }

  const companyName =
    profile.full_name?.trim() ||
    (profile.email ? `${profile.email.split("@")[0]} Workspace` : "Pactora Workspace");
  const country = profile.phone?.startsWith("+91")
    ? "IN"
    : profile.phone?.startsWith("+44")
      ? "GB"
      : "US";

  const { data: company, error: companyError } = await supabase
    .from("companies")
    .insert([
      {
        name: companyName,
        legal_name: companyName,
        business_type: profile.role === "contractor" ? "Contractor" : "Client",
        country,
        verification_status: "unverified"
      }
    ])
    .select("id")
    .single();

  if (companyError) {
    if (isMissingWorkspaceTableError(companyError)) {
      return;
    }

    console.warn("Pactora company setup skipped:", companyError.message);
    return;
  }

  const { error: memberError } = await supabase.from("company_members").insert([
    {
      company_id: company.id,
      user_id: profile.id,
      role: profile.role
    }
  ]);

  if (memberError) {
    if (isMissingWorkspaceTableError(memberError)) {
      return;
    }

    console.warn("Pactora company membership setup skipped:", memberError.message);
  }
}

function getMissingProfilesTableMessage() {
  return "Supabase login succeeded, but Pactora could not load your profile because the public.profiles table is missing from this Supabase project. Run supabase/migrations/001_initial_schema.sql and 002_rls_policies.sql in the same project, then run NOTIFY pgrst, 'reload schema';";
}

export function getDashboardPathForRole(role?: UserRole | null) {
  if (role === "admin") {
    return "/dashboard/admin";
  }

  if (role === "contractor") {
    return "/dashboard/contractor";
  }

  return "/dashboard/client";
}

export async function updateProfileRole(role: UserRole) {
  if (!supabase) {
    throw new Error("Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local.");
  }

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) {
    throw userError;
  }

  if (!userData.user) {
    throw new Error("Login first before changing dashboard role.");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", userData.user.id)
    .select("*")
    .single();

  if (error) {
    throw new Error(getAuthErrorMessage(error));
  }

  await ensureDefaultWorkspace(profile);
  return profile;
}

export async function getAuthProfile(): Promise<Profile | null> {
  if (!supabase) {
    throw new Error("Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local.");
  }

  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

  if (sessionError) {
    throw sessionError;
  }

  const user = sessionData.session?.user;

  if (!user) {
    return null;
  }

  const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();

  if (error) {
    if (isMissingProfilesTableError(error)) {
      throw new Error(getMissingProfilesTableMessage());
    }

    throw error;
  }

  if (data) {
    await ensureDefaultWorkspace(data);
    return data;
  }

  const role = (user.user_metadata?.role ?? "client") as UserRole;
  const { data: insertedProfile, error: insertError } = await supabase
    .from("profiles")
    .insert([
      {
        id: user.id,
        email: user.email ?? "",
        full_name: user.user_metadata?.full_name ?? "",
        role,
        kyc_status: "not_started"
      }
    ])
    .select("*")
    .single();

  if (insertError) {
    throw insertError;
  }

  await ensureDefaultWorkspace(insertedProfile);
  return insertedProfile;
}

export async function signUpWithProfile(input: SignupInput) {
  if (!supabase) {
    throw new Error("Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local.");
  }

  const email = input.email.trim().toLowerCase();
  const { data, error } = await supabase.auth.signUp({
    email,
    password: input.password,
    options: {
      data: {
        full_name: input.fullName,
        role: input.role,
        country_code: input.countryCode,
        country: input.country
      }
    }
  });

  if (error) {
    throw new Error(getAuthErrorMessage(error));
  }

  if (data.user && data.session) {
    const { error: profileError } = await supabase.from("profiles").upsert({
      id: data.user.id,
      email,
      full_name: input.fullName,
      phone: input.phone ? `${input.countryCode ?? ""} ${input.phone}`.trim() : null,
      role: input.role,
      kyc_status: "not_started"
    });

    if (profileError) {
      if (isMissingProfilesTableError(profileError)) {
        throw new Error(getMissingProfilesTableMessage());
      }

      throw new Error(getAuthErrorMessage(profileError));
    }

    await ensureDefaultWorkspace({
      id: data.user.id,
      email,
      full_name: input.fullName,
      phone: input.phone ? `${input.countryCode ?? ""} ${input.phone}`.trim() : null,
      role: input.role,
      avatar_url: null,
      kyc_status: "not_started",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  }

  return data;
}

export async function loginWithPassword(email: string, password: string) {
  if (!supabase) {
    throw new Error("Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local.");
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password
  });

  if (error) {
    throw new Error(getAuthErrorMessage(error));
  }

  return data;
}

export async function logout() {
  if (!supabase) {
    return;
  }

  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(getAuthErrorMessage(error));
  }
}

export async function sendPasswordReset(email: string) {
  if (!supabase) {
    throw new Error("Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local.");
  }

  const redirectTo = typeof window !== "undefined" ? `${window.location.origin}/reset-password` : undefined;
  const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), { redirectTo });

  if (error) {
    throw new Error(getAuthErrorMessage(error));
  }
}

export async function updatePassword(password: string) {
  if (!supabase) {
    throw new Error("Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local.");
  }

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    throw new Error(getAuthErrorMessage(error));
  }
}
