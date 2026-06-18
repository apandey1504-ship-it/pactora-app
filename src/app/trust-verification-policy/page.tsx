import { PolicyPage } from "@/components/PolicyPage";
import { trustVerificationSections } from "@/lib/policyContent";

export default function TrustVerificationPolicyPage() {
  return (
    <PolicyPage
      title="Trust & Verification Policy"
      intro="This policy explains business verification statuses, badges, and Pactora Trust Score signals."
      sections={trustVerificationSections}
    />
  );
}
