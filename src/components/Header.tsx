import Link from "next/link";
import { BetaBanner } from "./BetaBanner";
import { Logo } from "./Logo";

const navItems = ["Product", "Solutions", "Pricing", "Resources", "Company"];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/70 bg-white/80 backdrop-blur-xl">
      <BetaBanner />
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <div className="min-w-0">
          <Logo />
        </div>
        <nav className="hidden items-center gap-7 text-sm font-semibold text-slate-600 lg:flex">
          {navItems.map((item) => {
            const href =
              item === "Solutions"
                ? "/solutions"
                : item === "Pricing"
                  ? "/pricing"
                  : item === "Resources"
                    ? "/faq"
                    : `/#${item.toLowerCase()}`;

            return (
              <Link key={item} href={href} className="transition hover:text-navy">
                {item}
              </Link>
            );
          })}
        </nav>
        <div className="flex shrink-0 items-center gap-3">
          <Link href="/login" className="hidden text-sm font-bold text-navy sm:inline">
            Login
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-navy px-4 py-2.5 text-sm font-bold text-white shadow-soft transition hover:-translate-y-0.5"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
