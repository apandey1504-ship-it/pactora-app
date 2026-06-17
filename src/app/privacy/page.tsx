import { Header } from "@/components/Header";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-cloud text-navy">
      <Header />
      <section className="mx-auto max-w-4xl px-5 py-16 lg:px-8">
        <p className="text-sm font-black uppercase tracking-wide text-purple">Legal</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight">Privacy Policy</h1>
        <div className="mt-8 space-y-5 rounded-lg border border-slate-200 bg-white p-6 text-sm font-medium leading-7 text-slate-600 shadow-soft">
          <p>This placeholder Privacy Policy page is prepared for Pactora private beta review.</p>
          <p>Pactora may process account, company, project, message, document, audit, and verification information as part of contract assurance workflows.</p>
          <p>Final privacy terms should be reviewed by qualified counsel before public launch.</p>
        </div>
      </section>
    </main>
  );
}
