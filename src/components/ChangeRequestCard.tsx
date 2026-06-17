import { ChangeRequest } from "@/types";
import { StatusBadge } from "./StatusBadge";

export function ChangeRequestCard({
  request,
  onApprove,
  onReject,
  onContractorAccept
}: {
  request: ChangeRequest;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onContractorAccept?: (id: string) => void;
}) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-purple">{request.id}</p>
          <h3 className="mt-2 text-lg font-black text-navy">{request.title}</h3>
        </div>
        <StatusBadge status={request.status} />
      </div>
      <p className="mt-4 text-sm font-medium leading-6 text-slate-600">{request.summary}</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-slate-400">Requester</p>
          <p className="mt-1 font-bold text-navy">{request.requester}</p>
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-slate-400">Impact</p>
          <p className="mt-1 font-bold text-navy">{request.impact}</p>
        </div>
      </div>
      {(onApprove || onReject || onContractorAccept) ? (
        <div className="mt-5 flex flex-wrap gap-2">
          {onContractorAccept ? <button onClick={() => onContractorAccept(request.id)} className="rounded-lg bg-purple px-3 py-2 text-xs font-black text-white">Contractor accepts</button> : null}
          {onApprove ? <button onClick={() => onApprove(request.id)} className="rounded-lg bg-emerald px-3 py-2 text-xs font-black text-white">Approve</button> : null}
          {onReject ? <button onClick={() => onReject(request.id)} className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-black text-rose-700">Reject</button> : null}
        </div>
      ) : null}
    </article>
  );
}
