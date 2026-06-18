import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  Building2,
  CheckCircle2,
  ChevronRight,
  FileCheck2,
  GitPullRequest,
  Landmark,
  Layers3,
  LockKeyhole,
  MessageSquare,
  Route,
  ShieldCheck,
  Sparkles,
  Truck,
  WalletCards,
  WandSparkles
} from "lucide-react";
import { Header } from "@/components/Header";
import { PublicFooter } from "@/components/PublicFooter";
import { StatusBadge } from "@/components/StatusBadge";
import { TrustScoreBadge } from "@/components/TrustScoreBadge";
import type { Status } from "@/types";

const proofStats = [
  ["4 layers", "Cost, time, scope, and trust protection"],
  ["100%", "Action history captured in audit logs"],
  ["24/7", "Project visibility for both sides"]
];

const engineSteps = [
  {
    title: "Contract",
    eyebrow: "Agreement record",
    text: "Upload contracts, documents, acceptance terms, company details, insurance records, and project value in one place.",
    icon: FileCheck2
  },
  {
    title: "Milestones",
    eyebrow: "Progress control",
    text: "Split work into due dates, amounts, evidence, review states, approvals, revisions, and release readiness.",
    icon: CheckCircle2
  },
  {
    title: "Changes",
    eyebrow: "Scope governance",
    text: "Require cost and time impact before scope changes become approved work, delays, or disputes.",
    icon: GitPullRequest
  },
  {
    title: "Payments",
    eyebrow: "Release readiness",
    text: "Track held, released, and pending project cost while payment providers handle processing separately.",
    icon: WalletCards
  },
  {
    title: "Trust",
    eyebrow: "Business confidence",
    text: "Show verification, completion behavior, dispute history, and payment reliability as shared trust signals.",
    icon: ShieldCheck
  }
];

const solutionCards = [
  { title: "Shipment and logistics", icon: Truck, text: "Delivery windows, proof of shipment, carrier documents, delay records." },
  { title: "Agency and creative work", icon: WandSparkles, text: "Scopes, revision rounds, approvals, creative evidence, payment readiness." },
  { title: "Software delivery", icon: Layers3, text: "Build phases, QA proof, launch approvals, change requests, timeline extensions." },
  { title: "Finance and advisory", icon: Landmark, text: "Engagement letters, deliverables, approvals, compliance documents, audit trails." },
  { title: "Construction and field work", icon: Building2, text: "Change orders, site evidence, inspection records, materials approvals." },
  { title: "Procurement and vendors", icon: Banknote, text: "Vendor trust, purchase milestones, documentation, payment release coordination." }
];

const integrations = ["Supabase", "Resend", "DocuSign ready", "Plaid planned", "Stripe planned", "Vercel", "Audit exports", "Storage vault"];

const faqs = [
  ["Is Pactora an escrow service?", "No. Pactora provides contract assurance workflows and payment-readiness tracking. Payment processing is handled by third-party providers."],
  ["Can both clients and contractors use it?", "Yes. Clients manage approvals and protected value. Contractors submit work, evidence, changes, extensions, and messages."],
  ["What makes Pactora different from a normal project tool?", "Pactora is built around agreements: milestones, cost impact, time impact, trust scores, documents, disputes, and audit evidence."],
  ["Can I use Pactora during private beta?", "Yes. You can request a demo or create a beta account, then start with a protected project workflow."]
];

const dashboardMilestones: { title: string; status: Status; progress: string }[] = [
  { title: "Discovery and scope", status: "approved", progress: "100%" },
  { title: "Design milestone", status: "submitted", progress: "68%" },
  { title: "Launch readiness", status: "pending", progress: "24%" }
];

function MiniDashboard() {
  return (
    <div className="relative rounded-lg border border-slate-200 bg-white p-3 shadow-glow sm:p-4">
      <div className="rounded-lg bg-navy p-4 text-white sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-black text-emerald">Pactora Assurance Console</p>
            <h2 className="mt-2 text-2xl font-black">Website build agreement</h2>
          </div>
          <TrustScoreBadge score={86} />
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            ["Protected value", "$42,000"],
            ["Held amount", "$18,000"],
            ["Time risk", "12 days"]
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg bg-white/10 p-4">
              <p className="text-xs font-black uppercase tracking-wide text-white/48">{label}</p>
              <p className="mt-2 text-2xl font-black">{value}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-3">
          {dashboardMilestones.map((milestone) => (
            <div key={milestone.title} className="rounded-lg bg-cloud p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-black text-navy">{milestone.title}</p>
                <StatusBadge status={milestone.status} />
              </div>
              <div className="mt-4 h-2 rounded-full bg-white">
                <div className="h-2 rounded-full bg-emerald" style={{ width: milestone.progress }} />
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="font-black text-navy">Change impact review</p>
            <span className="rounded-full bg-purple/10 px-3 py-1 text-xs font-black text-purple">$4,800</span>
          </div>
          <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">
            Contractor requested 5 extra days for API changes. Client approval required before budget and due date update.
          </p>
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            <span className="rounded-lg bg-cloud px-3 py-2 text-sm font-black text-navy">+5 days</span>
            <span className="rounded-lg bg-cloud px-3 py-2 text-sm font-black text-navy">Awaiting client</span>
          </div>
          <div className="mt-5 rounded-lg bg-emerald/10 p-3 text-sm font-black text-emerald">
            Audit log ready
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <main className="bg-cloud text-navy">
      <Header />

      <section className="overflow-hidden bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-12 pt-10 sm:px-5 sm:pb-16 sm:pt-14 lg:grid-cols-[0.92fr_1.08fr] lg:px-8 lg:pb-24 lg:pt-20">
          <div className="flex flex-col justify-center">
            <Link href="/demo" className="inline-flex w-fit items-center gap-2 rounded-full bg-purple/10 px-3 py-1.5 text-sm font-black text-purple">
              <Sparkles size={15} />
              Private beta now open
              <ChevronRight size={15} />
            </Link>
            <h1 className="mt-7 max-w-3xl text-5xl font-black tracking-tight text-navy sm:text-6xl lg:text-7xl">
              Every Agreement. Protected.
            </h1>
            <p className="mt-5 max-w-2xl text-base font-semibold leading-7 text-slate-600 sm:text-lg sm:leading-8">
              Pactora is an AI-assisted contract assurance platform for managing agreements, milestones, scope changes, approvals, documents, payments readiness, disputes, and business trust signals.
            </p>
            <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap">
              <Link href="/signup" className="rounded-lg bg-purple px-5 py-3.5 text-center font-black text-white shadow-glow">
                Get Started Free
              </Link>
              <Link href="/demo" className="rounded-lg bg-cloud px-5 py-3.5 text-center font-black text-navy ring-1 ring-slate-200">
                Book a Demo
              </Link>
            </div>
            <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
              {proofStats.map(([value, label]) => (
                <div key={label} className="rounded-lg border border-slate-200 bg-cloud p-4">
                  <p className="text-2xl font-black text-navy">{value}</p>
                  <p className="mt-2 text-xs font-black leading-5 text-slate-500">{label}</p>
                </div>
              ))}
            </div>
          </div>
          <MiniDashboard />
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white px-4 py-6 sm:px-5 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 text-sm font-black text-slate-500">
          {["Contract assurance", "Milestone payments", "Change governance", "Trust verification", "Dispute prevention"].map((item) => (
            <span key={item} className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald" />
              {item}
            </span>
          ))}
        </div>
      </section>

      <section id="product" className="mx-auto max-w-7xl px-4 py-14 sm:px-5 sm:py-20 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-purple">AI-assisted assurance engine</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">One operating system from signature to closeout.</h2>
          </div>
          <p className="text-sm font-semibold leading-7 text-slate-600">
            Inspired by modern revenue platforms, Pactora brings the contract lifecycle into a clean, guided workflow where every decision can be reviewed later.
          </p>
        </div>
        <div className="mt-10 grid gap-5 lg:grid-cols-5">
          {engineSteps.map((step) => (
            <Link key={step.title} href="/solutions" className="group rounded-lg border border-slate-200 bg-white p-5 shadow-soft transition hover:-translate-y-1 hover:shadow-glow">
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-purple/10 text-purple transition group-hover:bg-purple group-hover:text-white">
                <step.icon size={20} />
              </span>
              <p className="mt-5 text-xs font-black uppercase tracking-wide text-slate-400">{step.eyebrow}</p>
              <h3 className="mt-2 text-lg font-black">{step.title}</h3>
              <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">{step.text}</p>
            </Link>
          ))}
        </div>
      </section>

      <section id="solutions" className="bg-navy px-4 py-14 text-white sm:px-5 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-[0.85fr_auto] lg:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-wide text-emerald">Solutions</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Built for contract-heavy work across industries.</h2>
              <p className="mt-4 max-w-3xl text-sm font-semibold leading-7 text-white/70">
                Use Pactora when the work has money at risk, time at risk, scope uncertainty, or trust questions between parties.
              </p>
            </div>
            <Link href="/solutions" className="rounded-lg bg-white px-5 py-3.5 text-center font-black text-navy">
              See all solutions
            </Link>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {solutionCards.map((solution) => (
              <Link key={solution.title} href="/solutions" className="group rounded-lg border border-white/10 bg-white/5 p-5 transition hover:-translate-y-1 hover:bg-white/10">
                <solution.icon className="text-emerald" size={24} />
                <h3 className="mt-5 text-xl font-black">{solution.title}</h3>
                <p className="mt-3 text-sm font-semibold leading-6 text-white/68">{solution.text}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-emerald">
                  Explore workflow <ArrowRight size={16} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-5 sm:py-20 lg:px-8">
        <div className="grid gap-8 rounded-lg border border-slate-200 bg-white p-5 shadow-soft sm:p-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-purple">Fits your stack</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Designed to connect with the tools businesses already trust.</h2>
            <p className="mt-4 text-sm font-semibold leading-7 text-slate-600">
              Pactora is backend-ready for authentication, notifications, storage, signatures, verification, and future payment-provider workflows.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {integrations.map((item) => (
              <div key={item} className="rounded-lg bg-cloud px-4 py-5 text-center text-sm font-black text-navy transition hover:-translate-y-1 hover:bg-purple hover:text-white">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-14 sm:px-5 sm:py-20 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-purple">Private beta feedback</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">A calmer way to keep agreements clear after the signature.</h2>
            <p className="mt-4 text-sm font-semibold leading-7 text-slate-600">
              Pactora is shaped for teams that need fewer scattered files, fewer unclear approvals, and fewer end-of-project surprises.
            </p>
          </div>
          <div className="rounded-lg bg-cloud p-5 sm:p-6">
            <MessageSquare className="text-purple" size={24} />
            <blockquote className="mt-5 text-2xl font-black leading-tight text-navy">
              “This is the workflow we wanted between the contract, change orders, payment holds, and proof of work.”
            </blockquote>
            <p className="mt-5 text-sm font-black text-slate-500">Beta customer interview · Service business operator</p>
          </div>
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-7xl px-4 py-14 sm:px-5 sm:py-20 lg:px-8">
        <div className="grid gap-6 rounded-lg border border-slate-200 bg-white p-5 shadow-soft sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-purple">Pricing</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Start where you are. Scale as your agreement volume grows.</h2>
            <p className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-slate-600">
              Private-beta plans support one agreement, growing agencies, business teams, and enterprise workflows.
            </p>
          </div>
          <div className="grid gap-3 sm:flex sm:flex-wrap lg:justify-end">
            <Link href="/pricing" className="rounded-lg bg-purple px-5 py-3.5 text-center font-black text-white shadow-glow">
              View pricing
            </Link>
            <Link href="/checkout?plan=starter" className="rounded-lg bg-cloud px-5 py-3.5 text-center font-black text-navy ring-1 ring-slate-200">
              Start free
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-5 sm:pb-20 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-2">
          {faqs.map(([question, answer]) => (
            <details key={question} className="group rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-black">
                {question}
                <ArrowRight className="shrink-0 text-purple transition group-open:rotate-90" size={18} />
              </summary>
              <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="bg-navy px-4 py-14 text-white sm:px-5 sm:py-20 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm font-black text-emerald">
              <LockKeyhole size={15} />
              Private beta
            </div>
            <h2 className="mt-5 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">
              Protect your next agreement before the first change request.
            </h2>
          </div>
          <Link href="/demo" className="rounded-lg bg-white px-5 py-3.5 text-center font-black text-navy">
            Book a demo
          </Link>
        </div>
      </section>

      <PublicFooter />
    </main>
  );
}
