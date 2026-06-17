create trigger profiles_updated_at
before update on public.profiles
for each row execute function public.update_updated_at_column();


drop trigger if exists companies_updated_at on public.companies;

create trigger companies_updated_at
before update on public.companies
for each row execute function public.update_updated_at_column();


drop trigger if exists projects_updated_at on public.projects;

create trigger projects_updated_at
before update on public.projects
for each row execute function public.update_updated_at_column();


drop trigger if exists milestones_updated_at on public.milestones;

create trigger milestones_updated_at
before update on public.milestones
for each row execute function public.update_updated_at_column();


drop trigger if exists change_requests_updated_at on public.change_requests;

create trigger change_requests_updated_at
before update on public.change_requests
for each row execute function public.update_updated_at_column();


drop trigger if exists payments_updated_at on public.payments;

create trigger payments_updated_at
before update on public.payments
for each row execute function public.update_updated_at_column();


drop trigger if exists disputes_updated_at on public.disputes;

create trigger disputes_updated_at
before update on public.disputes
for each row execute function public.update_updated_at_column();


drop trigger if exists trust_scores_updated_at on public.trust_scores;

create trigger trust_scores_updated_at
before update on public.trust_scores
for each row execute function public.update_updated_at_column();

