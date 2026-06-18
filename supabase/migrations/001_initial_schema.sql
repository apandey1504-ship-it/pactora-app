create extension if not exists "pgcrypto";

do $$
begin
  create type public.user_role as enum ('client', 'contractor', 'admin', 'arbitrator');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.project_status as enum (
    'draft',
    'pending_acceptance',
    'active',
    'paused',
    'completed',
    'cancelled',
    'disputed'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.milestone_status as enum (
    'draft',
    'pending',
    'funded',
    'in_progress',
    'submitted',
    'approved',
    'revision_requested',
    'paid',
    'disputed'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.change_request_status as enum (
    'requested',
    'contractor_review',
    'client_review',
    'approved',
    'rejected',
    'cancelled'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.payment_status as enum (
    'pending',
    'funded',
    'released',
    'refunded',
    'disputed',
    'failed'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.dispute_status as enum (
    'open',
    'under_review',
    'resolved',
    'rejected'
  );
exception
  when duplicate_object then null;
end $$;

create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text unique not null,
  phone text,
  role public.user_role not null default 'client',
  avatar_url text,
  kyc_status text not null default 'not_started',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested_role public.user_role := 'client';
begin
  if new.raw_user_meta_data ->> 'role' in ('client', 'contractor', 'admin', 'arbitrator') then
    requested_role := (new.raw_user_meta_data ->> 'role')::public.user_role;
  end if;

  insert into public.profiles (
    id,
    full_name,
    email,
    role,
    kyc_status
  )
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    coalesce(new.email, ''),
    requested_role,
    'not_started'
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = coalesce(excluded.full_name, public.profiles.full_name),
    role = excluded.role,
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists auth_users_create_profile on auth.users;
create trigger auth_users_create_profile
after insert on auth.users
for each row execute function public.handle_new_auth_user();

create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  legal_name text,
  business_type text,
  country text,
  registration_number text,
  tax_number text,
  verification_status text not null default 'unverified',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.company_members (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role public.user_role not null,
  created_at timestamptz not null default now(),
  unique (company_id, user_id)
);

create table if not exists public.plans (
  id text primary key,
  name text not null,
  monthly_price numeric(10, 2),
  transaction_fee_percent numeric(5, 2),
  features jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  plan_id text not null references public.plans(id),
  status text not null default 'active',
  started_at timestamptz not null default now(),
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (company_id)
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  client_company_id uuid not null references public.companies(id),
  contractor_company_id uuid references public.companies(id),
  title text not null,
  description text,
  project_value numeric(14, 2) not null default 0,
  currency text not null default 'USD',
  status public.project_status not null default 'draft',
  start_date date,
  due_date date,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_participants (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role public.user_role not null,
  created_at timestamptz not null default now(),
  unique (project_id, user_id)
);

create table if not exists public.milestones (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  description text,
  amount numeric(14, 2) not null default 0,
  currency text not null default 'USD',
  due_date date,
  status public.milestone_status not null default 'draft',
  submitted_at timestamptz,
  approved_at timestamptz,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.change_requests (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  milestone_id uuid references public.milestones(id) on delete set null,
  requested_by uuid not null references public.profiles(id),
  title text not null,
  description text,
  impact_cost numeric(14, 2) not null default 0,
  impact_days integer not null default 0,
  status public.change_request_status not null default 'requested',
  approved_by_client boolean not null default false,
  approved_by_contractor boolean not null default false,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.change_request_comments (
  id uuid primary key default gen_random_uuid(),
  change_request_id uuid not null references public.change_requests(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  comment text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  sender_id uuid not null references public.profiles(id),
  message text not null,
  message_type text not null default 'text',
  created_at timestamptz not null default now()
);

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
  platform_fee_amount numeric(14, 2) not null default 0,
  payment_provider_fee_amount numeric(14, 2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.payments add column if not exists platform_fee_amount numeric(14, 2) not null default 0;
alter table public.payments add column if not exists payment_provider_fee_amount numeric(14, 2);

create table if not exists public.platform_fees (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  milestone_id uuid references public.milestones(id) on delete set null,
  company_id uuid not null references public.companies(id) on delete cascade,
  amount numeric(14, 2) not null default 0,
  fee_percent numeric(5, 2) not null default 0,
  payment_provider_fee_amount numeric(14, 2),
  status text not null default 'estimated',
  created_at timestamptz not null default now()
);

create table if not exists public.payment_provider_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  event_type text not null,
  provider_event_id text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
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

create index if not exists subscriptions_company_id_idx on public.subscriptions(company_id);
create index if not exists subscriptions_plan_id_idx on public.subscriptions(plan_id);
create index if not exists subscriptions_status_idx on public.subscriptions(status);

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

create index if not exists platform_fees_project_id_idx on public.platform_fees(project_id);
create index if not exists platform_fees_milestone_id_idx on public.platform_fees(milestone_id);
create index if not exists platform_fees_company_id_idx on public.platform_fees(company_id);
create index if not exists platform_fees_status_idx on public.platform_fees(status);

create index if not exists payment_provider_events_provider_idx on public.payment_provider_events(provider);
create index if not exists payment_provider_events_event_type_idx on public.payment_provider_events(event_type);
create index if not exists payment_provider_events_provider_event_id_idx on public.payment_provider_events(provider_event_id);

create index if not exists disputes_project_id_idx on public.disputes(project_id);
create index if not exists disputes_milestone_id_idx on public.disputes(milestone_id);
create index if not exists disputes_raised_by_idx on public.disputes(raised_by);
create index if not exists disputes_resolved_by_idx on public.disputes(resolved_by);
create index if not exists disputes_status_idx on public.disputes(status);

create index if not exists trust_scores_company_id_idx on public.trust_scores(company_id);
create index if not exists trust_scores_score_idx on public.trust_scores(score);

create index if not exists audit_logs_user_id_idx on public.audit_logs(user_id);
create index if not exists audit_logs_project_id_idx on public.audit_logs(project_id);
create index if not exists audit_logs_action_idx on public.audit_logs(action);

create index if not exists notifications_user_id_idx on public.notifications(user_id);
create index if not exists notifications_read_status_idx on public.notifications(read_status);

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
before update on public.profiles
for each row execute function public.update_updated_at_column();

drop trigger if exists companies_updated_at on public.companies;
create trigger companies_updated_at
before update on public.companies
for each row execute function public.update_updated_at_column();

drop trigger if exists subscriptions_updated_at on public.subscriptions;
create trigger subscriptions_updated_at
before update on public.subscriptions
for each row execute function public.update_updated_at_column();

drop trigger if exists projects_updated_at on public.projects;
create trigger projects_updated_at
before update on public.projects
for each row execute function public.update_updated_at_column();

drop trigger if exists milestones_updated_at on public.milestones;
create trigger milestones_updated_at
before update on public.milestones
for each row execute function public.update_updated_at_column();

drop trigger if exists change_requests_updated_at on public.change_requests;
create trigger change_requests_updated_at
before update on public.change_requests
for each row execute function public.update_updated_at_column();

drop trigger if exists payments_updated_at on public.payments;
create trigger payments_updated_at
before update on public.payments
for each row execute function public.update_updated_at_column();

drop trigger if exists disputes_updated_at on public.disputes;
create trigger disputes_updated_at
before update on public.disputes
for each row execute function public.update_updated_at_column();

drop trigger if exists trust_scores_updated_at on public.trust_scores;
create trigger trust_scores_updated_at
before update on public.trust_scores
for each row execute function public.update_updated_at_column();

insert into public.plans (id, name, monthly_price, transaction_fee_percent, features)
values
  ('starter', 'Starter', 0, 3, '["1 active project", "Basic milestone tracking", "Basic change requests", "Basic messaging", "500 MB document storage", "Pactora Secure Milestone Payments available", "Standard support"]'::jsonb),
  ('pro', 'Pro', 49, 3, '["Up to 10 active projects", "Unlimited milestones", "Change Governance Engine™", "Audit trail", "5 GB document storage", "Email notifications", "Pactora Secure Milestone Payments"]'::jsonb),
  ('business', 'Business', 199, 2, '["Unlimited active projects", "Team members", "Advanced Change Governance Engine™", "Business verification badge", "Advanced audit trail", "50 GB document storage", "Admin controls", "Dispute documentation center"]'::jsonb),
  ('enterprise', 'Enterprise', null, null, '["Custom workflows", "API access", "Dedicated success manager", "Custom verification workflows", "Custom reporting", "Advanced permissions", "SSO-ready architecture", "Volume pricing"]'::jsonb)
on conflict (id) do update set
  name = excluded.name,
  monthly_price = excluded.monthly_price,
  transaction_fee_percent = excluded.transaction_fee_percent,
  features = excluded.features;

create or replace function public.calculate_basic_trust_score(company_id uuid)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  total_milestones numeric;
  completed_milestones numeric;
  late_milestones numeric;
  total_disputes numeric;
  released_payments numeric;
  total_payments numeric;
  completion_rate_value numeric := 0;
  on_time_rate_value numeric := 0;
  dispute_rate_value numeric := 0;
  payment_reliability_value numeric := 0;
  calculated_score integer := 70;
begin
  select count(*)
  into total_milestones
  from public.milestones m
  join public.projects p on p.id = m.project_id
  where p.client_company_id = $1
     or p.contractor_company_id = $1;

  select count(*)
  into completed_milestones
  from public.milestones m
  join public.projects p on p.id = m.project_id
  where (p.client_company_id = $1 or p.contractor_company_id = $1)
    and m.status in ('approved', 'paid');

  select count(*)
  into late_milestones
  from public.milestones m
  join public.projects p on p.id = m.project_id
  where (p.client_company_id = $1 or p.contractor_company_id = $1)
    and m.due_date is not null
    and m.due_date < current_date
    and m.status not in ('approved', 'paid');

  select count(*)
  into total_disputes
  from public.disputes d
  join public.projects p on p.id = d.project_id
  where p.client_company_id = $1
     or p.contractor_company_id = $1;

  select count(*)
  into total_payments
  from public.payments
  where payer_company_id = $1
     or payee_company_id = $1;

  select count(*)
  into released_payments
  from public.payments
  where (payer_company_id = $1 or payee_company_id = $1)
    and status = 'released';

  if total_milestones > 0 then
    completion_rate_value := round((completed_milestones / total_milestones) * 100, 2);
    on_time_rate_value := greatest(0, round(((total_milestones - late_milestones) / total_milestones) * 100, 2));
    dispute_rate_value := round((total_disputes / total_milestones) * 100, 2);
  end if;

  if total_payments > 0 then
    payment_reliability_value := round((released_payments / total_payments) * 100, 2);
  else
    payment_reliability_value := 80;
  end if;

  calculated_score := least(
    100,
    greatest(
      0,
      round(
        (completion_rate_value * 0.35)
        + (on_time_rate_value * 0.25)
        + ((100 - least(dispute_rate_value, 100)) * 0.20)
        + (payment_reliability_value * 0.20)
      )::integer
    )
  );

  insert into public.trust_scores (
    company_id,
    score,
    completion_rate,
    on_time_rate,
    dispute_rate,
    payment_reliability,
    last_calculated_at
  )
  values (
    $1,
    calculated_score,
    completion_rate_value,
    on_time_rate_value,
    dispute_rate_value,
    payment_reliability_value,
    now()
  )
  on conflict (company_id)
  do update set
    score = excluded.score,
    completion_rate = excluded.completion_rate,
    on_time_rate = excluded.on_time_rate,
    dispute_rate = excluded.dispute_rate,
    payment_reliability = excluded.payment_reliability,
    last_calculated_at = excluded.last_calculated_at,
    updated_at = now();

  return calculated_score;
end;
$$;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'pactora-documents',
  'pactora-documents',
  false,
  52428800,
  array[
    'application/pdf',
    'image/png',
    'image/jpeg',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
