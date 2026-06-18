import { AuthPanel } from "@/components/AuthPanel";

export default function StaffLoginPage() {
  return <AuthPanel mode="login" defaultRole="admin" portalLabel="Pactora staff access" />;
}
