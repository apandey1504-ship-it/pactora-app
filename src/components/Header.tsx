import Link from "next/link";
import { Logo } from "./Logo";

const navItems = ["Product", "Solutions", "Pricing", "Resources", "Company"];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/70 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Logo />
        <nav className="hidden items-center gap-7 text-sm font-semibold text-slate-600 lg:flex">
          {navItems.map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="transition hover:text-navy">
              {item}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
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
