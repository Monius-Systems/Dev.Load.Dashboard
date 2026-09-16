-- One-time: give the first account access to A & D Trucking's Load Desk.
-- Run in Supabase -> SQL Editor AFTER applying migrations/202609150001_load_desk.sql
-- and AFTER adding the user in Authentication -> Users. Not a migration: it is
-- kept outside supabase/migrations so `supabase db push` never runs it.

do $$
declare
  account uuid;
begin
  select id into account
  from auth.users
  where lower(email) = lower('matthewmoniuszko@icloud.com');

  if account is null then
    raise exception 'No user with that email yet. Add it in Authentication -> Users first (with Auto Confirm on), then run this again.';
  end if;

  insert into public.workspace_members (workspace_id, user_id)
  values ('ad-trucking-chicago', account)
  on conflict do nothing;

  raise notice 'Access granted to workspace ad-trucking-chicago.';
end $$;

-- Check: should return one row.
select m.workspace_id, u.email, m.created_at
from public.workspace_members m
join auth.users u on u.id = m.user_id
where m.workspace_id = 'ad-trucking-chicago';
