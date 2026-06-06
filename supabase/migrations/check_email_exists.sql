create or replace function public.email_exists(p_email text)
returns boolean
language sql
security definer
set search_path = public, auth
as $$
  select exists (
    select 1
    from auth.users as u
    where lower(u.email) = lower(trim(p_email))
  );
$$;

revoke all on function public.email_exists(text) from public;
grant execute on function public.email_exists(text) to anon, authenticated;