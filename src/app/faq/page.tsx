import { Header } from "@/components/Header";
import { PublicFooter } from "@/components/PublicFooter";

const faqSections = [
  {
    title: "General",
    items: [
      ["What is Pactora?", "Pactora is a B2B contract assurance platform for managing agreements, milestones, change requests, approvals, secure milestone payment workflows, audit trails, disputes, documents, and business trust scores."],
      ["Who can use Pactora?", "Clients, contractors, agencies, suppliers, and businesses can use Pactora to keep commercial work clear and auditable."],
      ["Is Pactora a marketplace?", "No. Pactora is not primarily a marketplace. It is an assurance workflow layer for agreements and business relationships."],
      ["Is Pactora only for freelancers?", "No. Pactora supports freelancers, agencies, suppliers, service providers, and businesses working with external counterparties."],
      ["How is Pactora different from project management tools?", "Pactora focuses on contract assurance, milestone approvals, scoped changes, trust signals, evidence, and payment coordination rather than generic task tracking."]
    ]
  },
  {
    title: "Projects & Milestones",
    items: [
      ["How do milestones work?", "Milestones define deliverables, due dates, amounts, evidence, submission status, revision requests, approval, and payment-readiness."],
      ["Can projects be changed after approval?", "Yes. Changes should be submitted through Pactora's change request workflow so cost, timeline, and scope impact are recorded."],
      ["What happens if a contractor is delayed?", "A contractor can request timeline updates or submit a change request, and the decision is recorded in the audit trail."],
      ["What happens if a client changes scope?", "The scope change should be submitted as a change request with cost and timeline impact before work proceeds."],
      ["Can both parties approve revised timelines?", "Yes. Revised timelines can be reviewed and approved through change request workflows."]
    ]
  },
  {
    title: "Change Governance Engine",
    items: [
      ["What is the Change Governance Engine?", "It is Pactora's workflow for documenting, reviewing, approving, rejecting, and preserving changes to scope, cost, timeline, and milestones."],
      ["How does a change request work?", "A party creates a request, defines the affected project or milestone, adds cost/time impact, and the other party reviews it."],
      ["Can change requests affect price and timeline?", "Yes. Approved changes can update project value and milestone due dates."],
      ["Are approved changes recorded?", "Yes. Approved changes are recorded in project history and audit logs."],
      ["Can rejected changes still be viewed later?", "Yes. Rejected changes remain in the historical record for context and accountability."]
    ]
  },
  {
    title: "Secure Milestone Payments",
    items: [
      ["Does Pactora hold funds?", "Pactora does not directly hold customer funds in the MVP. Payment processing is handled by third-party payment providers. Pactora provides the approval, milestone, audit, and payment coordination workflow."],
      ["Is Pactora an escrow company?", "No. Pactora is not a licensed escrow company, bank, insurer, money transmitter, legal advisor, or financial advisor in the MVP."],
      ["How are milestone payments handled?", "Pactora facilitates contract assurance workflows and milestone payment coordination through third-party payment providers."],
      ["Who pays payment processing fees?", "Payment processing fees are separate from Pactora platform fees and may be passed through by the payment provider."],
      ["When is payment released?", "Release readiness is tied to milestone submission, approval, status, and third-party payment provider rules."]
    ]
  },
  {
    title: "Trust & Verification",
    items: [
      ["What is a Pactora Trust Score?", "Pactora Trust Score is a platform reputation indicator and is not a formal credit rating, credit report, or financial guarantee."],
      ["How are businesses verified?", "Companies can move through unverified, pending, verified, or rejected status based on available business verification checks."],
      ["Can a company lose trust score?", "Yes. Trust signals may change based on completion, on-time performance, disputes, payment reliability, and verification status."],
      ["Can buyers and contractors both be rated?", "Yes. Pactora is designed to support trust signals for both client and contractor-side companies."],
      ["Is Trust Score a credit score?", "No. Pactora Trust Score is not a credit score, insurance product, or financial guarantee."]
    ]
  },
  {
    title: "Disputes",
    items: [
      ["What happens when a dispute is raised?", "The dispute is linked to a project or milestone and parties can submit evidence for review."],
      ["What evidence can be submitted?", "Contracts, messages, documents, milestone submissions, change requests, approvals, and audit history can support dispute review."],
      ["Can Pactora decide who is right?", "Pactora may provide dispute documentation tools and internal review workflows, but it does not replace courts, lawyers, licensed arbitrators, or formal legal proceedings unless expressly agreed through a separate agreement."],
      ["Is Pactora legal arbitration?", "No. Pactora is not legal arbitration unless separately agreed through a specific agreement."],
      ["Can admin freeze a project?", "Admins may freeze or pause platform workflow actions when needed for review, fraud prevention, or dispute handling."]
    ]
  },
  {
    title: "Security",
    items: [
      ["How is data protected?", "Pactora uses role-based access, database policies, document controls, and audit logs."],
      ["Are documents private?", "Documents are intended to be accessible only to project participants and authorized admins."],
      ["Who can access project data?", "Project participants and authorized Pactora admins or staff can access relevant project data."],
      ["Can admins view project data?", "Authorized admins may access project data for support, compliance, security, dispute, and platform operations."],
      ["Does Pactora use encryption?", "Pactora uses modern infrastructure and vendor controls designed to protect data in transit and at rest where supported."]
    ]
  },
  {
    title: "Pricing",
    items: [
      ["What are Pactora's fees?", "Starter is Free, Pro is $49/month, Business is $199/month, and Enterprise is Custom."],
      ["Are payment processing fees separate?", "Yes. Payment processing fees are separate and passed through by third-party payment providers."],
      ["What plans are available?", "Starter, Pro, Business, and Enterprise plans are available during private beta."],
      ["Can enterprise users get custom pricing?", "Yes. Enterprise users can request custom workflows, pricing, and support."]
    ]
  }
];

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-cloud text-navy">
      <Header />
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-5 sm:py-16 lg:px-8">
        <p className="text-sm font-black uppercase tracking-wide text-purple">FAQ</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Pactora questions, answered.</h1>
        <p className="mt-4 max-w-3xl text-sm font-semibold leading-7 text-slate-600">
          Clear answers for clients, contractors, agencies, suppliers, and businesses using Pactora during private beta.
        </p>
        <div className="mt-8 grid gap-6">
          {faqSections.map((section) => (
            <section key={section.title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
              <h2 className="text-2xl font-black text-navy">{section.title}</h2>
              <div className="mt-4 divide-y divide-slate-100">
                {section.items.map(([question, answer]) => (
                  <details key={question} className="group py-4">
                    <summary className="cursor-pointer list-none text-base font-black text-navy">
                      <span className="inline-flex w-full items-center justify-between gap-4">
                        {question}
                        <span className="text-purple group-open:rotate-45">+</span>
                      </span>
                    </summary>
                    <p className="mt-3 text-sm font-medium leading-7 text-slate-600">{answer}</p>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
      <PublicFooter />
    </main>
  );
}
