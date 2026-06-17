export function LoadingState({ label = "Loading data..." }: { label?: string }) {
  return <p className="rounded-lg border border-slate-200 bg-white p-5 text-sm font-bold text-slate-500 shadow-soft">{label}</p>;
}

export function ErrorState({ message }: { message: string }) {
  return <p className="rounded-lg border border-rose-200 bg-rose-50 p-5 text-sm font-bold text-rose-700">{message}</p>;
}

export function EmptyState({ message }: { message: string }) {
  return <p className="rounded-lg border border-slate-200 bg-white p-5 text-sm font-bold text-slate-500 shadow-soft">{message}</p>;
}
