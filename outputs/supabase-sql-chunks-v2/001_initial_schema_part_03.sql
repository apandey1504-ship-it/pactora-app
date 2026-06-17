
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  milestone_id uuid references public.milestones(id) on delete set null,
  uploaded_by uuid not null references public.profiles(id),
  file_name text not null,
  file_url text not null,
  file_type text,
  created_at timestamptz not null default now()
);


create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  milestone_id uuid not null references public.milestones(id),
  payer_company_id uuid not null references public.companies(id),
  payee_company_id uuid not null references public.companies(id),
  amount numeric(14, 2) not null,
  currency text not null default 'USD',
  status public.payment_status not null default 'pending',
  provider text,
  provider_payment_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


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

