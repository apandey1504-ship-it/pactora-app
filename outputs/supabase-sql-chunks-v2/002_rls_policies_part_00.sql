create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;


create or replace function public.is_company_member(target_company_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.company_members
    where company_id = target_company_id
      and user_id = auth.uid()
  );
$$;


create or replace function public.is_project_participant(target_project_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.project_participants
    where project_id = target_project_id
      and user_id = auth.uid()
  );
$$;


create or replace function public.can_access_change_request(target_change_request_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.change_requests cr
    where cr.id = target_change_request_id
      and public.is_project_participant(cr.project_id)
  );
$$;


alter table public.profiles enable row level security;

alter table public.companies enable row level security;

alter table public.company_members enable row level security;

alter table public.projects enable row level security;

alter table public.project_participants enable row level security;

alter table public.milestones enable row level security;

alter table public.change_requests enable row level security;

alter table public.change_request_comments enable row level security;

alter table public.messages enable row level security;

alter table public.documents enable row level security;

alter table public.payments enable row level security;

alter table public.disputes enable row level security;

alter table public.trust_scores enable row level security;

