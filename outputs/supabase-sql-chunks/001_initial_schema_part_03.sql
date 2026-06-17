create table if not exists public.disputes (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  milestone_id uuid references public.milestones(id) on delete set null,
  raised_by uuid not null references public.profiles(id),
  reason text not null,
  description text,
  status public.dispute_status not null default 'open',
  resolution text,
  resolved_by uuid references public.profiles(id),
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.trust_scores (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  score integer not null default 70 check (score >= 0 and score <= 100),
  completion_rate numeric(5, 2) not null default 0,
  on_time_rate numeric(5, 2) not null default 0,
  dispute_rate numeric(5, 2) not null default 0,
  payment_reliability numeric(5, 2) not null default 0,
  last_calculated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (company_id)
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  project_id uuid references public.projects(id) on delete set null,
  action text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  body text,
  read_status boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists profiles_role_idx on public.profiles(role);
create index if not exists profiles_email_idx on public.profiles(email);

create index if not exists company_members_company_id_idx on public.company_members(company_id);
create index if not exists company_members_user_id_idx on public.company_members(user_id);
create index if not exists company_members_role_idx on public.company_members(role);

create index if not exists projects_client_company_id_idx on public.projects(client_company_id);
create index if not exists projects_contractor_company_id_idx on public.projects(contractor_company_id);
create index if not exists projects_created_by_idx on public.projects(created_by);
create index if not exists projects_status_idx on public.projects(status);

create index if not exists project_participants_project_id_idx on public.project_participants(project_id);
create index if not exists project_participants_user_id_idx on public.project_participants(user_id);
create index if not exists project_participants_role_idx on public.project_participants(role);

create index if not exists milestones_project_id_idx on public.milestones(project_id);
create index if not exists milestones_status_idx on public.milestones(status);

create index if not exists change_requests_project_id_idx on public.change_requests(project_id);
create index if not exists change_requests_milestone_id_idx on public.change_requests(milestone_id);
create index if not exists change_requests_requested_by_idx on public.change_requests(requested_by);
create index if not exists change_requests_status_idx on public.change_requests(status);

create index if not exists change_request_comments_change_request_id_idx on public.change_request_comments(change_request_id);
create index if not exists change_request_comments_user_id_idx on public.change_request_comments(user_id);

create index if not exists messages_project_id_idx on public.messages(project_id);
create index if not exists messages_sender_id_idx on public.messages(sender_id);
create index if not exists messages_message_type_idx on public.messages(message_type);

create index if not exists documents_project_id_idx on public.documents(project_id);
create index if not exists documents_milestone_id_idx on public.documents(milestone_id);
create index if not exists documents_uploaded_by_idx on public.documents(uploaded_by);

create index if not exists payments_project_id_idx on public.payments(project_id);
create index if not exists payments_milestone_id_idx on public.payments(milestone_id);
create index if not exists payments_payer_company_id_idx on public.payments(payer_company_id);
create index if not exists payments_payee_company_id_idx on public.payments(payee_company_id);
create index if not exists payments_status_idx on public.payments(status);

create index if not exists disputes_project_id_idx on public.disputes(project_id);
create index if not exists disputes_milestone_id_idx on public.disputes(milestone_id);
