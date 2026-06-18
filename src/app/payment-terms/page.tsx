import { PolicyPage } from "@/components/PolicyPage";
import { paymentTermsSections } from "@/lib/policyContent";

export default function PaymentTermsPage() {
  return (
    <PolicyPage
      title="Payment Terms"
      intro="Pactora facilitates contract assurance workflows and milestone payment coordination through third-party payment providers."
      sections={paymentTermsSections}
    />
  );
}
