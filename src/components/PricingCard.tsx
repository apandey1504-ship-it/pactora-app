export function PricingCard({
  name,
  price,
  description,
  features,
  featured
}: {
  name: string;
  price: string;
  description: string;
  features: string[];
  featured?: boolean;
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
    </article>
  );
}
