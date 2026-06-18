"use client";

import { useEffect, useState } from "react";
import { Activity } from "lucide-react";
import { getAuditLogs, type AuditLogRow } from "@/services/pactoraService";
import { AuditTimeline } from "./AuditTimeline";
import { EmptyState, ErrorState, LoadingState } from "./ResourceState";

export function ProjectActivityPanel({ title = "Recent activity" }: { title?: string }) {
  const [logs, setLogs] = useState<AuditLogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadLogs() {
      try {
        const result = await getAuditLogs(6);
        if (isActive) {
          setLogs(result.data);
          setError(null);
        }
      } catch (activityError) {
        if (isActive) {
          setError(activityError instanceof Error ? activityError.message : "Activity could not be loaded.");
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    void loadLogs();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      <div className="flex items-center gap-2">
        <Activity size={20} className="text-purple" />
        <h2 className="text-lg font-black text-navy">{title}</h2>
      </div>
      <div className="mt-4">
        {loading ? <LoadingState /> : null}
        {error ? <ErrorState message={`Activity request failed: ${error}`} /> : null}
        {!loading && !error && logs.length === 0 ? <EmptyState message="No project activity yet." /> : null}
        {!loading && !error && logs.length > 0 ? <AuditTimeline logs={logs} compact /> : null}
      </div>
    </section>
  );
}
