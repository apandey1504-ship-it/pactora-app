"use client";

import { ShieldCheck } from "lucide-react";
import { DataSourceBadge } from "@/components/DataSourceBadge";
import { DashboardShell } from "@/components/DashboardShell";
import { TrustScoreBadge } from "@/components/TrustScoreBadge";
import { trustSignals } from "@/lib/mock-data";
import { useTrustScore } from "@/hooks/use-trust-scores";

export default function TrustScorePage() {
  const { data: trustScore, source, loading } = useTrustScore();
  const score = trustScore?.score ?? 94;

  return (
    <DashboardShell
      title="Trust score"
      subtitle="A business confidence profile based on verified behavior, approvals, payments, and disputes."
      action={<div className="flex flex-wrap items-center gap-3"><DataSourceBadge source={source} loading={loading} /><TrustScoreBadge score={score} /></div>}
    >
      <section className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <div className="rounded-lg bg-navy p-8 text-white shadow-glow">
          <ShieldCheck className="text-emerald" size={42} />
          <p className="mt-8 text-7xl font-black tracking-tight">{score}</p>
          <p className="mt-3 text-xl font-black">Excellent assurance profile</p>
          <p className="mt-3 text-sm font-medium leading-6 text-white/68">
            Strong approval hygiene, low dispute exposure, and verified business identity.
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
          <h2 className="text-xl font-black text-navy">Score drivers</h2>
          <div className="mt-6 space-y-4">
            {trustSignals.map((signal, index) => (
              <div key={signal}>
                <div className="flex justify-between text-sm font-black text-navy">
                  <span>{signal}</span>
                  <span>{96 - index * 3}%</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-slate-100">
                  <div className="h-2 rounded-full bg-emerald" style={{ width: `${96 - index * 3}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </DashboardShell>
  );
}
