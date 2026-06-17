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
