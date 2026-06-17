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
);


drop policy if exists "change_requests_update_project_participant_or_admin" on public.change_requests;

create policy "change_requests_update_project_participant_or_admin"
on public.change_requests for update
using (public.is_project_participant(project_id) or public.is_admin())
with check (public.is_project_participant(project_id) or public.is_admin());


drop policy if exists "change_request_comments_select_project_participant_or_admin" on public.change_request_comments;

create policy "change_request_comments_select_project_participant_or_admin"
on public.change_request_comments for select
using (public.can_access_change_request(change_request_id) or public.is_admin());


drop policy if exists "change_request_comments_insert_project_participant_or_admin" on public.change_request_comments;

create policy "change_request_comments_insert_project_participant_or_admin"
on public.change_request_comments for insert
with check (
  user_id = auth.uid()
  and (public.can_access_change_request(change_request_id) or public.is_admin())
);


drop policy if exists "messages_select_project_participant_or_admin" on public.messages;

create policy "messages_select_project_participant_or_admin"
on public.messages for select
using (public.is_project_participant(project_id) or public.is_admin());

