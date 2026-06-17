import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3" aria-label="Pactora home">
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-navy text-sm font-black text-white shadow-glow">
        P
      </span>
      <span className="text-xl font-black tracking-tight text-navy">Pactora</span>
    </Link>
  );
}
