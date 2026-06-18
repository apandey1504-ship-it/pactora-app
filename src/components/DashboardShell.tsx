import type { ReactNode } from "react";
import { AuthGuard } from "./AuthGuard";
import { BetaBanner } from "./BetaBanner";
import { MobileDashboardNav, Sidebar } from "./Sidebar";
import type { UserRole } from "@/types/database";

export function DashboardShell({
  title,
  subtitle,
  action,
  allowedRoles,
  children
}: {
  title: string;
  subtitle: string;
  action?: ReactNode;
  allowedRoles?: UserRole[];
  children: ReactNode;
}) {
  return (
    <AuthGuard allowedRoles={allowedRoles}>
      <div className="min-h-screen bg-cloud">
        <BetaBanner />
        <MobileDashboardNav />
        <div className="flex">
          <Sidebar />
          <main className="min-w-0 flex-1">
            <div className="border-b border-slate-200 bg-white px-4 py-4 sm:px-5 sm:py-5 lg:px-8">
              <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <h1 className="text-2xl font-black tracking-tight text-navy sm:text-3xl">{title}</h1>
                  <p className="mt-1 text-sm font-semibold leading-6 text-slate-500">{subtitle}</p>
                </div>
                {action ? <div className="flex w-full flex-wrap gap-2 sm:w-auto">{action}</div> : null}
              </div>
            </div>
            <div className="mx-auto max-w-6xl px-4 py-6 sm:px-5 sm:py-8 lg:px-8">{children}</div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
