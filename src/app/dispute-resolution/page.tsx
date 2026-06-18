import { PolicyPage } from "@/components/PolicyPage";
import { disputeSections } from "@/lib/policyContent";

export default function DisputeResolutionPage() {
  return (
    <PolicyPage
      title="Dispute Resolution Policy"
      intro="This policy describes Pactora's dispute documentation and internal review workflow for private beta projects."
      sections={disputeSections}
    />
  );
}
