import type { PolicySection } from "@/components/PolicyPage";

export const termsSections: PolicySection[] = [
  { title: "Acceptance of Terms", body: "By creating an account, accessing Pactora, or using any private beta feature, you agree to these Terms of Service and any linked policies." },
  { title: "Platform Description", body: "Pactora is a B2B contract assurance platform for agreements, milestones, change requests, approvals, documents, messages, audit trails, disputes, and business trust scores." },
  { title: "User Eligibility", body: "Users must be able to enter business agreements and must provide accurate account, company, and verification information." },
  { title: "Accounts and Roles", body: "Pactora supports client, contractor, and internal staff roles. Users are responsible for maintaining the security of their login credentials and role permissions." },
  { title: "Company Profiles", body: "Company profiles may include legal names, countries, business types, registration numbers, verification status, and trust signals." },
  { title: "Projects and Agreements", body: "Projects help parties organize business agreements, scope, value, due dates, participants, documents, and project status." },
  { title: "Milestones and Approvals", body: "Milestones define deliverables, due dates, amounts, evidence, submissions, revisions, approvals, and payment-readiness status." },
  { title: "Change Requests", body: "Change requests should be used when scope, timing, cost, responsibilities, or acceptance criteria change after a project begins." },
  { title: "Secure Milestone Payment Coordination", body: "Pactora facilitates contract assurance workflows and milestone payment coordination through third-party payment providers." },
  { title: "Third-Party Payment Providers", body: "Payment processing, funding, release, refunds, chargebacks, and provider fees may be handled by third-party payment processors and are subject to their terms." },
  { title: "No Escrow, Banking, Insurance, Legal, or Financial Advice", body: "Pactora is not a licensed escrow company, bank, insurer, money transmitter, legal advisor, or financial advisor in the MVP. Pactora does not directly hold customer funds." },
  { title: "User Responsibilities", body: "Users are responsible for accurate project data, lawful documents, truthful communications, approvals, and compliance with applicable laws." },
  { title: "Prohibited Activities", body: "Users may not use Pactora for fraud, false documents, illegal goods or services, money laundering, sanctions evasion, harassment, spam, or unauthorized access." },
  { title: "Fees and Billing", body: "Plans include Starter Free, Pro $49/month, Business $199/month, and Enterprise Custom. Platform fees and third-party payment processing fees may apply." },
  { title: "Disputes Between Users", body: "Pactora may provide dispute documentation tools and internal review workflows, but it does not replace courts, lawyers, licensed arbitrators, or formal legal proceedings unless expressly agreed through a separate agreement." },
  { title: "Platform Suspension or Termination", body: "Pactora may suspend or terminate access for security risk, fraud concerns, policy violations, non-payment, or misuse of the platform." },
  { title: "Limitation of Liability", body: "To the maximum extent permitted by law, Pactora is not liable for indirect, incidental, consequential, punitive, or special damages arising from platform use." },
  { title: "Indemnity", body: "Users agree to defend and indemnify Pactora against claims arising from their content, agreements, disputes, unlawful use, or violation of these terms." },
  { title: "Governing Law Placeholder", body: "These terms will be governed by the laws identified by [Pactora legal entity name] before public launch." },
  { title: "Contact Information", body: "For legal questions, contact [legal@getpactora.com] at [Pactora registered address]." }
];

export const privacySections: PolicySection[] = [
  { title: "Privacy Transparency", body: "This policy is intended to support privacy transparency for users in Canada, the United States, India, and other jurisdictions. Specific rights may vary depending on location." },
  { title: "Information Collected", bullets: ["Account information such as name, email, phone, role, and authentication metadata.", "Company information such as business name, country, registration details, verification status, and members.", "Project information such as agreements, project values, milestones, change requests, approvals, audit logs, and disputes.", "Payment metadata related to payment status, provider references, platform fees, and processing events.", "Documents uploaded to support contracts, company verification, insurance, banking verification, and milestone evidence.", "Communications and messages between project participants.", "Device, browser, log, cookie, and usage data."] },
  { title: "How Information Is Used", body: "We use information to operate Pactora, authenticate users, support project workflows, process verification, coordinate milestone payment workflows, provide notifications, improve security, and support private beta feedback." },
  { title: "Service Providers", body: "Pactora may use service providers such as Supabase, hosting providers, email tools, analytics tools, payment processors, document services, and support tools." },
  { title: "Payment Processors", body: "Payment processing is handled by third-party payment providers. Pactora may store payment metadata, but Pactora does not directly hold customer funds in the MVP." },
  { title: "Legal and Compliance Requests", body: "We may disclose information when required by law, legal process, regulatory request, fraud prevention, security investigation, or to protect rights and safety." },
  { title: "International Data Transfers", body: "Information may be processed in countries other than where users live. We use reasonable safeguards appropriate to the service and vendor environment." },
  { title: "Data Retention", body: "We retain information as needed to operate the service, maintain audit history, comply with legal obligations, resolve disputes, and support private beta operations." },
  { title: "User Rights", body: "Depending on your location, you may have rights to access, correct, delete, export, restrict, or object to processing of certain personal information." },
  { title: "Security Measures", body: "We use access controls, database security, role-based permissions, document storage controls, audit logs, and security monitoring practices appropriate for a private beta." },
  { title: "Children's Privacy", body: "Pactora is for business users and is not intended for children." },
  { title: "Contact Information", body: "For privacy questions, contact [legal@getpactora.com] or [support@getpactora.com]." }
];

export const cookieSections: PolicySection[] = [
  { title: "Essential Cookies", body: "Essential cookies support authentication, security, session management, and core application behavior." },
  { title: "Analytics Cookies", body: "Analytics cookies may help Pactora understand usage, performance, and product issues during private beta." },
  { title: "Preference Cookies", body: "Preference cookies may remember interface settings, selected options, or beta preferences." },
  { title: "Marketing Cookies", body: "Marketing cookies may be used later for campaign attribution or beta outreach if enabled." },
  { title: "Cookie Controls", body: "Users can manage cookies in their browser settings. Some essential features may not work if required cookies are disabled." },
  { title: "Cookie Consent Placeholder", body: "A full cookie consent preference center may be added before broader public launch." }
];

export const paymentTermsSections: PolicySection[] = [
  { title: "Subscription Billing", body: "Plans include Starter Free, Pro $49/month, Business $199/month, and Enterprise Custom. Subscription terms may change as Pactora moves from private beta to public launch." },
  { title: "Platform Fees", body: "Pactora may charge platform fees on funded milestones: 3% for Starter and Pro, 2% for Business, and custom pricing for Enterprise." },
  { title: "Transaction and Processor Fees", body: "Payment processing fees are separate from Pactora platform fees and may be passed through by third-party payment providers." },
  { title: "Refunds", body: "Refunds may depend on subscription status, project status, payment provider rules, and applicable law." },
  { title: "Failed Payments", body: "Failed payments may delay access to paid features, milestone payment coordination, or subscription benefits." },
  { title: "Chargebacks", body: "Chargebacks may require user cooperation, evidence submission, project records, and payment provider review." },
  { title: "No Escrow Disclaimer", body: "Pactora does not directly hold customer funds in the MVP and is not a licensed escrow company, bank, insurer, or money transmitter." },
  { title: "Secure Milestone Payments", body: "Pactora facilitates contract assurance workflows and milestone payment coordination through third-party payment providers." },
  { title: "Fee Example", body: "$10,000 funded milestone on Starter or Pro at 3% equals a $300 Pactora platform fee, plus separate payment provider processing fees." }
];

export const acceptableUseSections: PolicySection[] = [
  { title: "Prohibited Conduct", bullets: ["Fraud or deceptive activity.", "Fake projects, false counterparties, or fabricated work evidence.", "Illegal goods or services.", "Money laundering or suspicious funds movement.", "Sanctions violations or restricted-party activity.", "Harassment, abuse, threats, or hate-based conduct.", "Spam, phishing, or unsolicited commercial abuse.", "False, forged, or misleading documents.", "Abuse of disputes, chargebacks, or project freeze tools.", "Unauthorized access, scraping, credential sharing, or security testing without approval.", "High-risk financial, legal, insurance, medical, or regulated activity without Pactora approval."] },
  { title: "Enforcement", body: "Pactora may suspend accounts, freeze platform workflow access, remove content, notify affected users, or cooperate with providers and authorities when necessary." }
];

export const securitySections: PolicySection[] = [
  { title: "Data Encryption", body: "Pactora uses modern cloud infrastructure and vendor security controls designed to protect data in transit and at rest where supported." },
  { title: "Supabase and Database Security", body: "Pactora uses Supabase-backed database and authentication patterns with row-level security, policies, and role checks." },
  { title: "Role-Based Access", body: "Client, contractor, admin, and staff access are separated by profile role and database policies." },
  { title: "Project Participant Access", body: "Project data, messages, documents, payments, change requests, milestones, and disputes are intended to be visible only to relevant participants and authorized admins." },
  { title: "Document Storage", body: "Documents are stored in controlled buckets with project participant and admin access policies." },
  { title: "Audit Logs", body: "Major project, milestone, change request, dispute, verification, and staff access actions are recorded in audit logs." },
  { title: "Admin Access", body: "Admin and staff access should be limited to authorized Pactora company personnel and reviewed regularly." },
  { title: "Incident Reporting", body: "Report suspected security issues to [support@getpactora.com] or [legal@getpactora.com]." },
  { title: "User Responsibilities", body: "Users must protect passwords, use secure devices, avoid sharing accounts, and report suspicious activity promptly." }
];

export const disputeSections: PolicySection[] = [
  { title: "Dispute Flow", bullets: ["A dispute is raised on a project or milestone.", "Evidence is submitted by the raising party.", "The other party responds with context and evidence.", "Pactora admin or internal review may evaluate platform records.", "A suggested resolution or platform action may be recorded.", "Payment or milestone status may be updated where applicable.", "The audit log records the dispute activity and outcome."] },
  { title: "Important Disclaimer", body: "Pactora is not a court and is not legal arbitration unless separately agreed. Users should seek independent legal advice when needed." },
  { title: "Evidence", body: "Evidence may include contracts, milestone submissions, messages, documents, change requests, approvals, payment metadata, and project audit logs." }
];

export const changeGovernanceSections: PolicySection[] = [
  { title: "Change Request Requirement", body: "Every scope, cost, timeline, milestone, or acceptance criteria change should be submitted as a change request." },
  { title: "Cost and Timeline Impact", body: "Clients and contractors can define impact cost, impact days, affected milestones, rationale, and approval state." },
  { title: "Approval and Rejection", body: "Approved changes update the project record and, where applicable, milestone due dates or project value. Rejected changes remain visible in history." },
  { title: "Audit Trail", body: "Pactora records change request creation, responses, approvals, rejections, and resulting updates in the audit trail." }
];

export const trustVerificationSections: PolicySection[] = [
  { title: "Verification Statuses", bullets: ["unverified", "pending", "verified", "rejected"] },
  { title: "Business Verification Badge", body: "Companies may receive a verification badge after review of business identity or supporting records." },
  { title: "Trust Score Components", bullets: ["Project completion", "On-time rate", "Dispute rate", "Payment reliability", "Verification status"] },
  { title: "Trust Score Disclaimer", body: "Pactora Trust Score is a platform reputation indicator and is not a formal credit rating, credit report, insurance product, financial guarantee, or promise of future performance." }
];
