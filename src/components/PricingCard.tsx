export function PricingCard({
  name,
  price,
  description,
  target,
  features,
  featured,
  cta,
  href
}: {
  name: string;
  price: string;
  description: string;
  target?: string;
  features: string[];
  featured?: boolean;
  cta?: string;
  href?: string;
}) {
  return (
    <article
      className={`rounded-lg border p-6 ${
        featured ? "border-purple bg-navy text-white shadow-glow" : "border-slate-200 bg-white text-navy shadow-soft"
      }`}
    >
      <p className={`text-sm font-black uppercase tracking-wide ${featured ? "text-emerald" : "text-purple"}`}>
        {name}
      </p>
      <p className="mt-4 text-4xl font-black tracking-tight">{price}</p>
      {target ? <p className={`mt-2 text-xs font-black uppercase tracking-wide ${featured ? "text-white/52" : "text-slate-400"}`}>{target}</p> : null}
      <p className={`mt-3 text-sm font-medium leading-6 ${featured ? "text-white/72" : "text-slate-600"}`}>
        {description}
      </p>
      <ul className="mt-6 space-y-3 text-sm font-bold">
        {features.map((feature) => (
          <li key={feature} className="flex gap-3">
            <span className="mt-1 h-2 w-2 rounded-full bg-emerald" />
            {feature}
          </li>
        ))}
      </ul>
      {cta && href ? (
        <a
          href={href}
          className={`mt-6 inline-flex w-full justify-center rounded-lg px-4 py-3 text-sm font-black ${
            featured ? "bg-white text-navy" : "bg-purple text-white"
          }`}
        >
          {cta}
        </a>
      ) : null}
    </article>
  );
}
