import { Milestone } from "@/types";
import { StatusBadge } from "./StatusBadge";

export function MilestoneTable({
  milestones,
  onSubmit,
  onApprove,
  onRequestRevision
}: {
  milestones: Milestone[];
  onSubmit?: (id: string) => void;
  onApprove?: (id: string) => void;
  onRequestRevision?: (id: string) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-soft">
      <table className="w-full min-w-[720px] text-left">
        <thead className="bg-slate-50 text-xs font-black uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-5 py-4">Milestone</th>
            <th className="px-5 py-4">Owner</th>
            <th className="px-5 py-4">Amount</th>
            <th className="px-5 py-4">Due</th>
            <th className="px-5 py-4">Status</th>
            {(onSubmit || onApprove || onRequestRevision) ? <th className="px-5 py-4">Actions</th> : null}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {milestones.map((milestone) => (
            <tr key={milestone.id}>
              <td className="px-5 py-4 font-bold text-navy">{milestone.title}</td>
              <td className="px-5 py-4 text-sm font-semibold text-slate-600">{milestone.owner}</td>
              <td className="px-5 py-4 text-sm font-bold text-navy">{milestone.amount}</td>
              <td className="px-5 py-4 text-sm font-semibold text-slate-600">{milestone.dueDate}</td>
              <td className="px-5 py-4">
                <StatusBadge status={milestone.status} />
              </td>
              {(onSubmit || onApprove || onRequestRevision) ? (
                <td className="px-5 py-4">
                  <div className="flex gap-2">
                    {onSubmit ? <button onClick={() => onSubmit(milestone.id)} className="rounded-lg bg-cloud px-3 py-2 text-xs font-black text-navy">Submit</button> : null}
                    {onApprove ? <button onClick={() => onApprove(milestone.id)} className="rounded-lg bg-emerald px-3 py-2 text-xs font-black text-white">Approve</button> : null}
                    {onRequestRevision ? <button onClick={() => onRequestRevision(milestone.id)} className="rounded-lg bg-amber-100 px-3 py-2 text-xs font-black text-amber-700">Revise</button> : null}
                  </div>
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
