"use client";

import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getDashboardPathForRole } from "@/lib/auth";
import { useAuth } from "@/hooks/use-auth";

export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { profile, loading, error } = useAuth();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!profile) {
      router.replace(`/login?redirectTo=${encodeURIComponent(pathname)}`);
      return;
    }

    const expectedPath = getDashboardPathForRole(profile.role);

    if (
      (pathname === "/admin" || pathname === "/dashboard/admin") &&
      profile.role !== "admin"
    ) {
      router.replace(expectedPath);
    }

    if (pathname === "/dashboard/client" && profile.role !== "client") {
      router.replace(expectedPath);
    }

    if (pathname === "/dashboard/contractor" && profile.role !== "contractor") {
      router.replace(expectedPath);
    }
  }, [loading, pathname, profile, router]);

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-cloud">
        <p className="rounded-lg bg-white px-5 py-4 text-sm font-black text-slate-500 shadow-soft">Checking your session...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid min-h-screen place-items-center bg-cloud px-5">
        <p className="max-w-lg rounded-lg bg-rose-50 p-5 text-sm font-bold text-rose-700">{error}</p>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return children;
}
