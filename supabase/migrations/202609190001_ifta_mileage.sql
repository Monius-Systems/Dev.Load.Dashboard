-- IFTA & Mileage: estimated road miles and fuel per truck and day, worked out
-- from saved tickets by a truck-routing provider. Written for Supabase project
-- ivpnwmpyoauymvjtjwmd. Adds three tables and touches nothing that exists.
--
-- Every row carries a workspace_id, and the policies are the ones the other
-- load_desk_* tables use: members of the row's workspace only, checked by
-- public.load_desk_is_member (see 202609150001_load_desk.sql). Anonymous
-- access is revoked.

-- Where an address on a ticket (or a truck's yard) is on the map. One row per
-- distinct address text in a workspace; unresolved rows carry the provider's
-- best suggestion and wait for a person to type the address once.
create table public.load_desk_places (
  id bigint generated always as identity primary key,
  workspace_id text not null,
  -- normalizeName(normalizeAddress(query_text)), the key tickets look up by.
  place_key text not null check (place_key <> '' and length(place_key) <= 200),
  query_text text not null check (length(query_text) <= 400),
  status text not null check (status in ('resolved', 'unresolved')),
  lat double precision,
  lon double precision,
  -- Short name for route lines, e.g. the municipality.
  label text,
  formatted text,
  resolved_by text check (resolved_by in ('provider', 'user')),
  -- The address a person typed when they set the location by hand.
  resolved_query text,
  provider text,
  provider_type text,
  confidence double precision,
  reason text,
  suggestion text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, place_key)
);

-- Cached routes between two points for one vehicle profile, with the encoded
-- geometry kept for a later split by state.
create table public.load_desk_routes (
  id bigint generated always as identity primary key,
  workspace_id text not null,
  route_key text not null check (route_key <> '' and length(route_key) <= 200),
  origin_lat double precision not null,
  origin_lon double precision not null,
  dest_lat double precision not null,
  dest_lon double precision not null,
  profile jsonb not null check (jsonb_typeof(profile) = 'object'),
  provider text not null,
  provider_version text not null,
  miles numeric(10, 2) not null check (miles >= 0),
  seconds integer not null check (seconds >= 0),
  geometry text,
  geometry_precision smallint check (geometry_precision in (5, 7)),
  provider_meta jsonb not null default '{}'::jsonb check (jsonb_typeof(provider_meta) = 'object'),
  calculated_at timestamptz not null default now(),
  unique (workspace_id, route_key)
);

-- One row per truck and service date. The state columns say what the last
-- attempt did; the result columns are written only when a calculation
-- succeeds, so a failure never destroys the last good figures.
create table public.load_desk_daily_mileage (
  id bigint generated always as identity primary key,
  workspace_id text not null,
  -- No foreign key: the history outlives a deleted truck.
  truck_id bigint not null,
  truck_number text not null default '',
  service_date date not null,
  -- State of the last attempt.
  status text not null default 'calculating'
    check (status in ('calculating', 'current', 'needs_review', 'failed')),
  review_reasons jsonb not null default '[]'::jsonb check (jsonb_typeof(review_reasons) = 'array'),
  warnings jsonb not null default '[]'::jsonb check (jsonb_typeof(warnings) = 'array'),
  error text,
  calc_started_at timestamptz,
  last_attempt_at timestamptz,
  input_hash text,
  -- Result of the last successful calculation.
  result_input_hash text,
  ticket_ids bigint[] not null default '{}',
  ticket_count integer not null default 0,
  order_basis text,
  legs jsonb not null default '[]'::jsonb check (jsonb_typeof(legs) = 'array'),
  total_miles numeric(10, 2),
  total_seconds integer,
  mpg numeric(6, 2),
  est_gallons numeric(10, 3),
  profile_snapshot jsonb,
  profile_hash text,
  calc_version integer,
  calculated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, truck_id, service_date)
);
create index load_desk_daily_mileage_workspace_date
  on public.load_desk_daily_mileage (workspace_id, service_date desc);

-- Row level security: members of the row's workspace only.
alter table public.load_desk_places enable row level security;
alter table public.load_desk_routes enable row level security;
alter table public.load_desk_daily_mileage enable row level security;

revoke all on public.load_desk_places, public.load_desk_routes, public.load_desk_daily_mileage
  from anon, authenticated;
grant select, insert, update, delete on public.load_desk_places to authenticated;
grant select, insert, update, delete on public.load_desk_routes to authenticated;
grant select, insert, update, delete on public.load_desk_daily_mileage to authenticated;

create policy "Members read places" on public.load_desk_places
  for select to authenticated using (public.load_desk_is_member(workspace_id));
create policy "Members add places" on public.load_desk_places
  for insert to authenticated with check (public.load_desk_is_member(workspace_id));
create policy "Members edit places" on public.load_desk_places
  for update to authenticated
  using (public.load_desk_is_member(workspace_id))
  with check (public.load_desk_is_member(workspace_id));
create policy "Members delete places" on public.load_desk_places
  for delete to authenticated using (public.load_desk_is_member(workspace_id));

create policy "Members read routes" on public.load_desk_routes
  for select to authenticated using (public.load_desk_is_member(workspace_id));
create policy "Members add routes" on public.load_desk_routes
  for insert to authenticated with check (public.load_desk_is_member(workspace_id));
create policy "Members edit routes" on public.load_desk_routes
  for update to authenticated
  using (public.load_desk_is_member(workspace_id))
  with check (public.load_desk_is_member(workspace_id));
create policy "Members delete routes" on public.load_desk_routes
  for delete to authenticated using (public.load_desk_is_member(workspace_id));

create policy "Members read daily mileage" on public.load_desk_daily_mileage
  for select to authenticated using (public.load_desk_is_member(workspace_id));
create policy "Members add daily mileage" on public.load_desk_daily_mileage
  for insert to authenticated with check (public.load_desk_is_member(workspace_id));
create policy "Members edit daily mileage" on public.load_desk_daily_mileage
  for update to authenticated
  using (public.load_desk_is_member(workspace_id))
  with check (public.load_desk_is_member(workspace_id));
create policy "Members delete daily mileage" on public.load_desk_daily_mileage
  for delete to authenticated using (public.load_desk_is_member(workspace_id));
