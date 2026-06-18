import { PolicyPage } from "@/components/PolicyPage";
import { securitySections } from "@/lib/policyContent";

export default function SecurityPage() {
  return (
    <PolicyPage
      title="Security Policy"
      intro="Pactora uses role-based access, database policies, document controls, and audit logs to support secure contract assurance workflows."
      sections={securitySections}
    />
  );
}
