with check (id = auth.uid() or public.is_admin());

drop policy if exists "companies_select_member_or_admin" on public.companies;
create policy "companies_select_member_or_admin"
on public.companies for select
using (public.is_company_member(id) or public.is_admin());

drop policy if exists "companies_update_member_or_admin" on public.companies;
create policy "companies_update_member_or_admin"
on public.companies for update
using (public.is_company_member(id) or public.is_admin())
with check (public.is_company_member(id) or public.is_admin());

drop policy if exists "companies_insert_authenticated" on public.companies;
create policy "companies_insert_authenticated"
on public.companies for insert
with check (auth.uid() is not null);

drop policy if exists "company_members_select_company_member_or_admin" on public.company_members;
create policy "company_members_select_company_member_or_admin"
on public.company_members for select
using (public.is_company_member(company_id) or public.is_admin());

drop policy if exists "company_members_insert_admin_or_self" on public.company_members;
create policy "company_members_insert_admin_or_self"
on public.company_members for insert
with check (public.is_admin() or user_id = auth.uid());

drop policy if exists "company_members_update_admin" on public.company_members;
create policy "company_members_update_admin"
on public.company_members for update
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "projects_select_participant_or_admin" on public.projects;
create policy "projects_select_participant_or_admin"
on public.projects for select
using (public.is_project_participant(id) or public.is_admin());

drop policy if exists "projects_insert_company_member_or_admin" on public.projects;
create policy "projects_insert_company_member_or_admin"
on public.projects for insert
with check (
  created_by = auth.uid()
  and (public.is_company_member(client_company_id) or public.is_admin())
);

drop policy if exists "projects_update_participant_or_admin" on public.projects;
create policy "projects_update_participant_or_admin"
on public.projects for update
using (public.is_project_participant(id) or public.is_admin())
with check (public.is_project_participant(id) or public.is_admin());

drop policy if exists "project_participants_select_participant_or_admin" on public.project_participants;
create policy "project_participants_select_participant_or_admin"
on public.project_participants for select
using (public.is_project_participant(project_id) or public.is_admin());

drop policy if exists "project_participants_insert_project_member_or_admin" on public.project_participants;
create policy "project_participants_insert_project_member_or_admin"
on public.project_participants for insert
with check (public.is_project_participant(project_id) or user_id = auth.uid() or public.is_admin());

drop policy if exists "milestones_select_project_participant_or_admin" on public.milestones;
create policy "milestones_select_project_participant_or_admin"
on public.milestones for select
using (public.is_project_participant(project_id) or public.is_admin());

drop policy if exists "milestones_insert_project_participant_or_admin" on public.milestones;
create policy "milestones_insert_project_participant_or_admin"
on public.milestones for insert
with check (public.is_project_participant(project_id) or public.is_admin());

drop policy if exists "milestones_update_project_participant_or_admin" on public.milestones;
create policy "milestones_update_project_participant_or_admin"
on public.milestones for update
using (public.is_project_participant(project_id) or public.is_admin())
with check (public.is_project_participant(project_id) or public.is_admin());

drop policy if exists "change_requests_select_project_participant_or_admin" on public.change_requests;
create policy "change_requests_select_project_participant_or_admin"
on public.change_requests for select
using (public.is_project_participant(project_id) or public.is_admin());

drop policy if exists "change_requests_insert_project_participant_or_admin" on public.change_requests;
create policy "change_requests_insert_project_participant_or_admin"
on public.change_requests for insert
with check (
  requested_by = auth.uid()
  and (public.is_project_participant(project_id) or public.is_admin())
