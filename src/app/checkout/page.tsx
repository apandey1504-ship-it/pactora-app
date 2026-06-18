import Link from "next/link";
import { CheckCircle2, CreditCard, ShieldCheck } from "lucide-react";
import { Header } from "@/components/Header";
import { getPricingPlan, pricingPlans } from "@/lib/pricing";

export default function CheckoutPage({
  searchParams
}: {
  searchParams?: { plan?: string; role?: string };
}) {
  const plan = getPricingPlan(searchParams?.plan);
  const projectValue = 10000;
  const platformFee = plan.transactionFeePercent === null ? null : Math.round(projectValue * (plan.transactionFeePercent / 100));
  const role = searchParams?.role === "contractor" ? "contractor" : "client";

  return (
    <main className="min-h-screen bg-cloud text-navy">
      <Header />
      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:px-5 sm:py-14 lg:grid-cols-[1fr_380px] lg:px-8">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
          <p className="text-sm font-black uppercase tracking-wide text-purple">Checkout preview</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Start {plan.name}</h1>
          <p className="mt-3 max-w-2xl text-sm font-semibold leading-7 text-slate-600">
            Select your Pactora subscription for beta access. Real card collection will connect through Stripe or another trusted payment partner before public launch.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {pricingPlans.map((item) => (
              <Link
                key={item.slug}
                href={`/checkout?plan=${item.slug}&role=${role}`}
                className={`rounded-lg border p-4 transition hover:-translate-y-0.5 ${
                  item.slug === plan.slug ? "border-purple bg-purple/10" : "border-slate-200 bg-cloud"
                }`}
              >
                <p className="font-black text-navy">{item.name}</p>
                <p className="mt-1 text-sm font-bold text-slate-500">{item.price}</p>
              </Link>
            ))}
          </div>

          <div className="mt-8 rounded-lg border border-slate-200 bg-cloud p-5">
            <div className="flex items-center gap-2">
              <CreditCard size={20} className="text-purple" />
              <h2 className="text-lg font-black text-navy">Transaction fee example</h2>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <div className="rounded-lg bg-white p-4">
                <p className="text-xs font-black uppercase tracking-wide text-slate-500">Project value</p>
                <p className="mt-1 text-2xl font-black text-navy">$10,000</p>
              </div>
              <div className="rounded-lg bg-white p-4">
                <p className="text-xs font-black uppercase tracking-wide text-slate-500">Pactora fee</p>
                <p className="mt-1 text-2xl font-black text-navy">{platformFee === null ? "Custom" : `$${platformFee}`}</p>
              </div>
              <div className="rounded-lg bg-white p-4">
                <p className="text-xs font-black uppercase tracking-wide text-slate-500">Processing fee</p>
                <p className="mt-1 text-2xl font-black text-navy">Pass-through</p>
              </div>
            </div>
            <p className="mt-4 text-sm font-semibold leading-6 text-slate-500">
              Payment processing fees vary by country, payment method, and provider. Pactora platform fees are separate from provider charges.
            </p>
          </div>

          <div className="mt-8 rounded-lg bg-navy p-5 text-white">
            <p className="font-black">Legal-safe payment model</p>
            <p className="mt-2 text-sm font-semibold leading-6 text-white/70">
              Pactora coordinates milestone payment workflows through third-party payment providers. Pactora does not directly hold funds and is not a bank, money transmitter, insurer, or escrow agent in the MVP.
            </p>
          </div>
        </div>

        <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
          <ShieldCheck className="text-purple" size={28} />
          <h2 className="mt-4 text-2xl font-black text-navy">{plan.name}</h2>
          <p className="mt-1 text-3xl font-black text-navy">{plan.price}</p>
          <p className="mt-3 text-sm font-semibold leading-6 text-slate-500">{plan.description}</p>
          <ul className="mt-5 space-y-3">
            {plan.features.slice(0, 7).map((feature) => (
              <li key={feature} className="flex gap-2 text-sm font-bold text-slate-600">
                <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-emerald" />
                {feature}
              </li>
            ))}
          </ul>
          <div className="mt-6 grid gap-3">
            <Link
              href={`/signup/${role}?plan=${plan.slug}`}
              className="rounded-lg bg-purple px-4 py-3 text-center text-sm font-black text-white shadow-glow"
            >
              Continue to {role} signup
            </Link>
            <Link href="/contact" className="rounded-lg bg-cloud px-4 py-3 text-center text-sm font-black text-navy">
              Talk to sales
            </Link>
          </div>
        </aside>
      </section>
    </main>
  );
}
