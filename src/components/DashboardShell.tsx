import type { ReactNode } from "react";
import { AuthGuard } from "./AuthGuard";
import { Sidebar } from "./Sidebar";

export function DashboardShell({
  title,
  subtitle,
  action,
  children
}: {
  title: string;
  subtitle: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-cloud">
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
