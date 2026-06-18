import Link from "next/link";

const footerLinks = [
  ["Terms", "/terms"],
  ["Privacy", "/privacy"],
  ["Cookies", "/cookies"],
  ["Payment Terms", "/payment-terms"],
  ["Acceptable Use", "/acceptable-use"],
  ["Security", "/security"],
  ["Dispute Resolution", "/dispute-resolution"],
  ["Contact", "/contact"]
];

export function PublicFooter() {
  return (
    <footer id="company" className="bg-white px-4 py-10 sm:px-5 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_2fr_auto] lg:items-start">
        <div>
          <p className="text-xl font-black text-navy">Pactora</p>
          <p className="mt-2 text-xs font-black uppercase tracking-wide text-purple">Private beta</p>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm font-bold text-slate-500 sm:grid-cols-4">
          {footerLinks.map(([label, href]) => (
            <Link key={href} href={href} className="transition hover:text-navy">
              {label}
            </Link>
          ))}
        </div>
        <Link href="/legal" className="rounded-lg bg-cloud px-4 py-3 text-center text-sm font-black text-navy">
          Legal hub
        </Link>
      </div>
      <p className="mx-auto mt-6 max-w-7xl text-xs font-semibold leading-6 text-slate-500">
        Pactora provides contract assurance, milestone workflow, documentation, and business trust tools. Pactora does not provide legal, banking, escrow, insurance, or financial advisory services unless expressly offered through licensed partners.
      </p>
      <p className="mx-auto mt-2 max-w-7xl text-xs font-semibold leading-6 text-slate-500">
        Pactora facilitates contract assurance workflows and milestone payment coordination through third-party payment providers.
      </p>
    </footer>
  );
}
