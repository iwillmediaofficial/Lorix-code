-- LORIX Energy website: blog posts, admin profiles, enquiry leads, rate limiting.
-- Visitors never touch tables directly: posts are read-only when published,
-- and leads can only be created through the submit_lead() function.

create extension if not exists pgcrypto;

create type public.enquiry_type as enum ('product', 'partner', 'distribution', 'support', 'sodium_ion', 'other');
create type public.lead_status as enum ('new', 'contacted', 'won', 'closed');
create type public.post_status as enum ('draft', 'published');
create type public.staff_role as enum ('admin', 'editor');

-- Admin / editor profiles (linked to Supabase Auth users)
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null,
  role public.staff_role not null default 'editor',
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

create or replace function public.is_staff(min_role public.staff_role default 'editor')
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid())
      and (min_role = 'editor' or p.role = 'admin')
  );
$$;

create policy "staff read own profile" on public.profiles for select to authenticated using (id = (select auth.uid()));
create policy "admins manage profiles" on public.profiles for all to authenticated using (public.is_staff('admin')) with check (public.is_staff('admin'));

-- Blog posts
create table public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null check (char_length(title) between 5 and 140),
  excerpt text not null check (char_length(excerpt) <= 320),
  body_md text not null,
  cover_url text,
  cover_alt text,
  tags text[] not null default '{}',
  status public.post_status not null default 'draft',
  published_at timestamptz,
  seo_title text check (char_length(seo_title) <= 70),
  seo_description text check (char_length(seo_description) <= 170),
  reading_minutes int,
  author_name text not null default 'LORIX Energy Team',
  author_id uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index posts_published_idx on public.posts (status, published_at desc);
alter table public.posts enable row level security;

create policy "public reads published posts" on public.posts for select to anon, authenticated
  using (status = 'published' and published_at <= now());
create policy "staff read all posts" on public.posts for select to authenticated using (public.is_staff());
create policy "staff insert posts" on public.posts for insert to authenticated with check (public.is_staff());
create policy "staff update posts" on public.posts for update to authenticated using (public.is_staff()) with check (public.is_staff());
create policy "admins delete posts" on public.posts for delete to authenticated using (public.is_staff('admin'));

create or replace function public.touch_updated_at() returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at = now(); return new; end; $$;
create trigger posts_touch before update on public.posts for each row execute function public.touch_updated_at();

-- Enquiry leads
create table public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null check (char_length(full_name) between 2 and 120),
  email text not null check (char_length(email) <= 200 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  phone text not null check (phone ~ '^\+?[0-9 ]{10,16}$'),
  enquiry_type public.enquiry_type not null,
  city_state text check (char_length(city_state) <= 120),
  message text not null check (char_length(message) between 5 and 2000),
  source_page text check (char_length(source_page) <= 200),
  utm jsonb,
  consent_at timestamptz not null,
  status public.lead_status not null default 'new',
  email_status text not null default 'pending' check (email_status in ('pending', 'sent', 'failed', 'skipped')),
  ip_hash text
);
create index leads_created_idx on public.leads (created_at desc);
alter table public.leads enable row level security;
-- No anon policies at all. Staff can read and update.
create policy "admins read leads" on public.leads for select to authenticated using (public.is_staff('admin'));
create policy "admins update leads" on public.leads for update to authenticated using (public.is_staff('admin')) with check (public.is_staff('admin'));

-- Rate-limit log (salted IP hashes only)
create table public.submission_log (
  id bigint generated always as identity primary key,
  ip_hash text not null,
  created_at timestamptz not null default now()
);
create index submission_log_idx on public.submission_log (ip_hash, created_at desc);
alter table public.submission_log enable row level security;

-- The only way to create a lead. Validates, rate-limits (3 per IP per 10 minutes, 5 per email per day), inserts.
create or replace function public.submit_lead(
  p_full_name text, p_email text, p_phone text, p_enquiry_type public.enquiry_type,
  p_city_state text, p_message text, p_source_page text, p_utm jsonb, p_ip_hash text
) returns uuid language plpgsql security definer set search_path = '' as $$
declare new_id uuid;
begin
  if p_ip_hash is null or char_length(p_ip_hash) < 16 then raise exception 'invalid request'; end if;
  if (select count(*) from public.submission_log where ip_hash = p_ip_hash and created_at > now() - interval '10 minutes') >= 3 then
    raise exception 'rate_limited' using errcode = 'P0001';
  end if;
  if (select count(*) from public.leads where lower(email) = lower(p_email) and created_at > now() - interval '1 day') >= 5 then
    raise exception 'rate_limited' using errcode = 'P0001';
  end if;
  insert into public.submission_log (ip_hash) values (p_ip_hash);
  insert into public.leads (full_name, email, phone, enquiry_type, city_state, message, source_page, utm, consent_at, ip_hash)
  values (trim(p_full_name), lower(trim(p_email)), trim(p_phone), p_enquiry_type, nullif(trim(p_city_state), ''), trim(p_message),
          left(p_source_page, 200), p_utm, now(), p_ip_hash)
  returning id into new_id;
  return new_id;
end; $$;

-- Lets the server record whether the emails went out, only for a fresh pending lead.
create or replace function public.mark_lead_email(p_id uuid, p_status text) returns void
language sql security definer set search_path = '' as $$
  update public.leads set email_status = p_status
  where id = p_id and email_status = 'pending' and created_at > now() - interval '10 minutes'
    and p_status in ('sent', 'failed', 'skipped');
$$;

-- Daily keep-alive and housekeeping (called by the Cloudflare Cron Trigger).
create or replace function public.keepalive() returns int language sql security definer set search_path = '' as $$
  with d as (delete from public.submission_log where created_at < now() - interval '1 day' returning 1)
  select count(*)::int from d;
$$;

revoke all on function public.submit_lead, public.mark_lead_email, public.keepalive from public;
grant execute on function public.submit_lead, public.mark_lead_email, public.keepalive to anon, authenticated;
revoke all on function public.is_staff from public, anon;
grant execute on function public.is_staff to authenticated;
