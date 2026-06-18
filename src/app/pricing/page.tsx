import Link from "next/link";
import { ArrowRight, BadgeCheck, FileText, LockKeyhole, WalletCards } from "lucide-react";
import { Header } from "@/components/Header";
import { PricingCalculator } from "@/components/PricingCalculator";
import { PricingCard } from "@/components/PricingCard";
import { PublicFooter } from "@/components/PublicFooter";
import { pricingPlans } from "@/lib/pricing";

const comparisonRows = [
  ["Active projects", "1", "10", "Unlimited", "Custom"],
  ["Document storage", "500 MB", "5 GB", "50 GB", "Custom"],
  ["Milestones", "Basic", "Unlimited", "Advanced", "Custom"],
  ["Change governance", "Basic", "Included", "Advanced", "Custom"],
  ["Business verification", "Not included", "Basic", "Included", "Custom"],
  ["Dispute documentation", "Basic", "Included", "Advanced", "Custom"],
  ["Team permissions", "Single user", "Basic", "Admin controls", "Advanced"],
  ["Platform fee", "3%", "3%", "2%", "Volume pricing"]
];

const faqs = [
  ["Can I start free?", "Yes. Starter is designed for one protected agreement during private beta."],
  ["Do you hold customer funds?", "No. Pactora coordinates milestone payment workflows through third-party payment providers."],
  ["Can contractors use Pactora too?", "Yes. Contractors can accept projects, submit milestones, respond to changes, message clients, and upload evidence."],
  ["When should I choose Business?", "Choose Business when your team needs unlimited active projects, verification, advanced audit trails, and admin controls."]
];

const heroSignals = [
  { label: "Protected value", value: "$250K", icon: WalletCards },
  { label: "Audit-ready records", value: "Every action", icon: FileText },
  { label: "Verification controls", value: "Business-ready", icon: BadgeCheck },
  { label: "Private beta access", value: "Invite only", icon: LockKeyhole }
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-cloud text-navy">
      <Header />

      <section className="overflow-hidden bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-5 sm:py-16 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-20">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-purple">Pricing</p>
            <h1 className="mt-3 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              Beta pricing for agreements that need protection.
            </h1>
            <p className="mt-5 max-w-2xl text-base font-semibold leading-7 text-slate-600 sm:text-lg sm:leading-8">
              Start with contract assurance, then scale into secure milestone payment coordination, verification, audit controls, disputes, and trust-score operations.
            </p>
            <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap">
              <Link href="/signup" className="rounded-lg bg-purple px-5 py-3.5 text-center font-black text-white shadow-glow">
                Join private beta
              </Link>
              <Link href="/demo" className="rounded-lg bg-cloud px-5 py-3.5 text-center font-black text-navy ring-1 ring-slate-200">
                Talk to sales
              </Link>
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-cloud p-4 shadow-soft sm:p-5">
            <div className="mobile-scrollbar -mx-4 flex snap-x gap-3 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-1">
            {heroSignals.map((signal) => (
              <div key={signal.label} className="flex min-w-[255px] snap-start items-center justify-between gap-4 rounded-lg bg-white p-4 sm:min-w-0">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-purple/10 text-purple">
                    <signal.icon size={19} />
                  </span>
                  <p className="text-sm font-black text-slate-500">{signal.label}</p>
                </div>
                <p className="text-lg font-black text-navy">{signal.value}</p>
              </div>
            ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-5 sm:py-16 lg:px-8">
        <div className="mobile-scrollbar -mx-4 flex snap-x gap-4 overflow-x-auto px-4 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 xl:grid-cols-4">
          {pricingPlans.map((plan) => (
            <div key={plan.name} className="min-w-[280px] snap-start md:min-w-0">
            <PricingCard
              {...plan}
              featured={plan.name === "Business"}
              href={plan.slug === "enterprise" ? "/contact" : `/checkout?plan=${plan.slug}`}
            />
            </div>
          ))}
        </div>

        <div className="mt-10">
          <PricingCalculator />
        </div>

        <section className="mt-10 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft">
          <div className="border-b border-slate-200 p-5 sm:p-6">
            <p className="text-sm font-black uppercase tracking-wide text-purple">Compare plans</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight">Pick the operating layer that matches your risk.</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-cloud text-xs font-black uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-4">Feature</th>
                  {pricingPlans.map((plan) => (
                    <th key={plan.slug} className="px-5 py-4">{plan.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-bold text-slate-600">
                {comparisonRows.map((row) => (
                  <tr key={row[0]} className="transition hover:bg-cloud/70">
                    {row.map((cell, index) => (
                      <td key={`${row[0]}-${cell}`} className={`px-5 py-4 ${index === 0 ? "font-black text-navy" : ""}`}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-10 rounded-lg bg-navy p-5 text-white shadow-soft sm:p-6">
          <p className="text-sm font-black uppercase tracking-wide text-emerald">Payment positioning</p>
          <p className="mt-3 max-w-4xl text-sm font-semibold leading-7 text-white/72">
            Funds are processed through trusted payment partners. Pactora provides workflow, approval, audit, and dispute documentation around milestone payments. Pactora is not a bank, money transmitter, insurer, or escrow agent in the MVP.
          </p>
        </section>

        <section className="mt-10 grid gap-4 lg:grid-cols-2">
          {faqs.map(([question, answer]) => (
            <details key={question} className="group rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-black">
                {question}
                <ArrowRight className="shrink-0 text-purple transition group-open:rotate-90" size={18} />
              </summary>
              <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">{answer}</p>
            </details>
          ))}
        </section>
      </section>

      <PublicFooter />
    </main>
  );
}
