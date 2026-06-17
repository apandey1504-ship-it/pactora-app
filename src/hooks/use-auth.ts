"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getAuthProfile } from "@/lib/auth";
import type { Profile } from "@/types/database";

export function useAuth() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshProfile = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const nextProfile = await getAuthProfile();
      setProfile(nextProfile);
    } catch (authError) {
      setProfile(null);
      setError(authError instanceof Error ? authError.message : "Unable to load auth profile.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshProfile();

    if (!supabase) {
      return;
    }

    const { data } = supabase.auth.onAuthStateChange(() => {
      refreshProfile();
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, [refreshProfile]);

  return { profile, loading, error, refreshProfile };
}
