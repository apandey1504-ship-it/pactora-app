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

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'pactora-documents',
  'pactora-documents',
  false,
  52428800,
  array[
    'application/pdf',
