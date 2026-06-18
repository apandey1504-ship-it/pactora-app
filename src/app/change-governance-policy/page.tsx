import { PolicyPage } from "@/components/PolicyPage";
import { changeGovernanceSections } from "@/lib/policyContent";

export default function ChangeGovernancePolicyPage() {
  return (
    <PolicyPage
      title="Change Governance Policy"
      intro="This policy explains how Pactora records scope, cost, timeline, milestone, and approval changes during a project."
      sections={changeGovernanceSections}
    />
  );
}
