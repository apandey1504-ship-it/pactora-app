"use client";

import { useMemo, useState } from "react";
import { Calculator, ShieldCheck } from "lucide-react";
import { pricingPlans } from "@/lib/pricing";

const selectablePlans = pricingPlans.filter((plan) => plan.transactionFeePercent !== null);

export function PricingCalculator() {
  const [projectValue, setProjectValue] = useState(25000);
  const [planSlug, setPlanSlug] = useState(selectablePlans[1]?.slug ?? "pro");

  const selectedPlan = useMemo(
    () => selectablePlans.find((plan) => plan.slug === planSlug) ?? selectablePlans[0],
    [planSlug]
  );
  const platformFee = Math.round(projectValue * ((selectedPlan.transactionFeePercent ?? 0) / 100));
  const protectedValue = Math.max(projectValue - platformFee, 0);

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft sm:p-6 lg:p-8">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-purple">
            <Calculator size={18} />
            Pricing calculator
          </div>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-navy">Estimate protected project economics.</h2>
          <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">
            Use this private-beta estimate to understand Pactora platform fees. Payment provider fees are separate and vary by method and country.
          </p>
        </div>

        <div className="rounded-lg bg-cloud p-4 sm:p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-bold text-navy">Plan</span>
              <select
                value={planSlug}
                onChange={(event) => setPlanSlug(event.target.value as typeof planSlug)}
                className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 font-bold text-navy outline-none focus:border-purple focus:ring-4 focus:ring-purple/10"
              >
                {selectablePlans.map((plan) => (
                  <option key={plan.slug} value={plan.slug}>
                    {plan.name} · {plan.transactionFeePercent}% fee
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-bold text-navy">Project value</span>
              <input
                value={projectValue}
                onChange={(event) => setProjectValue(Number(event.target.value))}
                type="number"
                min={1000}
                step={1000}
                className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 font-bold text-navy outline-none focus:border-purple focus:ring-4 focus:ring-purple/10"
              />
            </label>
          </div>
          <input
            aria-label="Project value"
            type="range"
            min={1000}
            max={250000}
            step={1000}
            value={projectValue}
            onChange={(event) => setProjectValue(Number(event.target.value))}
            className="mt-6 w-full accent-purple"
          />
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg bg-white p-4">
              <p className="text-xs font-black uppercase tracking-wide text-slate-400">Project value</p>
              <p className="mt-2 text-2xl font-black text-navy">${projectValue.toLocaleString()}</p>
            </div>
            <div className="rounded-lg bg-white p-4">
              <p className="text-xs font-black uppercase tracking-wide text-slate-400">Pactora fee</p>
              <p className="mt-2 text-2xl font-black text-navy">${platformFee.toLocaleString()}</p>
            </div>
            <div className="rounded-lg bg-navy p-4 text-white">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-emerald">
                <ShieldCheck size={15} />
                Coordinated
              </div>
              <p className="mt-2 text-2xl font-black">${protectedValue.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
