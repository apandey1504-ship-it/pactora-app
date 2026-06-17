import Link from "next/link";
import { Header } from "@/components/Header";
import { PricingCard } from "@/components/PricingCard";
import { pricingPlans } from "@/lib/pricing";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-cloud text-navy">
      <Header />
      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <p className="text-sm font-black uppercase tracking-wide text-purple">Pricing</p>
        <h1 className="mt-3 max-w-3xl text-5xl font-black tracking-tight">Beta pricing for protected agreements.</h1>
        <p className="mt-5 max-w-2xl text-lg font-medium leading-8 text-slate-600">
          Start with project assurance, then scale into verification, audit controls, disputes, and trust-score operations.
        </p>
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {pricingPlans.map((plan) => (
            <PricingCard key={plan.name} {...plan} featured={plan.name === "Business"} />
          ))}
        </div>
        <Link href="/signup" className="mt-10 inline-flex rounded-lg bg-purple px-5 py-3.5 font-black text-white shadow-glow">
          Join private beta
        </Link>
      </section>
    </main>
  );
}
