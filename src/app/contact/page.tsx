import Link from "next/link";
import { Header } from "@/components/Header";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-cloud text-navy">
      <Header />
      <section className="mx-auto max-w-4xl px-5 py-16 lg:px-8">
        <p className="text-sm font-black uppercase tracking-wide text-purple">Contact</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight">Talk to Pactora</h1>
        <div className="mt-8 rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
          <p className="text-sm font-medium leading-7 text-slate-600">
            Pactora is currently in private beta. For onboarding, pilots, partnerships, or feedback, contact the founding team.
          </p>
          <Link href="mailto:hello@pactora.example" className="mt-6 inline-flex rounded-lg bg-purple px-5 py-3 text-sm font-black text-white">
            hello@pactora.example
          </Link>
        </div>
      </section>
    </main>
  );
}
