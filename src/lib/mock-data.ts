import { ChangeRequest, Message, Milestone, MockUser, Project, ProjectDocument, TrustScore } from "@/types";

export const mockUser: MockUser = {
  id: "11111111-1111-1111-1111-111111111111",
  email: "maya@northstar.example",
  fullName: "Maya Chen",
  role: "client",
  companyId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"
};

export const projects: Project[] = [
  {
    id: "aurora-platform",
    name: "Aurora Vendor Portal",
    company: "Northstar Foods",
    counterparty: "Bluepeak Studio",
    value: "$84,000",
    progress: 68,
    status: "active",
    dueDate: "Jul 22, 2026",
    trustScore: 94
  },
  {
    id: "ledger-migration",
    name: "Ledger Migration",
    company: "Finora Labs",
    counterparty: "AtlasOps",
    value: "$126,500",
    progress: 42,
    status: "in_review",
    dueDate: "Aug 04, 2026",
    trustScore: 89
  },
  {
    id: "compliance-redesign",
    name: "Compliance Redesign",
    company: "Solace Health",
    counterparty: "Cobalt Legal Tech",
    value: "$51,200",
    progress: 91,
    status: "pending",
    dueDate: "Jun 29, 2026",
    trustScore: 97
  }
];

export const milestones: Milestone[] = [
  {
    id: "m1",
    projectId: "aurora-platform",
    title: "Contract baseline and scope lock",
    owner: "Client",
    amount: "$12,000",
    dueDate: "Jun 24, 2026",
    status: "approved"
  },
  {
    id: "m2",
    projectId: "aurora-platform",
    title: "Prototype review and acceptance",
    owner: "Contractor",
    amount: "$28,000",
    dueDate: "Jul 03, 2026",
    status: "in_review"
  },
  {
    id: "m3",
    projectId: "ledger-migration",
    title: "Security evidence package",
    owner: "Contractor",
    amount: "$21,000",
    dueDate: "Jul 18, 2026",
    status: "pending"
  },
  {
    id: "m4",
    projectId: "ledger-migration",
    title: "Go-live approval",
    owner: "Client",
    amount: "$23,000",
    dueDate: "Jul 22, 2026",
    status: "pending"
  }
];

export const changeRequests: ChangeRequest[] = [
  {
    id: "cr-104",
    projectId: "aurora-platform",
    milestoneId: "m2",
    title: "Add vendor audit export",
    requester: "Northstar Foods",
    impact: "+$7,500 and 5 business days",
    impactCost: 7500,
    impactDays: 5,
    status: "pending",
    summary: "Client requested an export workflow for quarterly vendor audits."
  },
  {
    id: "cr-099",
    projectId: "aurora-platform",
    milestoneId: null,
    title: "Move SSO to phase two",
    requester: "Bluepeak Studio",
    impact: "No cost change, timeline risk reduced",
    impactCost: 0,
    impactDays: 0,
    status: "approved",
    summary: "Contractor proposed moving SSO until after the pilot launch."
  },
  {
    id: "cr-083",
    projectId: "ledger-migration",
    milestoneId: null,
    title: "Mobile breakpoint polish",
    requester: "Northstar Foods",
    impact: "+$2,100",
    impactCost: 2100,
    impactDays: 0,
    status: "rejected",
    summary: "Request was rejected because the existing scope already covers responsive QA."
  }
];

export const messages: Message[] = [
  {
    id: "msg-1",
    author: "Maya Chen",
    role: "client",
    body: "The approval packet looks complete. Can you attach the signed scope note before we release milestone two?",
    time: "9:42 AM"
  },
  {
    id: "msg-2",
    author: "Ishaan Mehta",
    role: "contractor",
    body: "Uploaded it now. I also marked the change request as ready for your review.",
    time: "9:56 AM"
  },
  {
    id: "msg-3",
    author: "Pactora Assurance",
    role: "admin",
    body: "Automated check passed: payment terms, acceptance criteria, and timeline references are aligned.",
    time: "10:03 AM"
  }
];

export const documents: ProjectDocument[] = [
  {
    id: "doc-1",
    projectId: "aurora-platform",
    name: "Master services agreement.pdf",
    fileUrl: "#",
    createdAt: "Jun 17, 2026"
  },
  {
    id: "doc-2",
    projectId: "aurora-platform",
    name: "Signed scope note.pdf",
    fileUrl: "#",
    createdAt: "Jun 20, 2026"
  },
  {
    id: "doc-3",
    projectId: "ledger-migration",
    name: "Acceptance criteria.xlsx",
    fileUrl: "#",
    createdAt: "Jun 25, 2026"
  }
];

export const trustScores: TrustScore[] = [
  {
    id: "trust-1",
    companyId: "mock-northstar",
    score: 94,
    signal: {
      on_time_approvals: 96,
      verified_business: true,
      dispute_risk: "low",
      payment_history: "clean"
    },
    createdAt: "Jun 17, 2026"
  },
  {
    id: "trust-2",
    companyId: "mock-bluepeak",
    score: 89,
    signal: {
      on_time_approvals: 91,
      verified_business: true,
      dispute_risk: "low",
      payment_history: "clean"
    },
    createdAt: "Jun 17, 2026"
  }
];

export const trustSignals = [
  "On-time approvals",
  "Verified business",
  "Low dispute risk",
  "Clean payment history"
];

export const dashboardStats = [
  { label: "Active projects", value: "18", delta: "+12%" },
  { label: "Protected value", value: "$1.8M", delta: "+24%" },
  { label: "Milestones due", value: "7", delta: "3 urgent" },
  { label: "Trust score", value: "94", delta: "Excellent" }
];
