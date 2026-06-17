
drop policy if exists "messages_insert_project_participant_or_admin" on public.messages;

create policy "messages_insert_project_participant_or_admin"
on public.messages for insert
with check (
  sender_id = auth.uid()
  and (public.is_project_participant(project_id) or public.is_admin())
);


drop policy if exists "documents_select_project_participant_or_admin" on public.documents;

create policy "documents_select_project_participant_or_admin"
on public.documents for select
using (public.is_project_participant(project_id) or public.is_admin());


drop policy if exists "documents_insert_project_participant_or_admin" on public.documents;

create policy "documents_insert_project_participant_or_admin"
on public.documents for insert
with check (
  uploaded_by = auth.uid()
  and (public.is_project_participant(project_id) or public.is_admin())
);


drop policy if exists "payments_select_project_participant_or_admin" on public.payments;

create policy "payments_select_project_participant_or_admin"
on public.payments for select
using (public.is_project_participant(project_id) or public.is_admin());


drop policy if exists "payments_insert_project_participant_or_admin" on public.payments;

create policy "payments_insert_project_participant_or_admin"
on public.payments for insert
with check (public.is_project_participant(project_id) or public.is_admin());


drop policy if exists "payments_update_project_participant_or_admin" on public.payments;

create policy "payments_update_project_participant_or_admin"
on public.payments for update
using (public.is_project_participant(project_id) or public.is_admin())
with check (public.is_project_participant(project_id) or public.is_admin());


drop policy if exists "disputes_select_project_participant_or_admin" on public.disputes;

create policy "disputes_select_project_participant_or_admin"
on public.disputes for select
using (public.is_project_participant(project_id) or public.is_admin());


drop policy if exists "disputes_insert_project_participant_or_admin" on public.disputes;

create policy "disputes_insert_project_participant_or_admin"
on public.disputes for insert
with check (
  raised_by = auth.uid()
  and (public.is_project_participant(project_id) or public.is_admin())
);


drop policy if exists "disputes_update_admin_or_arbitrator" on public.disputes;

create policy "disputes_update_admin_or_arbitrator"
on public.disputes for update
using (
  public.is_admin()
  or exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role = 'arbitrator'
  )
)
with check (
  public.is_admin()
  or exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role = 'arbitrator'
  )
);


drop policy if exists "trust_scores_select_member_or_admin" on public.trust_scores;

