"use client";

import Link from "next/link";
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
import { logout } from "@/lib/auth";
import { useAuth } from "@/hooks/use-auth";
import type { UserRole } from "@/types/database";
import { Logo } from "./Logo";

export const dashboardItems = {
  client: { href: "/dashboard/client", label: "Client dashboard", icon: LayoutDashboard },
  contractor: { href: "/dashboard/contractor", label: "Contractor dashboard", icon: FileCheck },
  admin: { href: "/dashboard/admin", label: "Admin dashboard", icon: Users },
  arbitrator: { href: "/dashboard/admin", label: "Arbitrator dashboard", icon: Users }
} satisfies Record<UserRole, { href: string; label: string; icon: typeof LayoutDashboard }>;

export const sharedItems = [
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
  const { profile } = useAuth();
  const currentRole = profile?.role ?? "client";
  const items = [dashboardItems[currentRole], ...sharedItems];

  async function handleLogout() {
    await logout();
    router.replace("/login");
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

export function MobileDashboardNav() {
  const pathname = usePathname();
  const { profile } = useAuth();
  const currentRole = profile?.role ?? "client";
  const items = [dashboardItems[currentRole], ...sharedItems];

  return (
    <nav className="mobile-scrollbar sticky top-8 z-40 flex gap-2 overflow-x-auto border-b border-slate-200 bg-white px-3 py-3 lg:hidden">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-black ${
            pathname === item.href ? "bg-purple text-white" : "bg-cloud text-slate-600"
          }`}
        >
          <item.icon size={15} />
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
