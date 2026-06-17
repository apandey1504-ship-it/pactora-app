"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import {
  BadgeCheck,
  CreditCard,
  FileText,
  FileCheck,
  GitPullRequest,
  LayoutDashboard,
  Layers3,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  ShieldPlus,
  Landmark,
  Users
} from "lucide-react";
import { getDashboardPathForRole, logout, updateProfileRole } from "@/lib/auth";
import { useAuth } from "@/hooks/use-auth";
import type { UserRole } from "@/types/database";
import { Logo } from "./Logo";

const dashboardItems = {
  client: { href: "/dashboard/client", label: "Client dashboard", icon: LayoutDashboard },
  contractor: { href: "/dashboard/contractor", label: "Contractor dashboard", icon: FileCheck },
  admin: { href: "/dashboard/admin", label: "Admin dashboard", icon: Users },
  arbitrator: { href: "/dashboard/admin", label: "Arbitrator dashboard", icon: Users }
} satisfies Record<UserRole, { href: string; label: string; icon: typeof LayoutDashboard }>;

const sharedItems = [
  { href: "/contracts", label: "Contracts", icon: FileText },
  { href: "/insurance", label: "Insurance", icon: ShieldPlus },
  { href: "/verification", label: "Verification", icon: Landmark },
  { href: "/categories", label: "Categories", icon: Layers3 },
  { href: "/ai-assurance", label: "AI Assurance", icon: Sparkles },
  { href: "/milestones", label: "Milestones", icon: BadgeCheck },
  { href: "/change-requests", label: "Changes", icon: GitPullRequest },
  { href: "/messages", label: "Messages", icon: MessageSquare },
  { href: "/payments", label: "Payments", icon: CreditCard },
  { href: "/trust-score", label: "Trust Score", icon: ShieldCheck }
];

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { profile, refreshProfile } = useAuth();
  const [roleSaving, setRoleSaving] = useState(false);
  const currentRole = profile?.role ?? "client";
  const items = [dashboardItems[currentRole], ...sharedItems];

  async function handleLogout() {
    await logout();
    router.replace("/login");
  }

  async function handleRoleChange(role: UserRole) {
    setRoleSaving(true);

    try {
      await updateProfileRole(role);
      await refreshProfile();
      router.replace(getDashboardPathForRole(role));
    } finally {
      setRoleSaving(false);
    }
  }

  return (
    <aside className="hidden min-h-screen w-72 border-r border-slate-200 bg-white px-5 py-6 lg:block">
      <Logo />
      <nav className="mt-9 space-y-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-bold transition hover:bg-cloud hover:text-navy ${
              pathname === item.href ? "bg-cloud text-navy" : "text-slate-600"
            }`}
          >
            <item.icon size={18} />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="mt-6 rounded-lg border border-slate-200 bg-cloud p-3">
        <label className="text-xs font-black uppercase tracking-wide text-slate-500">Test dashboard role</label>
        <select
          value={currentRole}
          disabled={roleSaving}
          onChange={(event) => handleRoleChange(event.target.value as UserRole)}
          className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-black text-navy outline-none focus:border-purple"
        >
          <option value="client">Client</option>
          <option value="contractor">Contractor</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <div className="mt-10 rounded-lg bg-navy p-4 text-white">
        <p className="text-sm font-black">Assurance Mode</p>
        <p className="mt-2 text-sm leading-6 text-white/68">
          Contract changes, approvals, and payment holds are tracked for every active agreement.
        </p>
      </div>
      <button onClick={handleLogout} className="mt-4 w-full rounded-lg bg-cloud px-4 py-3 text-left text-sm font-black text-navy">
        Logout
      </button>
    </aside>
  );
}
