"use client";

import Link from "next/link";
import { BriefcaseBusiness, Code2, Landmark, Layers3, Truck } from "lucide-react";
import { DashboardShell } from "@/components/DashboardShell";

const categories = [
  { name: "Software delivery", icon: Code2, signal: "Milestones, QA evidence, scope changes", href: "/milestones" },
  { name: "Professional services", icon: BriefcaseBusiness, signal: "Approvals, documents, timelines", href: "/contracts" },
  { name: "Vendor procurement", icon: Truck, signal: "Trust score, payment reliability, disputes", href: "/trust-score" },
  { name: "Finance operations", icon: Landmark, signal: "Payment placeholders, approvals, audit logs", href: "/payments" }
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
