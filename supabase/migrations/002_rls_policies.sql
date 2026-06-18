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
alter table public.plans enable row level security;
alter table public.subscriptions enable row level security;
alter table public.projects enable row level security;
alter table public.project_participants enable row level security;
alter table public.milestones enable row level security;
alter table public.change_requests enable row level security;
alter table public.change_request_comments enable row level security;
alter table public.messages enable row level security;
alter table public.documents enable row level security;
alter table public.payments enable row level security;
alter table public.platform_fees enable row level security;
alter table public.payment_provider_events enable row level security;
alter table public.disputes enable row level security;
alter table public.trust_scores enable row level security;
alter table public.audit_logs enable row level security;
alter table public.notifications enable row level security;

drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin"
on public.profiles for select
using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles_update_own_or_admin" on public.profiles;
create policy "profiles_update_own_or_admin"
on public.profiles for update
using (id = auth.uid() or public.is_admin())
with check (id = auth.uid() or public.is_admin());

drop policy if exists "profiles_insert_own_or_admin" on public.profiles;
create policy "profiles_insert_own_or_admin"
on public.profiles for insert
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

drop policy if exists "plans_select_authenticated" on public.plans;
create policy "plans_select_authenticated"
on public.plans for select
using (auth.uid() is not null or true);

drop policy if exists "plans_write_admin" on public.plans;
create policy "plans_write_admin"
on public.plans for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "subscriptions_select_company_member_or_admin" on public.subscriptions;
create policy "subscriptions_select_company_member_or_admin"
on public.subscriptions for select
using (public.is_company_member(company_id) or public.is_admin());

drop policy if exists "subscriptions_insert_company_member_or_admin" on public.subscriptions;
create policy "subscriptions_insert_company_member_or_admin"
on public.subscriptions for insert
with check (public.is_company_member(company_id) or public.is_admin());

drop policy if exists "subscriptions_update_company_member_or_admin" on public.subscriptions;
create policy "subscriptions_update_company_member_or_admin"
on public.subscriptions for update
using (public.is_company_member(company_id) or public.is_admin())
with check (public.is_company_member(company_id) or public.is_admin());

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

drop policy if exists "platform_fees_select_project_participant_or_admin" on public.platform_fees;
create policy "platform_fees_select_project_participant_or_admin"
on public.platform_fees for select
using (public.is_project_participant(project_id) or public.is_admin());

drop policy if exists "platform_fees_write_admin" on public.platform_fees;
create policy "platform_fees_write_admin"
on public.platform_fees for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "payment_provider_events_select_admin" on public.payment_provider_events;
create policy "payment_provider_events_select_admin"
on public.payment_provider_events for select
using (public.is_admin());

drop policy if exists "payment_provider_events_write_admin" on public.payment_provider_events;
create policy "payment_provider_events_write_admin"
on public.payment_provider_events for all
using (public.is_admin())
with check (public.is_admin());

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
create policy "trust_scores_select_member_or_admin"
on public.trust_scores for select
using (public.is_company_member(company_id) or public.is_admin());

drop policy if exists "trust_scores_write_admin" on public.trust_scores;
create policy "trust_scores_write_admin"
on public.trust_scores for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "audit_logs_select_admin" on public.audit_logs;
drop policy if exists "audit_logs_select_project_participant_or_admin" on public.audit_logs;
create policy "audit_logs_select_project_participant_or_admin"
on public.audit_logs for select
using (
  public.is_admin()
  or (project_id is not null and public.is_project_participant(project_id))
  or user_id = auth.uid()
);

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
create policy "storage_documents_update_project_participants"
on storage.objects for update
using (
  bucket_id = 'pactora-documents'
  and (
    public.is_admin()
    or public.is_project_participant((storage.foldername(name))[1]::uuid)
  )
)
with check (
  bucket_id = 'pactora-documents'
  and (
    public.is_admin()
    or public.is_project_participant((storage.foldername(name))[1]::uuid)
  )
);
