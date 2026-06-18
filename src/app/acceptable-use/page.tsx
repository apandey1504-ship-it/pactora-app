import { PolicyPage } from "@/components/PolicyPage";
import { acceptableUseSections } from "@/lib/policyContent";

export default function AcceptableUsePage() {
  return (
    <PolicyPage
      title="Acceptable Use Policy"
      intro="This policy explains prohibited uses of Pactora and the platform behavior expected from clients, contractors, companies, and internal users."
      sections={acceptableUseSections}
    />
  );
}
