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
            <div className="border-b border-slate-200 bg-white px-5 py-5 lg:px-8">
              <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-black tracking-tight text-navy">{title}</h1>
                  <p className="mt-1 text-sm font-semibold text-slate-500">{subtitle}</p>
                </div>
                {action}
              </div>
            </div>
            <div className="mx-auto max-w-6xl px-5 py-8 lg:px-8">{children}</div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
