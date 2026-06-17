"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { sendPasswordReset } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase";

export default function ForgotPasswordPage() {
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
      await sendPasswordReset(String(form.get("email") ?? ""));
      setMessage("Password reset email sent if the address exists in Supabase Auth.");
    } catch (resetError) {
      setError(resetError instanceof Error ? resetError.message : "Unable to send reset email.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-cloud px-5 py-10">
      <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-soft">
        <Logo />
        <h1 className="mt-10 text-3xl font-black tracking-tight text-navy">Reset your password</h1>
        <p className="mt-3 text-sm font-semibold leading-6 text-slate-500">Enter your work email and Pactora will send a Supabase password reset link.</p>
        <p className="mt-3 text-sm font-semibold leading-6 text-slate-500">
          The email must already exist in Supabase Auth. Add your local `/reset-password` URL in Supabase Authentication redirect settings.
        </p>
        {!isSupabaseConfigured ? (
          <p className="mt-5 rounded-lg bg-amber-50 p-3 text-sm font-bold leading-6 text-amber-800">
            Supabase is not connected yet. Add your URL and anon key in `.env.local`, then restart the app.
          </p>
        ) : null}
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm font-bold text-navy">Work email</span>
            <input name="email" type="email" required className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-purple focus:ring-4 focus:ring-purple/10" />
          </label>
          {error ? <p className="rounded-lg bg-rose-50 p-3 text-sm font-bold text-rose-700">{error}</p> : null}
          {message ? <p className="rounded-lg bg-emerald/10 p-3 text-sm font-bold text-emerald">{message}</p> : null}
          <button disabled={loading} className="w-full rounded-lg bg-purple px-5 py-3.5 font-black text-white shadow-glow disabled:opacity-50">
            {loading ? "Sending" : "Send reset link"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm font-semibold">
          <Link href="/login" className="font-black text-purple">Back to login</Link>
        </p>
      </section>
    </main>
  );
}
