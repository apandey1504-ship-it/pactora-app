import { Status } from "@/types";

const statusCopy: Record<Status, string> = {
  active: "Active",
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  in_review: "In review",
  paid: "Paid",
  disputed: "Disputed",
  frozen: "Frozen"
};

const statusClasses: Record<Status, string> = {
  active: "bg-emerald/10 text-emerald ring-emerald/20",
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  approved: "bg-emerald/10 text-emerald ring-emerald/20",
  rejected: "bg-rose-50 text-rose-700 ring-rose-200",
  in_review: "bg-purple/10 text-purple ring-purple/20",
  paid: "bg-navy/10 text-navy ring-navy/20",
  disputed: "bg-orange-50 text-orange-700 ring-orange-200",
  frozen: "bg-slate-100 text-slate-700 ring-slate-200"
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${statusClasses[status]}`}>
      {statusCopy[status]}
    </span>
  );
}
