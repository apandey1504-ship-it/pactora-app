
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;


create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text unique not null,
  phone text,
  role public.user_role not null default 'client',
  avatar_url text,
  kyc_status text not null default 'not_started',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested_role public.user_role := 'client';
begin
  if new.raw_user_meta_data ->> 'role' in ('client', 'contractor', 'admin', 'arbitrator') then
    requested_role := (new.raw_user_meta_data ->> 'role')::public.user_role;
  end if;

  insert into public.profiles (
    id,
    full_name,
    email,
    role,
    kyc_status
  )
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    coalesce(new.email, ''),
    requested_role,
    'not_started'
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = coalesce(excluded.full_name, public.profiles.full_name),
    role = excluded.role,
    updated_at = now();

  return new;
end;
$$;


drop trigger if exists auth_users_create_profile on auth.users;

create trigger auth_users_create_profile
after insert on auth.users
for each row execute function public.handle_new_auth_user();


create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  legal_name text,
  business_type text,
  country text,
  registration_number text,
  tax_number text,
  verification_status text not null default 'unverified',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

