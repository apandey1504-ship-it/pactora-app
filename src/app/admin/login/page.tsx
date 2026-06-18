import { AuthPanel } from "@/components/AuthPanel";

export default function AdminLoginPage() {
  return <AuthPanel mode="login" defaultRole="admin" portalLabel="Super admin login" />;
}
