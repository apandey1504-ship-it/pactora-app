import { Status } from "@/types";

export function formatCurrency(value: number | null | undefined) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value ?? 0);
}

export function formatDate(value: string | null | undefined) {
  if (!value) {
    return "Not set";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric"
  }).format(new Date(value));
}

export function formatTime(value: string | null | undefined) {
  if (!value) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
}

export function normalizeStatus(status: string | null | undefined): Status {
  const normalized = (status ?? "pending").replace("-", "_");
  const statusMap: Record<string, Status> = {
    draft: "pending",
    pending_acceptance: "pending",
    active: "active",
    paused: "frozen",
    completed: "approved",
    cancelled: "rejected",
    disputed: "disputed",
    pending: "pending",
    funded: "paid",
    in_progress: "active",
    submitted: "in_review",
    approved: "approved",
    revision_requested: "in_review",
    paid: "paid",
    requested: "pending",
    contractor_review: "in_review",
    client_review: "in_review",
    rejected: "rejected",
    refunded: "rejected",
    released: "paid",
    failed: "rejected",
    open: "disputed",
    under_review: "in_review",
    resolved: "approved"
  };

  if (statusMap[normalized]) {
    return statusMap[normalized];
  }

  const validStatuses: Status[] = [
    "active",
    "pending",
    "approved",
    "rejected",
    "in_review",
    "paid",
    "disputed",
    "frozen"
  ];

  return validStatuses.includes(normalized as Status) ? (normalized as Status) : "pending";
}
