-- One-time: give the Monius dev account its own workspace in the Load Desk
-- database, so it can sign in (from the website's Client Login or /login) and
-- see a sandbox of its own rather than a client's tickets.
--
-- Run in Supabase -> SQL Editor AFTER adding moniussystems@outlook.com in
-- Authentication -> Users (with Auto Confirm on, or via an invite that has
-- been accepted). Not a migration: kept outside supabase/migrations so
-- `supabase db push` never runs it.
--
-- To put the dev account alongside a client instead (seeing that client's
-- data), change the workspace id below to theirs, e.g. 'ad-trucking-chicago'.

do $$
declare
  account uuid;
begin
  select id into account
  from auth.users
  where lower(email) = lower('moniussystems@outlook.com');

  if account is null then
    raise exception 'No user with that email yet. Add it in Authentication -> Users first (with Auto Confirm on), then run this again.';
  end if;

  insert into public.workspace_members (workspace_id, user_id)
  values ('monius-dev', account)
  on conflict do nothing;

  raise notice 'Access granted to workspace monius-dev.';
end $$;

-- Check: should return one row.
select m.workspace_id, u.email, m.created_at
from public.workspace_members m
join auth.users u on u.id = m.user_id
where m.workspace_id = 'monius-dev';
