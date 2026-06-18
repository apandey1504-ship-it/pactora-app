import { PolicyPage } from "@/components/PolicyPage";
import { termsSections } from "@/lib/policyContent";

export default function TermsPage() {
  return (
    <PolicyPage
      title="Terms of Service"
      intro="Private beta terms for Pactora users, companies, projects, milestones, change requests, payment coordination, disputes, documents, and trust tools."
      sections={termsSections}
    />
  );
}
