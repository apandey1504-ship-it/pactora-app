import Link from "next/link";
import { CalendarCheck, LifeBuoy, Mail, ShieldCheck } from "lucide-react";
import { Header } from "@/components/Header";
import { PublicFooter } from "@/components/PublicFooter";

const contactCards = [
  {
    icon: Mail,
    title: "General inquiries",
    text: "Questions about Pactora, partnerships, or private beta access.",
    email: "hello@getpactora.com"
  },
  {
    icon: LifeBuoy,
    title: "Product support",
    text: "Help with accounts, projects, documents, milestones, or notifications.",
    email: "support@getpactora.com"
  },
  {
    icon: ShieldCheck,
    title: "Legal and compliance",
    text: "Policy, privacy, security, verification, or compliance requests.",
    email: "legal@getpactora.com"
  }
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-cloud text-navy">
      <Header />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-5 sm:py-16 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-black uppercase tracking-wide text-purple">Contact</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Talk to Pactora</h1>
          <p className="mt-4 text-base font-semibold leading-7 text-slate-600">
            Pactora is currently in private beta. Send us onboarding questions, pilot requests, support issues, or legal and compliance inquiries.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {contactCards.map((card) => (
            <article key={card.title} className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-purple/10 text-purple">
                <card.icon size={20} />
              </span>
              <h2 className="mt-5 text-xl font-black">{card.title}</h2>
              <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">{card.text}</p>
              <Link href={`mailto:${card.email}`} className="mt-5 inline-flex text-sm font-black text-purple">
                {card.email}
              </Link>
            </article>
          ))}
        </div>

        <section className="mt-10 grid gap-6 rounded-lg border border-slate-200 bg-white p-5 shadow-soft lg:grid-cols-[0.8fr_1.2fr] lg:p-8">
          <div>
            <span className="grid h-12 w-12 place-items-center rounded-lg bg-emerald/10 text-emerald">
              <CalendarCheck size={22} />
            </span>
            <h2 className="mt-5 text-2xl font-black">Request private beta access</h2>
            <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">
              Share a few details and we will follow up by email to schedule the right walkthrough.
            </p>
          </div>
          <form action="mailto:hello@getpactora.com" method="post" encType="text/plain" className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-bold text-navy">Full name</span>
              <input name="fullName" required className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-purple focus:ring-4 focus:ring-purple/10" />
            </label>
            <label className="block">
              <span className="text-sm font-bold text-navy">Work email</span>
              <input name="email" type="email" required className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-purple focus:ring-4 focus:ring-purple/10" />
            </label>
            <label className="block">
              <span className="text-sm font-bold text-navy">Company</span>
              <input name="company" className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-purple focus:ring-4 focus:ring-purple/10" />
            </label>
            <label className="block">
              <span className="text-sm font-bold text-navy">Inquiry type</span>
              <select name="inquiryType" className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-purple focus:ring-4 focus:ring-purple/10">
                <option>Beta access</option>
                <option>Demo call</option>
                <option>Partnership</option>
                <option>Support</option>
                <option>Legal or compliance</option>
              </select>
            </label>
            <label className="block sm:col-span-2">
              <span className="text-sm font-bold text-navy">How can we help?</span>
              <textarea name="message" rows={5} className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-purple focus:ring-4 focus:ring-purple/10" />
            </label>
            <button className="rounded-lg bg-purple px-5 py-3.5 font-black text-white shadow-glow sm:col-span-2">
              Send request
            </button>
          </form>
        </section>
      </section>
      <PublicFooter />
    </main>
  );
}
