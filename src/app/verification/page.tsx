"use client";

import { Building2, CheckCircle2, Landmark, ShieldCheck } from "lucide-react";
import { DashboardCard } from "@/components/DashboardCard";
import { DashboardShell } from "@/components/DashboardShell";

const verificationTools = [
  {
    title: "Banking verification",
    provider: "Plaid-ready",
    detail: "Connect bank account ownership, payout readiness, and payment reliability checks when Plaid keys are added."
  },
  {
    title: "Business verification",
    provider: "KYB-ready",
    detail: "Capture registration number, tax number, legal name, country, and verification evidence for each company."
  },
  {
    title: "Document verification",
    provider: "Pactora vault",
    detail: "Review uploaded contracts, certificates, bank letters, insurance files, and company records."
  }
];

export default function VerificationPage() {
  const stats = [
    { label: "Banking", value: "Plaid-ready", delta: "Placeholder" },
    { label: "Company KYB", value: "Ready", delta: "Manual review" },
    { label: "Documents", value: "Vault", delta: "Project-linked" },
    { label: "Risk status", value: "Tracked", delta: "Audit trail" }
  ];

  return (
    <DashboardShell
      title="Verification"
      subtitle="Banking, business, company, and document verification controls for trusted project work."
    >
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => (
          <DashboardCard key={stat.label} {...stat} icon={[Landmark, Building2, ShieldCheck, CheckCircle2][index]} />
        ))}
      </div>

      <section className="mt-8 grid gap-5 lg:grid-cols-3">
        {verificationTools.map((tool) => (
          <article key={tool.title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
            <p className="text-sm font-black uppercase tracking-wide text-purple">{tool.provider}</p>
            <h2 className="mt-3 text-xl font-black text-navy">{tool.title}</h2>
            <p className="mt-3 text-sm font-semibold leading-6 text-slate-500">{tool.detail}</p>
            <button className="mt-5 rounded-lg bg-cloud px-4 py-3 text-sm font-black text-navy">
              Configure later
            </button>
          </article>
        ))}
      </section>

      <section className="mt-6 rounded-lg bg-navy p-6 text-white shadow-soft">
        <p className="text-sm font-black uppercase tracking-wide text-emerald">Integration notes</p>
        <h2 className="mt-3 text-3xl font-black">Plaid and KYB providers stay database-ready.</h2>
        <p className="mt-3 max-w-3xl text-sm font-semibold leading-6 text-white/70">
          The UI is prepared for Plaid Link, business registry checks, tax verification, insurance certificate review, and bank ownership proof. No real provider keys are required for the current mock/testing flow.
        </p>
      </section>
    </DashboardShell>
  );
}
