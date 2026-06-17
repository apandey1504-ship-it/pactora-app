import { Header } from "@/components/Header";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-cloud text-navy">
      <Header />
      <section className="mx-auto max-w-4xl px-5 py-16 lg:px-8">
        <p className="text-sm font-black uppercase tracking-wide text-purple">Legal</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight">Terms of Service</h1>
        <div className="mt-8 space-y-5 rounded-lg border border-slate-200 bg-white p-6 text-sm font-medium leading-7 text-slate-600 shadow-soft">
          <p>This placeholder Terms of Service page is prepared for Pactora private beta review.</p>
          <p>Pactora is a contract assurance platform for managing agreements, milestones, change requests, documents, messages, disputes, and trust signals.</p>
          <p>Final legal terms should be reviewed by qualified counsel before public launch.</p>
        </div>
      </section>
    </main>
  );
}
