
create or replace function public.calculate_basic_trust_score(company_id uuid)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  total_milestones numeric;
  completed_milestones numeric;
  late_milestones numeric;
  total_disputes numeric;
  released_payments numeric;
  total_payments numeric;
  completion_rate_value numeric := 0;
  on_time_rate_value numeric := 0;
  dispute_rate_value numeric := 0;
  payment_reliability_value numeric := 0;
  calculated_score integer := 70;
begin
  select count(*)
  into total_milestones
  from public.milestones m
  join public.projects p on p.id = m.project_id
  where p.client_company_id = $1
     or p.contractor_company_id = $1;

  select count(*)
  into completed_milestones
  from public.milestones m
  join public.projects p on p.id = m.project_id
  where (p.client_company_id = $1 or p.contractor_company_id = $1)
    and m.status in ('approved', 'paid');

  select count(*)
  into late_milestones
  from public.milestones m
  join public.projects p on p.id = m.project_id
  where (p.client_company_id = $1 or p.contractor_company_id = $1)
    and m.due_date is not null
    and m.due_date < current_date
    and m.status not in ('approved', 'paid');

  select count(*)
  into total_disputes
  from public.disputes d
  join public.projects p on p.id = d.project_id
  where p.client_company_id = $1
     or p.contractor_company_id = $1;

  select count(*)
  into total_payments
  from public.payments
  where payer_company_id = $1
     or payee_company_id = $1;

  select count(*)
  into released_payments
  from public.payments
  where (payer_company_id = $1 or payee_company_id = $1)
    and status = 'released';

  if total_milestones > 0 then
    completion_rate_value := round((completed_milestones / total_milestones) * 100, 2);
    on_time_rate_value := greatest(0, round(((total_milestones - late_milestones) / total_milestones) * 100, 2));
    dispute_rate_value := round((total_disputes / total_milestones) * 100, 2);
  end if;

  if total_payments > 0 then
    payment_reliability_value := round((released_payments / total_payments) * 100, 2);
  else
    payment_reliability_value := 80;
  end if;

  calculated_score := least(
    100,
    greatest(
      0,
      round(
        (completion_rate_value * 0.35)
        + (on_time_rate_value * 0.25)
        + ((100 - least(dispute_rate_value, 100)) * 0.20)
        + (payment_reliability_value * 0.20)
      )::integer
    )
  );

  insert into public.trust_scores (
    company_id,
    score,
    completion_rate,
    on_time_rate,
    dispute_rate,
    payment_reliability,
    last_calculated_at
  )
  values (
    $1,
    calculated_score,
    completion_rate_value,
    on_time_rate_value,
    dispute_rate_value,
    payment_reliability_value,
    now()
  )
  on conflict (company_id)
  do update set
    score = excluded.score,
    completion_rate = excluded.completion_rate,
    on_time_rate = excluded.on_time_rate,
    dispute_rate = excluded.dispute_rate,
    payment_reliability = excluded.payment_reliability,
    last_calculated_at = excluded.last_calculated_at,
    updated_at = now();

  return calculated_score;
end;
$$;

