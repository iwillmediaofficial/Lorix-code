-- Only our server may call the write functions: each call must carry SERVER_DB_TOKEN,
-- whose SHA-256 hash is stored in a private schema the API cannot see.
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
create table private.settings (key text primary key, value text not null);

-- Set the hash once per environment (value = sha256 hex of SERVER_DB_TOKEN):
-- insert into private.settings values ('server_token_sha256', '<hash>')
--   on conflict (key) do update set value = excluded.value;

create or replace function private.check_token(p_token text) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if p_token is null or encode(extensions.digest(p_token, 'sha256'), 'hex') is distinct from
     (select value from private.settings where key = 'server_token_sha256') then
    raise exception 'forbidden' using errcode = '42501';
  end if;
end; $$;

drop function public.submit_lead(text, text, text, public.enquiry_type, text, text, text, jsonb, text);
create function public.submit_lead(
  p_token text, p_full_name text, p_email text, p_phone text, p_enquiry_type public.enquiry_type,
  p_city_state text, p_message text, p_source_page text, p_utm jsonb, p_ip_hash text
) returns uuid language plpgsql security definer set search_path = '' as $$
declare new_id uuid;
begin
  perform private.check_token(p_token);
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

drop function public.mark_lead_email(uuid, text);
create function public.mark_lead_email(p_token text, p_id uuid, p_status text) returns void
language plpgsql security definer set search_path = '' as $$
begin
  perform private.check_token(p_token);
  update public.leads set email_status = p_status
  where id = p_id and email_status = 'pending' and p_status in ('sent', 'failed', 'skipped');
end; $$;

drop function public.keepalive();
create function public.keepalive(p_token text) returns int
language plpgsql security definer set search_path = '' as $$
declare n int;
begin
  perform private.check_token(p_token);
  with d as (delete from public.submission_log where created_at < now() - interval '1 day' returning 1)
  select count(*)::int into n from d;
  return n;
end; $$;

revoke all on function public.submit_lead, public.mark_lead_email, public.keepalive from public;
grant execute on function public.submit_lead, public.mark_lead_email, public.keepalive to anon;
revoke all on function private.check_token from public, anon, authenticated;
