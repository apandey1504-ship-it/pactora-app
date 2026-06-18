import Link from "next/link";
import { Header } from "@/components/Header";
import { PricingCard } from "@/components/PricingCard";
import { pricingPlans } from "@/lib/pricing";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-cloud text-navy">
      <Header />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-5 sm:py-16 lg:px-8">
        <p className="text-sm font-black uppercase tracking-wide text-purple">Pricing</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">Beta pricing for protected agreements.</h1>
        <p className="mt-5 max-w-2xl text-base font-medium leading-7 text-slate-600 sm:text-lg sm:leading-8">
          Start with project assurance, then scale into secure milestone payment coordination, verification, audit controls, disputes, and trust-score operations.
        </p>
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {pricingPlans.map((plan) => (
            <PricingCard
              key={plan.name}
              {...plan}
              featured={plan.name === "Business"}
              href={plan.slug === "enterprise" ? "/contact" : `/checkout?plan=${plan.slug}`}
            />
          ))}
        </div>
        <section className="mt-10 rounded-lg border border-slate-200 bg-white p-5 shadow-soft sm:mt-12 sm:p-6">
          <p className="text-sm font-black uppercase tracking-wide text-purple">Transaction & Payment Fees</p>
          <h2 className="mt-3 text-2xl font-black tracking-tight text-navy sm:text-3xl">Pactora Secure Milestone Payments™</h2>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <div className="rounded-lg bg-cloud p-5">
              <p className="font-black text-navy">Pactora Platform Fee</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">3% on funded milestones for Starter/Pro, 2% for Business, and custom volume pricing for Enterprise.</p>
            </div>
            <div className="rounded-lg bg-cloud p-5">
              <p className="font-black text-navy">Payment Processing Fee</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">Processing fees are charged by the payment provider and passed through separately.</p>
            </div>
            <div className="rounded-lg bg-cloud p-5">
              <p className="font-black text-navy">Example</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">$10,000 project value × 3% Pactora fee = $300, plus payment provider processing fees.</p>
            </div>
          </div>
          <p className="mt-5 text-sm font-semibold leading-6 text-slate-500">
            Payment processing fees vary by country, payment method, and payment provider. Pactora platform fees are separate from payment provider charges.
          </p>
        </section>
        <section className="mt-8 rounded-lg bg-navy p-6 text-white shadow-soft">
          <p className="text-sm font-black uppercase tracking-wide text-emerald">Payment positioning</p>
          <p className="mt-3 max-w-4xl text-sm font-semibold leading-7 text-white/72">
            Funds are processed through trusted payment partners. Pactora provides workflow, approval, audit, and dispute documentation around milestone payments. Pactora is not a bank, money transmitter, insurer, or escrow agent in the MVP.
          </p>
        </section>
        <Link href="/signup" className="mt-10 inline-flex w-full justify-center rounded-lg bg-purple px-5 py-3.5 font-black text-white shadow-glow sm:w-auto">
          Join private beta
        </Link>
      </section>
    </main>
  );
}
