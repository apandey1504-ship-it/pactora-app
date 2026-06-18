import { AuthPanel } from "@/components/AuthPanel";

export default function ClientSignupPage() {
  return <AuthPanel mode="signup" lockedRole="client" portalLabel="Client signup" />;
}
