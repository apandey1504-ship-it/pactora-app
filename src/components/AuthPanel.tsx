"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAuthProfile, getDashboardPathForRole, loginWithPassword, signUpWithProfile } from "@/lib/auth";
import { getPricingPlan, pricingPlans } from "@/lib/pricing";
import { isSupabaseConfigured } from "@/lib/supabase";
import type { UserRole } from "@/types/database";
import { Logo } from "./Logo";

function getDisplayError(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof error === "object" && error && "message" in error && typeof error.message === "string") {
    return error.message;
  }

  return "Authentication failed. If you have not signed up yet, create an account first.";
}

export function AuthPanel({
  mode,
  defaultRole = "client",
  lockedRole,
  portalLabel
}: {
  mode: "login" | "signup";
  defaultRole?: UserRole;
  lockedRole?: Exclude<UserRole, "admin" | "arbitrator">;
  portalLabel?: string;
}) {
  const isSignup = mode === "signup";
  const router = useRouter();
  const initialPlan = getPricingPlan(
    typeof window === "undefined" ? null : new URLSearchParams(window.location.search).get("plan")
  );
  const [role, setRole] = useState<UserRole>(lockedRole ?? defaultRole);
  const [planSlug, setPlanSlug] = useState(initialPlan.slug);
  const [countryCode, setCountryCode] = useState("+1");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (isSignup) {
        await signUpWithProfile({
          fullName: String(form.get("fullName") ?? ""),
          email: String(form.get("email") ?? ""),
          password: String(form.get("password") ?? ""),
          phone: String(form.get("phone") ?? ""),
          countryCode,
          country: String(form.get("country") ?? "US"),
          role,
          planSlug
        });
        setMessage("Account created. If email confirmation is enabled, confirm your email before logging in.");
        router.push(getDashboardPathForRole(role));
      } else {
        await loginWithPassword(String(form.get("email") ?? ""), String(form.get("password") ?? ""));
        const profile = await getAuthProfile();
        router.push(getDashboardPathForRole(profile?.role));
      }
    } catch (authError) {
      setError(getDisplayError(authError));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen bg-cloud lg:grid-cols-[1fr_0.9fr]">
      <section className="flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-soft">
          <Logo />
          <h1 className="mt-10 text-3xl font-black tracking-tight text-navy">
            {isSignup ? "Create your Pactora workspace" : "Welcome back"}
          </h1>
          <p className="mt-3 text-sm font-semibold leading-6 text-slate-500">
            {isSignup
              ? "Start protecting agreements with milestone approvals, scoped changes, and trust scoring."
              : "Sign in to review projects, approvals, payments, messages, and trust signals."}
          </p>
          {portalLabel ? (
            <p className="mt-4 inline-flex rounded-full bg-purple/10 px-3 py-1 text-xs font-black uppercase tracking-wide text-purple">
              {portalLabel}
            </p>
          ) : null}
          {!isSupabaseConfigured ? (
            <p className="mt-5 rounded-lg bg-amber-50 p-3 text-sm font-bold leading-6 text-amber-800">
              Supabase is not connected yet. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`, then restart the app.
            </p>
          ) : null}
          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            {isSignup ? (
              <>
                <label className="block">
                  <span className="text-sm font-bold text-navy">Full name</span>
                  <input name="fullName" required className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-purple focus:ring-4 focus:ring-purple/10" />
                </label>
                <div>
                  <span className="text-sm font-bold text-navy">Mobile</span>
                  <div className="mt-2 grid grid-cols-[120px_1fr] gap-2">
                    <select
                      name="country"
                      value={countryCode === "+91" ? "IN" : countryCode === "+44" ? "GB" : countryCode === "+61" ? "AU" : "US"}
                      onChange={(event) => {
                        const nextCode = event.target.value === "IN" ? "+91" : event.target.value === "GB" ? "+44" : event.target.value === "AU" ? "+61" : "+1";
                        setCountryCode(nextCode);
                      }}
                      className="rounded-lg border border-slate-200 px-3 py-3 text-sm font-bold text-navy outline-none focus:border-purple focus:ring-4 focus:ring-purple/10"
                    >
                      <option value="US">US +1</option>
                      <option value="IN">IN +91</option>
                      <option value="GB">UK +44</option>
                      <option value="AU">AU +61</option>
                    </select>
                    <input name="phone" inputMode="tel" placeholder="Mobile number" className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-purple focus:ring-4 focus:ring-purple/10" />
                  </div>
                </div>
                {lockedRole ? (
                  <div className="rounded-lg bg-cloud p-4">
                    <p className="text-sm font-bold text-slate-500">Account type</p>
                    <p className="mt-1 text-lg font-black capitalize text-navy">{lockedRole}</p>
                  </div>
                ) : (
                  <label className="block">
                    <span className="text-sm font-bold text-navy">Role</span>
                    <select
                      value={role}
                      onChange={(event) => setRole(event.target.value as UserRole)}
                      className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-purple focus:ring-4 focus:ring-purple/10"
                    >
                      <option value="client">Client</option>
                      <option value="contractor">Contractor</option>
                    </select>
                  </label>
                )}
                <label className="block">
                  <span className="text-sm font-bold text-navy">Plan</span>
                  <select
                    value={planSlug}
                    onChange={(event) => setPlanSlug(event.target.value as typeof planSlug)}
                    className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-purple focus:ring-4 focus:ring-purple/10"
                  >
                    {pricingPlans.map((plan) => (
                      <option key={plan.slug} value={plan.slug}>{plan.name} · {plan.price}</option>
                    ))}
                  </select>
                  <Link href={`/checkout?plan=${planSlug}&role=${lockedRole ?? role}`} className="mt-2 inline-flex text-xs font-black text-purple">
                    View checkout and payment fees
                  </Link>
                </label>
              </>
            ) : null}
            <label className="block">
              <span className="text-sm font-bold text-navy">Work email</span>
              <input
                name="email"
                type="email"
                required
                className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-purple focus:ring-4 focus:ring-purple/10"
              />
            </label>
            <label className="block">
              <span className="text-sm font-bold text-navy">Password</span>
              <input
                name="password"
                type="password"
                required
                minLength={6}
                className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-purple focus:ring-4 focus:ring-purple/10"
              />
            </label>
            {error ? (
              <div className="rounded-lg bg-rose-50 p-3 text-sm font-bold leading-6 text-rose-700">
                <p>{error}</p>
                {!isSignup ? (
                  <p className="mt-2">
                    New account? <Link href="/signup" className="underline">Sign up first</Link>. If you already signed up, check whether Supabase email confirmation is required.
                  </p>
                ) : null}
              </div>
            ) : null}
            {message ? <p className="rounded-lg bg-emerald/10 p-3 text-sm font-bold text-emerald">{message}</p> : null}
            <button disabled={loading || !isSupabaseConfigured} className="w-full rounded-lg bg-purple px-5 py-3.5 font-black text-white shadow-glow disabled:opacity-50">
              {loading ? "Please wait" : isSignup ? "Create account" : "Login"}
            </button>
          </form>
          {!isSignup ? (
            <div className="mt-4 grid gap-2">
              <Link href="/forgot-password" className="rounded-lg bg-cloud px-4 py-3 text-center text-sm font-black text-navy">
                Forgot password? Send reset link
              </Link>
              <Link href="/reset-password" className="text-center text-sm font-bold text-purple">
                Already have a reset link?
              </Link>
            </div>
          ) : null}
          <p className="mt-6 text-center text-sm font-semibold text-slate-500">
            {isSignup ? "Already have an account?" : "New to Pactora?"}{" "}
            <Link href={isSignup ? "/login" : "/signup"} className="font-black text-purple">
              {isSignup ? "Login" : "Get started"}
            </Link>
          </p>
          {isSignup ? (
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <Link href="/signup/client" className="rounded-lg bg-cloud px-4 py-3 text-center text-sm font-black text-navy">Client signup</Link>
              <Link href="/signup/contractor" className="rounded-lg bg-cloud px-4 py-3 text-center text-sm font-black text-navy">Contractor signup</Link>
            </div>
          ) : (
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <Link href="/login/client" className="rounded-lg bg-cloud px-3 py-2 text-center text-xs font-black text-navy">Client login</Link>
              <Link href="/login/contractor" className="rounded-lg bg-cloud px-3 py-2 text-center text-xs font-black text-navy">Contractor login</Link>
            </div>
          )}
        </div>
      </section>
      <section className="hidden bg-navy p-10 text-white lg:block">
        <div className="flex h-full flex-col justify-between rounded-lg border border-white/10 bg-white/5 p-8">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-emerald">Contract assurance</p>
            <h2 className="mt-5 max-w-md text-5xl font-black tracking-tight">
              Agreements stay clear after the signature.
            </h2>
          </div>
          <div className="grid gap-4">
            {["Scope changes tracked", "Milestone payments protected", "Dispute risk reduced"].map((item) => (
              <div key={item} className="rounded-lg bg-white/10 p-4 text-sm font-bold">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
