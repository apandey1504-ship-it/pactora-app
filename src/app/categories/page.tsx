"use client";

import Link from "next/link";
import { BadgeDollarSign, BriefcaseBusiness, Building2, Code2, Landmark, Layers3, Scale, Truck, WandSparkles } from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";

const categories = [
  { name: "Shipment and logistics", icon: Truck, signal: "Delivery windows, carrier evidence, penalty exposure", href: "/contracts" },
  { name: "Agency and creative work", icon: WandSparkles, signal: "Scopes, revision rounds, approval proof", href: "/milestones" },
  { name: "Software delivery", icon: Code2, signal: "Milestones, QA evidence, scope changes", href: "/milestones" },
  { name: "Finance operations", icon: Landmark, signal: "Payment holds, release readiness, audit logs", href: "/payments" },
  { name: "Professional services", icon: BriefcaseBusiness, signal: "Approvals, documents, timelines", href: "/contracts" },
  { name: "Construction and field work", icon: Building2, signal: "Site evidence, change orders, delay claims", href: "/change-requests" },
  { name: "Legal and compliance", icon: Scale, signal: "Contract versions, signed records, dispute history", href: "/contracts" },
  { name: "Procurement and vendors", icon: BadgeDollarSign, signal: "Trust score, payment reliability, disputes", href: "/trust-score" }
];

export default function CategoriesPage() {
  return (
    <DashboardShell
      title="Categories"
      subtitle="Organize Pactora workflows by contract type, operating model, and assurance needs."
    >
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {categories.map((category) => (
          <Link key={category.name} href={category.href} className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-glow">
            <category.icon className="text-purple" size={24} />
            <p className="mt-5 text-lg font-black text-navy">{category.name}</p>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">{category.signal}</p>
          </Link>
        ))}
      </div>

      <section className="mt-8 rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        <div className="flex items-center gap-2 text-lg font-black text-navy">
          <Layers3 size={20} />
          Assurance taxonomy
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {["Contract risk", "Delivery risk", "Payment risk"].map((item) => (
            <div key={item} className="rounded-lg bg-cloud p-4">
              <p className="font-black text-navy">{item}</p>
              <p className="mt-1 text-sm font-semibold text-slate-500">Mapped to projects, milestones, changes, and trust score inputs.</p>
            </div>
          ))}
        </div>
      </section>
    </DashboardShell>
  );
}
