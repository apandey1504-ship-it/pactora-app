
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

