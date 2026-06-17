export type UserRole = "client" | "contractor" | "admin" | "arbitrator";

export type Status =
  | "active"
  | "pending"
  | "approved"
  | "rejected"
  | "in_review"
  | "paid"
  | "disputed"
  | "frozen";

export type Project = {
  id: string;
  name: string;
  company: string;
  counterparty: string;
  value: string;
  progress: number;
  status: Status;
  dueDate: string;
  trustScore: number;
};

export type Milestone = {
  id: string;
  projectId: string;
  title: string;
  owner: string;
  amount: string;
  dueDate: string;
  status: Status;
};

export type ChangeRequest = {
  id: string;
  title: string;
  requester: string;
  impact: string;
  status: Status;
  summary: string;
};

export type Message = {
  id: string;
  author: string;
  role: UserRole;
  body: string;
  time: string;
};

export type ProjectDocument = {
  id: string;
  projectId: string;
  name: string;
  fileUrl: string;
  category?: string;
  createdAt: string;
};

export type TrustScore = {
  id: string;
  companyId: string;
  score: number;
  signal: Record<string, unknown>;
  createdAt: string;
};

export type MockUser = {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  companyId: string;
};

export type ServiceResult<T> = {
  data: T;
  source: "supabase" | "mock";
};
