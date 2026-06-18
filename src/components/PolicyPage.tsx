import { Header } from "@/components/Header";
import { PublicFooter } from "@/components/PublicFooter";

export type PolicySection = {
  title: string;
  body?: string;
  bullets?: string[];
};

export function PolicyPage({
  eyebrow = "Legal",
  title,
  intro,
  sections
}: {
  eyebrow?: string;
  title: string;
  intro: string;
  sections: PolicySection[];
}) {
  return (
    <main className="min-h-screen bg-cloud text-navy">
      <Header />
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-5 sm:py-16 lg:px-8">
        <p className="text-sm font-black uppercase tracking-wide text-purple">{eyebrow}</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">{title}</h1>
        <p className="mt-4 max-w-3xl text-sm font-semibold leading-7 text-slate-600">{intro}</p>
        <p className="mt-4 inline-flex rounded-full bg-white px-3 py-1 text-xs font-black uppercase tracking-wide text-slate-500 ring-1 ring-slate-200">
          Last updated: June 2026
        </p>
        <div className="mt-8 grid gap-4">
          {sections.map((section) => (
            <article key={section.title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
              <h2 className="text-xl font-black text-navy">{section.title}</h2>
              {section.body ? <p className="mt-3 text-sm font-medium leading-7 text-slate-600">{section.body}</p> : null}
              {section.bullets ? (
                <ul className="mt-4 grid gap-2 text-sm font-medium leading-7 text-slate-600">
                  {section.bullets.map((item) => (
                    <li key={item} className="rounded-lg bg-cloud px-4 py-3">{item}</li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </div>
      </section>
      <PublicFooter />
    </main>
  );
}
