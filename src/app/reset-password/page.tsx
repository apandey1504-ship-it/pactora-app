"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { updatePassword } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") ?? "");
    const confirmPassword = String(form.get("confirmPassword") ?? "");
    setLoading(true);
    setMessage(null);
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      await updatePassword(password);
      setMessage("Password updated. Redirecting to login...");
      setTimeout(() => router.push("/login"), 900);
    } catch (resetError) {
      setError(resetError instanceof Error ? resetError.message : "Unable to update password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-cloud px-5 py-10">
      <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-soft">
        <Logo />
        <h1 className="mt-10 text-3xl font-black tracking-tight text-navy">Choose a new password</h1>
        <p className="mt-3 text-sm font-semibold leading-6 text-slate-500">
          Open this page from the reset link sent by Supabase, then set your new password.
        </p>
        {!isSupabaseConfigured ? (
          <p className="mt-5 rounded-lg bg-amber-50 p-3 text-sm font-bold leading-6 text-amber-800">
            Supabase is not connected yet. Add your URL and anon key in `.env.local`, then restart the app.
          </p>
        ) : null}
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm font-bold text-navy">New password</span>
            <input name="password" type="password" minLength={6} required className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-purple focus:ring-4 focus:ring-purple/10" />
          </label>
          <label className="block">
            <span className="text-sm font-bold text-navy">Confirm password</span>
            <input name="confirmPassword" type="password" minLength={6} required className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-purple focus:ring-4 focus:ring-purple/10" />
          </label>
          {error ? <p className="rounded-lg bg-rose-50 p-3 text-sm font-bold text-rose-700">{error}</p> : null}
          {message ? <p className="rounded-lg bg-emerald/10 p-3 text-sm font-bold text-emerald">{message}</p> : null}
          <button disabled={loading} className="w-full rounded-lg bg-purple px-5 py-3.5 font-black text-white shadow-glow disabled:opacity-50">
            {loading ? "Updating" : "Update password"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm font-semibold">
          <Link href="/login" className="font-black text-purple">Back to login</Link>
        </p>
      </section>
    </main>
  );
}
