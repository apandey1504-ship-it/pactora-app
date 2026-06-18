import Link from "next/link";
import { Header } from "@/components/Header";
import { PublicFooter } from "@/components/PublicFooter";

const legalLinks = [
  ["Terms of Service", "/terms"],
  ["Privacy Policy", "/privacy"],
  ["Cookie Policy", "/cookies"],
  ["Payment Terms", "/payment-terms"],
  ["Acceptable Use Policy", "/acceptable-use"],
  ["Security Policy", "/security"],
  ["Dispute Resolution Policy", "/dispute-resolution"],
  ["Change Governance Policy", "/change-governance-policy"],
  ["Trust & Verification Policy", "/trust-verification-policy"],
  ["FAQ", "/faq"],
  ["Contact", "/contact"]
];

export default function LegalHubPage() {
  return (
    <main className="min-h-screen bg-cloud text-navy">
      <Header />
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-5 sm:py-16 lg:px-8">
        <p className="text-sm font-black uppercase tracking-wide text-purple">Legal hub</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Pactora legal and policy center.</h1>
        <p className="mt-4 max-w-3xl text-sm font-semibold leading-7 text-slate-600">
          Private beta policy pages for contract assurance, milestone workflows, payment coordination, verification, disputes, privacy, and platform security.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {legalLinks.map(([label, href]) => (
            <Link key={href} href={href} className="rounded-lg border border-slate-200 bg-white p-5 font-black text-navy shadow-soft transition hover:border-purple">
              {label}
            </Link>
          ))}
        </div>
        <div className="mt-8 rounded-lg bg-navy p-5 text-sm font-semibold leading-7 text-white/72">
          Pactora is not a licensed escrow company, bank, insurer, money transmitter, legal advisor, or financial advisor in the MVP. These pages are beta-ready placeholders and should be reviewed by qualified counsel before public launch.
        </div>
      </section>
      <PublicFooter />
    </main>
  );
}
