-- One-off: copy everything one workspace holds into another, so a sandbox
-- can be worked on with a real company's tickets, customers, trucks and
-- invoices without touching the real rows. Run in Supabase -> SQL Editor.
-- Not a migration: kept outside supabase/migrations so `supabase db push`
-- never runs it.
--
-- What it copies, in order, from `source` into `target`:
--   1. load_desk_profiles  (customers, trucks, clients, and the company when
--      the target has none) — each gets a new id, and the mapping is kept
--   2. load_desk_invoices  (the invoice numbers, claimed for the same uploads)
--   3. load_desk_records   (every ticket, with its truck and customer ids
--      pointed at the copies made in step 1)
--   4. load_desk_places, load_desk_routes, load_desk_daily_mileage
--      (the mileage caches and days, trucks remapped)
-- load_desk_misreads is shared by every workspace and needs no copying.
--
-- What it does NOT copy: the scanned originals in the load-desk-originals
-- bucket. Those live under <workspace>/<sha256>, and a SQL script cannot
-- copy storage bytes. Either copy the folder first with the CLI —
--   supabase storage cp -r ss:///load-desk-originals/<source>/ ss:///load-desk-originals/<target>/
-- and set `originals_copied` below to true, or leave it false and the
-- copied tickets are marked as having no stored scan (Load Desk then says
-- the scan is missing instead of failing to open it).
--
-- Refuses to run twice into a target that already has tickets.

do $$
declare
  -- The workspace id as it is in workspace_members, exactly — this one was
  -- created under the company's name rather than the dashed form the launch
  -- notes describe.
  source constant text := 'A&D Trucking Of Chicago';
  target text;
  originals_copied constant boolean := false;
  copied integer;
begin
  -- The dev account's own workspace.
  select m.workspace_id into target
  from public.workspace_members m
  join auth.users u on u.id = m.user_id
  where lower(u.email) = lower('moniussystems@outlook.com')
  order by m.created_at
  limit 1;

  if target is null then
    raise exception 'moniussystems@outlook.com has no workspace membership yet.';
  end if;
  if target = source then
    raise exception 'The dev account is in the source workspace (%); nothing to copy.', source;
  end if;
  if exists (select 1 from public.load_desk_records where workspace_id = target) then
    raise exception 'Workspace % already has tickets; refusing to copy on top of them.', target;
  end if;

  -- 1. Profiles, one at a time so each new id is remembered against its old one.
  create temp table profile_map (old_id bigint primary key, new_id bigint not null) on commit drop;
  declare
    row_in record;
    new_id bigint;
  begin
    for row_in in
      select p.id, p.kind, p.profile
      from public.load_desk_profiles p
      where p.workspace_id = source
        and (p.kind <> 'company'
             or not exists (select 1 from public.load_desk_profiles c
                            where c.workspace_id = target and c.kind = 'company'))
      order by p.id
    loop
      insert into public.load_desk_profiles (workspace_id, kind, profile, updated_at)
      values (target, row_in.kind,
              case when row_in.kind = 'company' then row_in.profile - 'logo_version' else row_in.profile end,
              now())
      returning id into new_id;
      insert into profile_map (old_id, new_id) values (row_in.id, new_id);
    end loop;
  end;

  -- The company's default client, if any, now points at the copied client.
  update public.load_desk_profiles c
  set profile = jsonb_set(c.profile, '{default_client_id}', to_jsonb(m.new_id))
  from profile_map m
  where c.workspace_id = target and c.kind = 'company'
    and (c.profile->>'default_client_id')::bigint = m.old_id;

  -- 2. Invoice numbers.
  insert into public.load_desk_invoices (workspace_id, invoice_key, batch_id, created_at)
  select target, invoice_key, batch_id, created_at
  from public.load_desk_invoices
  where workspace_id = source
  on conflict do nothing;

  -- 3. Tickets, with their truck and customer pointed at the copies.
  insert into public.load_desk_records
    (workspace_id, invoice_key, batch_id, source_sha256, source_page, ticket_date, record, created_at)
  select target, r.invoice_key, r.batch_id, r.source_sha256, r.source_page, r.ticket_date,
         jsonb_set(
           jsonb_set(
             jsonb_set(r.record, '{original_stored}', to_jsonb(originals_copied and coalesce((r.record->>'original_stored')::boolean, false))),
             '{truck_id}', coalesce(to_jsonb(t.new_id), 'null'::jsonb)),
           '{customer_profile_id}', coalesce(to_jsonb(c.new_id), 'null'::jsonb)),
         r.created_at
  from public.load_desk_records r
  left join profile_map t on t.old_id = (r.record->>'truck_id')::bigint
  left join profile_map c on c.old_id = (r.record->>'customer_profile_id')::bigint
  where r.workspace_id = source;
  get diagnostics copied = row_count;

  -- 4. Mileage: places and routes as they are, days with the truck remapped.
  insert into public.load_desk_places
    (workspace_id, place_key, query_text, status, lat, lon, label, formatted, resolved_by,
     resolved_query, provider, provider_type, confidence, reason, suggestion)
  select target, place_key, query_text, status, lat, lon, label, formatted, resolved_by,
         resolved_query, provider, provider_type, confidence, reason, suggestion
  from public.load_desk_places where workspace_id = source
  on conflict do nothing;

  insert into public.load_desk_routes
    (workspace_id, route_key, origin_lat, origin_lon, dest_lat, dest_lon, profile, provider,
     provider_version, miles, seconds, geometry, geometry_precision, provider_meta, calculated_at)
  select target, route_key, origin_lat, origin_lon, dest_lat, dest_lon, profile, provider,
         provider_version, miles, seconds, geometry, geometry_precision, provider_meta, calculated_at
  from public.load_desk_routes where workspace_id = source
  on conflict do nothing;

  -- Days are left to Mileage to work out again for the copies: their legs
  -- carry route ids and ticket ids that belong to the source workspace, and
  -- the cached places and routes above make that recalculation free.

  raise notice 'Copied % tickets from % into %.', copied, source, target;
end $$;

-- Check: the target should now list the same counts as the source.
select workspace_id, count(*) as tickets
from public.load_desk_records
group by workspace_id
order by workspace_id;
