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

alter table public.companies enable row level security;
alter table public.company_members enable row level security;

drop policy if exists "companies_insert_authenticated" on public.companies;
create policy "companies_insert_authenticated"
on public.companies for insert
with check (auth.uid() is not null);

drop policy if exists "companies_select_member_or_admin" on public.companies;
create policy "companies_select_member_or_admin"
on public.companies for select
using (public.is_company_member(id) or public.is_admin());

drop policy if exists "companies_update_member_or_admin" on public.companies;
create policy "companies_update_member_or_admin"
on public.companies for update
using (public.is_company_member(id) or public.is_admin())
with check (public.is_company_member(id) or public.is_admin());

drop policy if exists "company_members_insert_admin_or_self" on public.company_members;
create policy "company_members_insert_admin_or_self"
on public.company_members for insert
with check (public.is_admin() or user_id = auth.uid());

drop policy if exists "company_members_select_company_member_or_admin" on public.company_members;
create policy "company_members_select_company_member_or_admin"
on public.company_members for select
using (public.is_company_member(company_id) or user_id = auth.uid() or public.is_admin());

notify pgrst, 'reload schema';
