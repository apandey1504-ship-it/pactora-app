import { PolicyPage } from "@/components/PolicyPage";
import { cookieSections } from "@/lib/policyContent";

export default function CookiesPage() {
  return (
    <PolicyPage
      title="Cookie Policy"
      intro="This policy explains how Pactora may use essential, analytics, preference, and marketing cookies during private beta."
      sections={cookieSections}
    />
  );
}
