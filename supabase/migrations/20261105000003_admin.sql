-- Admin panel: private notes on leads, admins can delete leads (spam or a data-removal request),
-- staff can see each other's profiles, and a cheap lead-count call for the dashboard.
alter table public.leads add column if not exists notes text check (char_length(notes) <= 4000);
alter table public.leads add column if not exists updated_at timestamptz;

create or replace function public.touch_lead() returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at = now(); return new; end; $$;
create trigger leads_touch before update on public.leads for each row execute function public.touch_lead();

create policy "admins delete leads" on public.leads for delete to authenticated using (public.is_staff('admin'));

alter policy "staff read own profile" on public.profiles rename to "staff read profiles";
alter policy "staff read profiles" on public.profiles using (id = (select auth.uid()) or public.is_staff());

-- RLS still applies inside (security invoker), so only admins get numbers.
create or replace function public.lead_counts() returns table (status public.lead_status, n bigint)
language sql stable security invoker set search_path = '' as $$
  select l.status, count(*) from public.leads l group by l.status;
$$;
revoke all on function public.lead_counts from public, anon;
grant execute on function public.lead_counts to authenticated;
