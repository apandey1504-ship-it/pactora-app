"use client";

import { useCallback, useEffect, useState } from "react";
import { isSupabaseConfigured } from "@/lib/supabase";
import { ServiceResult } from "@/types";

type ResourceState<T> = {
  data: T;
  loading: boolean;
  error: string | null;
  source: "supabase" | "mock";
};

export function useService<T>(loader: () => Promise<ServiceResult<T>>, initialData: T, dependencies: unknown[] = []) {
  const [state, setState] = useState<ResourceState<T>>({
    data: initialData,
    loading: true,
    error: null,
    source: isSupabaseConfigured ? "supabase" : "mock"
  });

  const refetch = useCallback(async () => {
    setState((current) => ({ ...current, loading: true, error: null }));

    try {
      const result = await loader();
      setState({
        data: result.data,
        loading: false,
        error: null,
        source: result.source
      });
    } catch (error) {
      setState({
        data: initialData,
        loading: false,
        error: error instanceof Error ? error.message : "Unable to load data",
        source: isSupabaseConfigured ? "supabase" : "mock"
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { ...state, refetch };
}
