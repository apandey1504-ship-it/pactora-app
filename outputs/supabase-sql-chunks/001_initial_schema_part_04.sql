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
