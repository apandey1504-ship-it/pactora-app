import { PolicyPage } from "@/components/PolicyPage";
import { privacySections } from "@/lib/policyContent";

export default function PrivacyPage() {
  return (
    <PolicyPage
      title="Privacy Policy"
      intro="This policy explains how Pactora may collect, use, retain, transfer, and protect information for users in Canada, the United States, India, and other jurisdictions."
      sections={privacySections}
    />
  );
}
