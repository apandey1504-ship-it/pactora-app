export type PricingPlan = {
  slug: "starter" | "pro" | "business" | "enterprise";
  name: string;
  price: string;
  monthlyPrice: number | null;
  target: string;
  description: string;
  transactionFeePercent: number | null;
  activeProjectLimit: number | null;
  storage: string;
  cta: string;
  features: string[];
};

export const pricingPlans: PricingPlan[] = [
  {
    slug: "starter",
    name: "Starter",
    price: "Free",
    monthlyPrice: 0,
    target: "Early users",
    description: "For teams starting with one protected agreement.",
    transactionFeePercent: 3,
    activeProjectLimit: 1,
    storage: "500 MB",
    cta: "Start Free",
    features: [
      "1 active project",
      "Basic milestone tracking",
      "Basic change requests",
      "Basic messaging",
      "500 MB document storage",
      "Pactora Secure Milestone Payments available",
      "Standard support"
    ]
  },
  {
    slug: "pro",
    name: "Pro",
    price: "$49/month",
    monthlyPrice: 49,
    target: "Freelancers, small agencies, consultants",
    description: "For client work that needs stronger change and approval control.",
    transactionFeePercent: 3,
    activeProjectLimit: 10,
    storage: "5 GB",
    cta: "Start Pro",
    features: [
      "Up to 10 active projects",
      "Unlimited milestones",
      "Change Governance Engine™",
      "Project messaging",
      "Audit trail",
      "5 GB document storage",
      "Basic trust score",
      "Client/contractor invites",
      "Email notifications",
      "Pactora Secure Milestone Payments"
    ]
  },
  {
    slug: "business",
    name: "Business",
    price: "$199/month",
    monthlyPrice: 199,
    target: "Agencies, suppliers, manufacturers, B2B service companies",
    description: "For companies running many agreements with verification and admin controls.",
    transactionFeePercent: 2,
    activeProjectLimit: null,
    storage: "50 GB",
    cta: "Start Business",
    features: [
      "Unlimited active projects",
      "Team members",
      "Advanced Change Governance Engine™",
      "Business verification badge",
      "Advanced audit trail",
      "50 GB document storage",
      "Admin controls",
      "Dispute documentation center",
      "Advanced trust score",
      "Priority support",
      "Pactora Secure Milestone Payments"
    ]
  },
  {
    slug: "enterprise",
    name: "Enterprise",
    price: "Custom",
    monthlyPrice: null,
    target: "Larger companies, platforms, construction, wholesale, trade networks",
    description: "For custom workflows, partner integrations, and volume pricing.",
    transactionFeePercent: null,
    activeProjectLimit: null,
    storage: "Custom",
    cta: "Contact Sales",
    features: [
      "Custom workflows",
      "API access",
      "Dedicated success manager",
      "Custom verification workflows",
      "Custom reporting",
      "Advanced permissions",
      "SSO-ready architecture",
      "Insurance/trade assurance partner integrations later",
      "Volume pricing"
    ]
  }
];

export function getPricingPlan(slug: string | null | undefined) {
  return pricingPlans.find((plan) => plan.slug === slug) ?? pricingPlans[0];
}
