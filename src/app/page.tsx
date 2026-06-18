import Link from "next/link";
import { Archive, BadgeCheck, Clock3, FileCheck2, GitPullRequest, MessageSquareWarning, ShieldCheck, Sparkles, WalletCards } from "lucide-react";
import { Header } from "@/components/Header";
import { PricingCard } from "@/components/PricingCard";
import { PublicFooter } from "@/components/PublicFooter";
import { StatusBadge } from "@/components/StatusBadge";
import { TrustScoreBadge } from "@/components/TrustScoreBadge";
import { changeRequests, milestones, projects, trustSignals } from "@/lib/mock-data";
import { pricingPlans } from "@/lib/pricing";

const features = [
  { icon: FileCheck2, title: "Contract Assurance", text: "Centralize agreements, documents, acceptance criteria, and approval history." },
  { icon: BadgeCheck, title: "Milestone Management", text: "Track work evidence, approval states, release rules, and payment readiness." },
  { icon: GitPullRequest, title: "Change Governance Engine™", text: "Keep cost, timeline, and obligation changes auditable before they become disputes." },
  { icon: WalletCards, title: "Secure Milestone Payments", text: "Coordinate payment funding and release logic through trusted payment partners." },
  { icon: Clock3, title: "Audit Trail", text: "Record scope, approvals, documents, messages, and status changes across the project." },
  { icon: MessageSquareWarning, title: "Dispute Documentation", text: "Keep clean evidence and timelines ready when project disagreements need review." },
  { icon: ShieldCheck, title: "Business Trust Score", text: "Turn business behavior into confidence signals for clients and contractors." },
  { icon: Archive, title: "Document Vault", text: "Attach contracts, certificates, evidence, invoices, and verification documents." }
];

export default function LandingPage() {
  return (
    <main className="bg-cloud text-navy">
      <Header />
      <section className="shell-grid overflow-hidden bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 pb-12 pt-10 sm:px-5 sm:pb-16 sm:pt-14 lg:grid-cols-[0.92fr_1.08fr] lg:px-8 lg:pb-24 lg:pt-20">
          <div className="flex flex-col justify-center">
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-purple/10 px-3 py-1.5 text-sm font-black text-purple">
              <Sparkles size={15} />
              Contract assurance for modern teams
            </div>
            <h1 className="mt-7 max-w-3xl text-4xl font-black tracking-tight text-navy sm:text-5xl lg:text-7xl">
              Every Agreement. Protected.
            </h1>
            <p className="mt-5 max-w-2xl text-base font-medium leading-7 text-slate-600 sm:text-lg sm:leading-8">
              Pactora helps businesses manage contracts, milestones, changes, approvals, secure milestone payments, and trust in one connected platform.
            </p>
            <div className="mt-7 grid max-w-xl gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-slate-200 bg-cloud p-4">
                <p className="text-sm font-black text-slate-500">Cost exposure protected</p>
                <p className="mt-2 text-3xl font-black text-navy">$1.8M</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-cloud p-4">
                <p className="text-sm font-black text-slate-500">Timeline risk tracked</p>
                <p className="mt-2 text-3xl font-black text-navy">42 days</p>
              </div>
            </div>
            <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap">
              <Link href="/checkout?plan=starter" className="rounded-lg bg-purple px-5 py-3.5 text-center font-black text-white shadow-glow">
                Start Free
              </Link>
              <Link href="/demo" className="rounded-lg bg-white px-5 py-3.5 text-center font-black text-navy ring-1 ring-slate-200">
                Book a Demo
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-4 text-sm font-bold text-slate-600">
              {trustSignals.map((signal) => (
                <span key={signal} className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald" />
                  {signal}
                </span>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="relative rounded-lg border border-slate-200 bg-white p-3 shadow-glow sm:p-4">
              <div className="rounded-lg bg-navy p-5 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-white/58">Protected project value</p>
                    <p className="mt-1 text-3xl font-black">$1.8M</p>
                  </div>
                  <TrustScoreBadge score={94} />
                </div>
                <div className="mt-8 grid gap-3">
                  {projects.slice(0, 2).map((project) => (
                    <div key={project.id} className="rounded-lg bg-white p-4 text-navy">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="font-black">{project.name}</p>
                          <p className="text-sm font-semibold text-slate-500">{project.value}</p>
                        </div>
                        <StatusBadge status={project.status} />
                      </div>
                      <div className="mt-4 h-2 rounded-full bg-slate-100">
                        <div className="h-2 rounded-full bg-emerald" style={{ width: `${project.progress}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="rounded-lg bg-cloud p-4">
                  <p className="text-sm font-black text-navy">Time risk protected</p>
                  <p className="mt-2 text-sm font-semibold text-slate-600">42 delivery days monitored</p>
                </div>
                <div className="rounded-lg bg-cloud p-4">
                  <p className="text-sm font-black text-navy">Next milestone</p>
                  <p className="mt-2 text-sm font-semibold text-slate-600">{milestones[1].title}</p>
                </div>
                <div className="rounded-lg bg-purple p-4 text-white">
                  <p className="text-sm font-black">Change impact</p>
                  <p className="mt-2 text-sm font-semibold text-white/75">{changeRequests[0].impact}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="border-y border-slate-200 bg-white px-5 py-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5 text-sm font-black text-slate-500 lg:px-8">
          {["Trusted by operators", "SOC2-ready workflows", "Payment partner ready", "Business verification", "Dispute prevention"].map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </section>
      <section id="product" className="mx-auto max-w-7xl px-4 py-14 sm:px-5 sm:py-20 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-black uppercase tracking-wide text-purple">Product</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">A safer operating layer for commercial work.</h2>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <article key={feature.title} className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-purple/10 text-purple">
                <feature.icon size={20} />
              </span>
              <h3 className="mt-5 text-lg font-black">{feature.title}</h3>
              <p className="mt-3 text-sm font-medium leading-6 text-slate-600">{feature.text}</p>
            </article>
          ))}
        </div>
      </section>
      <section id="solutions" className="bg-navy px-5 py-20 text-white lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-black uppercase tracking-wide text-emerald">How it works</p>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {["Create a protected project", "Manage milestones and changes", "Approve work with confidence"].map((step, index) => (
              <article key={step} className="rounded-lg border border-white/10 bg-white/5 p-6">
                <p className="text-5xl font-black text-white/18">0{index + 1}</p>
                <h3 className="mt-5 text-xl font-black">{step}</h3>
                <p className="mt-3 text-sm font-medium leading-6 text-white/66">
                  Pactora records decisions, evidence, messages, and trust signals throughout the project lifecycle.
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section id="pricing" className="mx-auto max-w-7xl px-4 py-14 sm:px-5 sm:py-20 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-black uppercase tracking-wide text-purple">Pricing</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight">Plans for every agreement volume.</h2>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {pricingPlans.map((plan) => (
            <PricingCard key={plan.name} {...plan} featured={plan.name === "Business"} />
          ))}
        </div>
      </section>
      <PublicFooter />
    </main>
  );
}
