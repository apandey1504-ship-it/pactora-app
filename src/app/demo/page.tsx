"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CalendarCheck, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/Logo";

const categories = [
  "Shipment and logistics",
  "Agency work",
  "Software project",
  "Finance and advisory",
  "Construction or field work",
  "Marketing and creative",
  "Operations consulting",
  "Other contract work"
];

export default function DemoPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.get("fullName"),
          email: form.get("email"),
          company: form.get("company"),
          phone: form.get("phone"),
          role: form.get("role"),
          projectCategory: form.get("projectCategory"),
          projectValue: form.get("projectValue"),
          message: form.get("message")
        })
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Demo request could not be sent.");
      }

      setMessage("Demo request received. Our team will email you to schedule the call.");
      event.currentTarget.reset();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Demo request could not be sent.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen bg-cloud lg:grid-cols-[1fr_0.9fr]">
      <section className="flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-xl rounded-lg border border-slate-200 bg-white p-8 shadow-soft">
          <Logo />
          <Link href="/" className="mt-8 inline-flex items-center gap-2 text-sm font-black text-purple">
            <ArrowLeft size={16} />
            Back to Pactora
          </Link>
          <h1 className="mt-6 text-4xl font-black tracking-tight text-navy">Book a Pactora demo</h1>
          <p className="mt-3 text-sm font-semibold leading-6 text-slate-500">
            Tell us what kind of agreements you want to protect. We will email you to schedule a call.
          </p>
          <form className="mt-8 grid gap-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-bold text-navy">Full name</span>
                <input name="fullName" required className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-purple focus:ring-4 focus:ring-purple/10" />
              </label>
              <label className="block">
                <span className="text-sm font-bold text-navy">Work email</span>
                <input name="email" type="email" required className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-purple focus:ring-4 focus:ring-purple/10" />
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-bold text-navy">Company</span>
                <input name="company" className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-purple focus:ring-4 focus:ring-purple/10" />
              </label>
              <label className="block">
                <span className="text-sm font-bold text-navy">Phone</span>
                <input name="phone" inputMode="tel" className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-purple focus:ring-4 focus:ring-purple/10" />
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-bold text-navy">I am a</span>
                <select name="role" className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-purple focus:ring-4 focus:ring-purple/10">
                  <option>Client</option>
                  <option>Contractor</option>
                  <option>Both</option>
                </select>
              </label>
              <label className="block">
                <span className="text-sm font-bold text-navy">Project category</span>
                <select name="projectCategory" className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-purple focus:ring-4 focus:ring-purple/10">
                  {categories.map((category) => <option key={category}>{category}</option>)}
                </select>
              </label>
            </div>
            <label className="block">
              <span className="text-sm font-bold text-navy">Expected project value</span>
              <input name="projectValue" placeholder="$10,000 - $250,000" className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-purple focus:ring-4 focus:ring-purple/10" />
            </label>
            <label className="block">
              <span className="text-sm font-bold text-navy">What should we help protect?</span>
              <textarea name="message" rows={4} className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-purple focus:ring-4 focus:ring-purple/10" />
            </label>
            {message ? <p className="rounded-lg bg-emerald/10 p-3 text-sm font-bold text-emerald">{message}</p> : null}
            {error ? <p className="rounded-lg bg-rose-50 p-3 text-sm font-bold text-rose-700">{error}</p> : null}
            <button disabled={loading} className="rounded-lg bg-purple px-5 py-3.5 font-black text-white shadow-glow disabled:opacity-50">
              {loading ? "Sending request" : "Request demo call"}
            </button>
          </form>
        </div>
      </section>
      <section className="hidden bg-navy p-10 text-white lg:block">
        <div className="flex h-full flex-col justify-between rounded-lg border border-white/10 bg-white/5 p-8">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-emerald">Private beta</p>
            <h2 className="mt-5 max-w-md text-5xl font-black tracking-tight">
              See how cost, time, scope, and trust protection works.
            </h2>
          </div>
          <div className="grid gap-4">
            {[
              ["Milestone review", "Walk through approvals, revisions, and release readiness."],
              ["Change governance", "See how cost and time changes become auditable."],
              ["Trust signals", "Review company verification, audit logs, and risk context."]
            ].map(([title, body]) => (
              <div key={title} className="rounded-lg bg-white/10 p-4">
                <div className="flex items-center gap-2 text-sm font-black">
                  {title === "Trust signals" ? <ShieldCheck size={17} /> : <CalendarCheck size={17} />}
                  {title}
                </div>
                <p className="mt-2 text-sm font-semibold leading-6 text-white/70">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
