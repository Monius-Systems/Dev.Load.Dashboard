-- One-time: make moniussystems@outlook.com the Monius dev account, with a
-- sandbox workspace of its own instead of a client's tickets.
--
-- The account already exists and was first given the live workspace
-- (ad-trucking-chicago). The app opens whichever workspace an account joined
-- FIRST and has no switcher (lib/server/auth.ts, workspaceUser), so simply
-- adding a second membership would change nothing. This moves the account:
-- out of the live workspace, into monius-dev. Nothing in the live workspace
-- is deleted; the account just stops seeing it.
--
-- To keep live access under this email as well, use a different email for
-- the dev account instead of running this.
--
-- Run in Supabase -> SQL Editor. Not a migration: kept outside
-- supabase/migrations so `supabase db push` never runs it.

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

  delete from public.workspace_members
  where user_id = account
    and workspace_id <> 'monius-dev';

  insert into public.workspace_members (workspace_id, user_id)
  values ('monius-dev', account)
  on conflict do nothing;

  raise notice 'moniussystems@outlook.com now opens workspace monius-dev only.';
end $$;

-- Check: exactly one row, workspace monius-dev.
select m.workspace_id, u.email, m.created_at
from public.workspace_members m
join auth.users u on u.id = m.user_id
where lower(u.email) = lower('moniussystems@outlook.com');
