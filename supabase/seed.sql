insert into auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data
)
values
  (
    '11111111-1111-1111-1111-111111111111',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'client@pactora.test',
    crypt('password123', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Maya Chen"}'::jsonb
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'contractor@pactora.test',
    crypt('password123', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Ishaan Mehta"}'::jsonb
  )
on conflict (id) do nothing;

insert into public.profiles (id, full_name, email, phone, role, kyc_status)
values
  ('11111111-1111-1111-1111-111111111111', 'Maya Chen', 'client@pactora.test', '+1 555 0101', 'client', 'verified'),
  ('22222222-2222-2222-2222-222222222222', 'Ishaan Mehta', 'contractor@pactora.test', '+1 555 0102', 'contractor', 'verified')
on conflict (id) do update set
  full_name = excluded.full_name,
  email = excluded.email,
  phone = excluded.phone,
  role = excluded.role,
  kyc_status = excluded.kyc_status;

insert into public.companies (
  id,
  name,
  legal_name,
  business_type,
  country,
  registration_number,
  tax_number,
  verification_status
)
values
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'Northstar Foods',
    'Northstar Foods Inc.',
    'Client',
    'US',
    'NSF-2026-001',
    'US-TAX-001',
    'verified'
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'Bluepeak Studio',
    'Bluepeak Studio LLC',
    'Contractor',
    'US',
    'BPS-2026-002',
    'US-TAX-002',
    'verified'
  )
on conflict (id) do update set
  name = excluded.name,
  legal_name = excluded.legal_name,
  business_type = excluded.business_type,
  country = excluded.country,
  registration_number = excluded.registration_number,
  tax_number = excluded.tax_number,
  verification_status = excluded.verification_status;

insert into public.company_members (company_id, user_id, role)
values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'client'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 'contractor')
on conflict (company_id, user_id) do update set role = excluded.role;

insert into public.projects (
  id,
  client_company_id,
  contractor_company_id,
  title,
  description,
  project_value,
  currency,
  status,
  start_date,
  due_date,
  created_by
)
values (
  '33333333-3333-3333-3333-333333333333',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'Aurora Vendor Portal',
  'Build and launch a vendor operations portal with auditable milestone approvals.',
  84000,
  'USD',
  'active',
  current_date,
  current_date + interval '45 days',
  '11111111-1111-1111-1111-111111111111'
)
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  project_value = excluded.project_value,
  currency = excluded.currency,
  status = excluded.status,
  start_date = excluded.start_date,
  due_date = excluded.due_date;

insert into public.project_participants (project_id, user_id, role)
values
  ('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'client'),
  ('33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'contractor')
on conflict (project_id, user_id) do update set role = excluded.role;

insert into public.milestones (
  id,
  project_id,
  title,
  description,
  amount,
  currency,
  due_date,
  status,
  submitted_at,
  approved_at
)
values
  (
    '44444444-4444-4444-4444-444444444441',
    '33333333-3333-3333-3333-333333333333',
    'Contract baseline and scope lock',
    'Confirm contract terms, acceptance criteria, and project governance.',
    12000,
    'USD',
    current_date + interval '7 days',
    'approved',
    now() - interval '2 days',
    now() - interval '1 day'
  ),
  (
    '44444444-4444-4444-4444-444444444442',
    '33333333-3333-3333-3333-333333333333',
    'Prototype review and acceptance',
    'Submit prototype, acceptance evidence, and revision notes.',
    28000,
    'USD',
    current_date + interval '18 days',
    'submitted',
    now(),
    null
  ),
  (
    '44444444-4444-4444-4444-444444444443',
    '33333333-3333-3333-3333-333333333333',
    'Security evidence package',
    'Provide security checklist, access controls, and deployment notes.',
    21000,
    'USD',
    current_date + interval '32 days',
    'pending',
    null,
    null
  )
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  amount = excluded.amount,
  currency = excluded.currency,
  due_date = excluded.due_date,
  status = excluded.status,
  submitted_at = excluded.submitted_at,
  approved_at = excluded.approved_at;

insert into public.change_requests (
  id,
  project_id,
  milestone_id,
  requested_by,
  title,
  description,
  impact_cost,
  impact_days,
  status,
  approved_by_client,
  approved_by_contractor
)
values (
  '55555555-5555-5555-5555-555555555555',
  '33333333-3333-3333-3333-333333333333',
  '44444444-4444-4444-4444-444444444442',
  '11111111-1111-1111-1111-111111111111',
  'Add vendor audit export',
  'Client requested an export workflow for quarterly vendor audits.',
  7500,
  5,
  'contractor_review',
  true,
  false
)
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  impact_cost = excluded.impact_cost,
  impact_days = excluded.impact_days,
  status = excluded.status,
  approved_by_client = excluded.approved_by_client,
  approved_by_contractor = excluded.approved_by_contractor;

insert into public.messages (id, project_id, sender_id, message, message_type)
values
  (
    '66666666-6666-6666-6666-666666666661',
    '33333333-3333-3333-3333-333333333333',
    '11111111-1111-1111-1111-111111111111',
    'The approval packet looks complete. Can you attach the signed scope note before we release milestone two?',
    'text'
  ),
  (
    '66666666-6666-6666-6666-666666666662',
    '33333333-3333-3333-3333-333333333333',
    '22222222-2222-2222-2222-222222222222',
    'Uploaded it now. I also marked the change request as ready for your review.',
    'text'
  ),
  (
    '66666666-6666-6666-6666-666666666663',
    '33333333-3333-3333-3333-333333333333',
    '11111111-1111-1111-1111-111111111111',
    'Great. We will review the change impact and respond today.',
    'text'
  )
on conflict (id) do update set
  message = excluded.message,
  message_type = excluded.message_type;

insert into public.trust_scores (
  company_id,
  score,
  completion_rate,
  on_time_rate,
  dispute_rate,
  payment_reliability,
  last_calculated_at
)
values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 94, 96, 94, 0, 98, now()),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 89, 91, 88, 0, 92, now())
on conflict (company_id) do update set
  score = excluded.score,
  completion_rate = excluded.completion_rate,
  on_time_rate = excluded.on_time_rate,
  dispute_rate = excluded.dispute_rate,
  payment_reliability = excluded.payment_reliability,
  last_calculated_at = excluded.last_calculated_at;
