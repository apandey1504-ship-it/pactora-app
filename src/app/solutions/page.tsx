import Link from "next/link";
import {
  ArrowRight,
  BadgeDollarSign,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Code2,
  FileCheck2,
  GitPullRequest,
  Landmark,
  Layers3,
  MessageSquareWarning,
  ShieldCheck,
  Truck,
  WalletCards,
  WandSparkles
} from "lucide-react";
import { Header } from "@/components/Header";
import { PublicFooter } from "@/components/PublicFooter";

const solutions = [
  {
    title: "Shipment and logistics",
    icon: Truck,
    signal: "Delivery windows, carrier evidence, penalties, proof of completion",
    examples: ["Freight milestones", "Customs paperwork", "Delay documentation"]
  },
  {
    title: "Agency and creative work",
    icon: WandSparkles,
    signal: "Scopes, revisions, approval rounds, brand deliverables",
    examples: ["Creative retainers", "Campaign launches", "Revision control"]
  },
  {
    title: "Software delivery",
    icon: Code2,
    signal: "Build milestones, QA evidence, scope changes, release approvals",
    examples: ["SaaS builds", "Automation projects", "App delivery"]
  },
  {
    title: "Finance and advisory",
    icon: Landmark,
    signal: "Engagement documents, approvals, payment readiness, audit trails",
    examples: ["Advisory work", "Operational reviews", "Finance projects"]
  },
  {
    title: "Professional services",
    icon: BriefcaseBusiness,
    signal: "Statement of work, milestones, client approvals, evidence",
    examples: ["Consulting", "Implementation", "Training"]
  },
  {
    title: "Construction and field work",
    icon: Building2,
    signal: "Change orders, site evidence, delay claims, project holds",
    examples: ["Renovation phases", "Materials approval", "Inspection proof"]
  },
  {
    title: "Procurement and vendors",
    icon: BadgeDollarSign,
    signal: "Vendor trust, delivery milestones, payment release coordination",
    examples: ["Supplier contracts", "Purchase orders", "Vendor onboarding"]
  },
  {
    title: "Complex contract work",
    icon: Layers3,
    signal: "Money, time, scope, documents, and trust signals in one record",
    examples: ["Hybrid work", "Long projects", "Multi-party agreements"]
  }
];

const workflow = [
  {
    title: "Set the protected agreement",
    text: "Create the project, attach contract documents, choose category, invite the other party, and define project value and timeline.",
    icon: FileCheck2
  },
  {
    title: "Break work into milestones",
    text: "Track delivery stages, amounts, due dates, evidence, approvals, revisions, and payment release readiness.",
    icon: CheckCircle2
  },
  {
    title: "Govern scope changes",
    text: "Capture cost impact, time impact, approvals, rejection reasons, and audit history before changes create confusion.",
    icon: GitPullRequest
  },
  {
    title: "Prevent disputes early",
    text: "Keep messages, documents, approvals, insurance details, verification status, and audit logs organized in one place.",
    icon: MessageSquareWarning
  }
];

const protectionLayers = [
  ["Cost protection", "Project value, holds, releases, change impact, and payment readiness stay visible."],
  ["Time protection", "Due dates, extensions, delays, and revision loops stay attached to the project record."],
  ["Scope protection", "Requested changes require cost and time impact before approval."],
  ["Trust protection", "Company verification, audit behavior, disputes, and completion signals feed confidence."]
];

export default function SolutionsPage() {
  return (
    <main className="min-h-screen bg-cloud text-navy">
      <Header />

      <section className="overflow-hidden bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-5 sm:py-16 lg:grid-cols-[0.95fr_1.05fr] lg:px-8 lg:py-20">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-purple">Solutions</p>
            <h1 className="mt-3 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              Contract assurance for work where money, time, and trust matter.
            </h1>
            <p className="mt-5 max-w-2xl text-base font-semibold leading-7 text-slate-600 sm:text-lg sm:leading-8">
              Pactora helps clients and contractors protect agreements across shipments, agencies, software, finance, procurement, construction, and professional services.
            </p>
            <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap">
              <Link href="/signup" className="rounded-lg bg-purple px-5 py-3.5 text-center font-black text-white shadow-glow">
                Start protecting work
              </Link>
              <Link href="/demo" className="rounded-lg bg-cloud px-5 py-3.5 text-center font-black text-navy ring-1 ring-slate-200">
                Book a demo
              </Link>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-cloud p-4 shadow-soft sm:p-5">
            <div className="rounded-lg bg-navy p-5 text-white">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-black text-white/60">Protected operating layer</p>
                  <p className="mt-2 text-3xl font-black">Agreement Command Center</p>
                </div>
                <ShieldCheck className="text-emerald" size={34} />
              </div>
              <div className="mobile-scrollbar -mx-5 mt-6 flex snap-x gap-3 overflow-x-auto px-5 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0">
                {protectionLayers.map(([title, text]) => (
                  <div key={title} className="min-w-[230px] snap-start rounded-lg bg-white/10 p-4 sm:min-w-0">
                    <p className="font-black">{title}</p>
                    <p className="mt-2 text-sm font-semibold leading-6 text-white/68">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-5 sm:py-16 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-black uppercase tracking-wide text-purple">Use cases</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Choose the category, then Pactora adapts the assurance workflow.</h2>
        </div>
        <div className="mobile-scrollbar -mx-4 mt-10 flex snap-x gap-4 overflow-x-auto px-4 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 xl:grid-cols-4">
          {solutions.map((solution) => (
            <article key={solution.title} className="group min-w-[275px] snap-start rounded-lg border border-slate-200 bg-white p-5 shadow-soft transition hover:-translate-y-1 hover:shadow-glow md:min-w-0">
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-purple/10 text-purple transition group-hover:bg-purple group-hover:text-white">
                <solution.icon size={21} />
              </span>
              <h3 className="mt-5 text-lg font-black">{solution.title}</h3>
              <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">{solution.signal}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {solution.examples.map((example) => (
                  <span key={example} className="rounded-full bg-cloud px-3 py-1 text-xs font-black text-slate-500">
                    {example}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-navy px-4 py-12 text-white sm:px-5 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-wide text-emerald">Workflow</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">From contract to closeout, every major action becomes traceable.</h2>
          </div>
          <div className="mobile-scrollbar -mx-4 mt-10 flex snap-x gap-4 overflow-x-auto px-4 lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0">
            {workflow.map((step, index) => (
              <article key={step.title} className="min-w-[275px] snap-start rounded-lg border border-white/10 bg-white/5 p-5 lg:min-w-0">
                <div className="flex items-center justify-between gap-4">
                  <span className="grid h-11 w-11 place-items-center rounded-lg bg-white/10 text-emerald">
                    <step.icon size={20} />
                  </span>
                  <span className="text-4xl font-black text-white/16">0{index + 1}</span>
                </div>
                <h3 className="mt-6 text-lg font-black">{step.title}</h3>
                <p className="mt-3 text-sm font-semibold leading-6 text-white/68">{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-5 sm:py-16 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-purple">For both sides</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight">Clients and contractors get a shared source of truth.</h2>
            <p className="mt-4 text-sm font-semibold leading-7 text-slate-600">
              Clients get approval control and protected visibility. Contractors get clearer scope, better evidence records, and fewer payment disputes.
            </p>
          </div>
          <div className="mobile-scrollbar -mx-4 flex snap-x gap-4 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0">
            {[
              ["Client view", "Create projects, invite contractors, approve milestones, govern changes, review trust signals."],
              ["Contractor view", "Accept projects, submit work, request extensions, respond to changes, upload evidence."],
              ["Admin view", "Verify companies, review disputes, freeze projects, inspect audit logs, delegate staff access."],
              ["Payment view", "Track project cost, held value, released value, and payment readiness without adding Stripe yet."]
            ].map(([title, text]) => (
              <div key={title} className="min-w-[270px] snap-start rounded-lg border border-slate-200 bg-white p-5 shadow-soft sm:min-w-0">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-black">{title}</p>
                  <ArrowRight className="text-purple" size={18} />
                </div>
                <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-5 sm:pb-16 lg:px-8">
        <div className="grid gap-5 rounded-lg border border-slate-200 bg-white p-5 shadow-soft sm:p-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-purple">Private beta</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight">See Pactora on your actual contract flow.</h2>
            <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">
              Bring one project example and we will show how milestones, changes, messages, documents, trust, and payment readiness fit together.
            </p>
          </div>
          <Link href="/demo" className="rounded-lg bg-purple px-5 py-3.5 text-center font-black text-white shadow-glow">
            Book a demo
          </Link>
        </div>
      </section>

      <PublicFooter />
    </main>
  );
}
