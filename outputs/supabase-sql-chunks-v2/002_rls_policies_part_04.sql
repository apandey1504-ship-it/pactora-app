create policy "trust_scores_select_member_or_admin"
on public.trust_scores for select
using (public.is_company_member(company_id) or public.is_admin());


drop policy if exists "trust_scores_write_admin" on public.trust_scores;

create policy "trust_scores_write_admin"
on public.trust_scores for all
using (public.is_admin())
with check (public.is_admin());


drop policy if exists "audit_logs_select_admin" on public.audit_logs;

create policy "audit_logs_select_admin"
on public.audit_logs for select
using (public.is_admin());


drop policy if exists "audit_logs_insert_authenticated" on public.audit_logs;

create policy "audit_logs_insert_authenticated"
on public.audit_logs for insert
with check (user_id = auth.uid() or public.is_admin());


drop policy if exists "notifications_select_own_or_admin" on public.notifications;

create policy "notifications_select_own_or_admin"
on public.notifications for select
using (user_id = auth.uid() or public.is_admin());


drop policy if exists "notifications_update_own_or_admin" on public.notifications;

create policy "notifications_update_own_or_admin"
on public.notifications for update
using (user_id = auth.uid() or public.is_admin())
with check (user_id = auth.uid() or public.is_admin());


drop policy if exists "notifications_insert_admin" on public.notifications;

create policy "notifications_insert_admin"
on public.notifications for insert
with check (public.is_admin());


drop policy if exists "storage_documents_read_project_participants" on storage.objects;

create policy "storage_documents_read_project_participants"
on storage.objects for select
using (
  bucket_id = 'pactora-documents'
  and (
    public.is_admin()
    or public.is_project_participant((storage.foldername(name))[1]::uuid)
  )
);


drop policy if exists "storage_documents_upload_project_participants" on storage.objects;

create policy "storage_documents_upload_project_participants"
on storage.objects for insert
with check (
  bucket_id = 'pactora-documents'
  and (
    public.is_admin()
    or public.is_project_participant((storage.foldername(name))[1]::uuid)
  )
);


drop policy if exists "storage_documents_update_project_participants" on storage.objects;

