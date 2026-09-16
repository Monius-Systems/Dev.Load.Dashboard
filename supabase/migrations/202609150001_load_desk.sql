-- Load Desk: tickets, invoices, customer and truck profiles, and ticket scans
-- for client workspaces. Written for Supabase project ivpnwmpyoauymvjtjwmd.
--
-- Every row carries a workspace_id. Signed-in users can read and change rows
-- only for workspaces they are a member of; anonymous access is revoked.
-- Membership is managed by administrators, never by the app.
--
-- WARNING: replaces any existing load_desk_* tables, deleting their rows.

-- Who may open which workspace. Administrators add and remove rows in the SQL
-- editor; signed-in users can only see their own memberships.
create table if not exists public.workspace_members (
  workspace_id text not null check (workspace_id <> ''),
  user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (workspace_id, user_id)
);
alter table public.workspace_members enable row level security;
revoke all on public.workspace_members from anon, authenticated;
grant select on public.workspace_members to authenticated;
drop policy if exists "Users read their own memberships" on public.workspace_members;
create policy "Users read their own memberships" on public.workspace_members
  for select to authenticated using (user_id = (select auth.uid()));

-- Leftover Load Desk tables from earlier tests are replaced.
drop table if exists public.load_desk_records cascade;
drop table if exists public.load_desk_invoices cascade;
drop table if exists public.load_desk_profiles cascade;

-- Membership check used by every policy. SECURITY DEFINER so policies can
-- consult workspace_members without granting broader access to it.
create or replace function public.load_desk_is_member(target_workspace text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.workspace_members m
    where m.workspace_id = target_workspace
      and m.user_id = (select auth.uid())
  );
$$;
revoke all on function public.load_desk_is_member(text) from public, anon;
grant execute on function public.load_desk_is_member(text) to authenticated;

-- Invoice numbers belong to one upload (batch). Saving a ticket claims its
-- invoice number for its batch; a different batch cannot reuse the number.
create table public.load_desk_invoices (
  workspace_id text not null,
  invoice_key text not null check (invoice_key = lower(btrim(invoice_key)) and invoice_key <> ''),
  batch_id text not null check (batch_id <> ''),
  created_at timestamptz not null default now(),
  primary key (workspace_id, invoice_key)
);

-- One row per saved ticket. The full record (ticket fields, invoice details,
-- source file metadata) lives in `record`; the columns beside it are the
-- values the app filters, deduplicates and orders by.
create table public.load_desk_records (
  id bigint generated always as identity primary key,
  workspace_id text not null,
  invoice_key text not null,
  batch_id text not null,
  source_sha256 text not null check (source_sha256 ~ '^[0-9a-f]{64}$'),
  source_page integer not null default 1 check (source_page >= 1),
  ticket_date date,
  record jsonb not null check (jsonb_typeof(record) = 'object'),
  created_by uuid default auth.uid() references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz,
  updated_by uuid references auth.users (id) on delete set null,
  unique (workspace_id, source_sha256, source_page),
  foreign key (workspace_id, invoice_key)
    references public.load_desk_invoices (workspace_id, invoice_key)
);
create index load_desk_records_workspace_date
  on public.load_desk_records (workspace_id, ticket_date desc, id desc);
create index load_desk_records_invoice
  on public.load_desk_records (workspace_id, invoice_key);

-- Customer and truck profiles.
create table public.load_desk_profiles (
  id bigint generated always as identity primary key,
  workspace_id text not null,
  -- company: the workspace's own details printed on invoices (one row).
  -- client: a company invoices are billed to.
  kind text not null check (kind in ('customer', 'truck', 'company', 'client')),
  profile jsonb not null check (jsonb_typeof(profile) = 'object'),
  updated_at timestamptz not null default now(),
  updated_by uuid default auth.uid() references auth.users (id) on delete set null
);
create index load_desk_profiles_workspace
  on public.load_desk_profiles (workspace_id, kind);
create unique index load_desk_profiles_one_company
  on public.load_desk_profiles (workspace_id)
  where kind = 'company';

-- An invoice number is released once no saved ticket uses it.
create or replace function public.load_desk_release_invoice()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  delete from public.load_desk_invoices i
  where i.workspace_id = old.workspace_id
    and i.invoice_key = old.invoice_key
    and not exists (
      select 1 from public.load_desk_records r
      where r.workspace_id = old.workspace_id
        and r.invoice_key = old.invoice_key
    );
  return old;
end;
$$;
revoke all on function public.load_desk_release_invoice() from public, anon, authenticated;
create trigger load_desk_records_release_invoice
  after delete or update of invoice_key on public.load_desk_records
  for each row execute function public.load_desk_release_invoice();

-- A ticket's invoice number must be claimed by the ticket's own upload, however
-- the row is written, so one upload can never take another upload's invoice.
create or replace function public.load_desk_check_invoice_claim()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not exists (
    select 1
    from public.load_desk_invoices i
    where i.workspace_id = new.workspace_id
      and i.invoice_key = new.invoice_key
      and i.batch_id = new.batch_id
  ) then
    raise exception 'invoice_taken'
      using detail = 'This invoice number is not claimed by the ticket''s upload.';
  end if;
  return new;
end;
$$;
revoke all on function public.load_desk_check_invoice_claim() from public, anon, authenticated;
create trigger load_desk_records_check_invoice
  before insert or update of invoice_key on public.load_desk_records
  for each row execute function public.load_desk_check_invoice_claim();

-- Edits to saved tickets, applied in one transaction: every ticket on an
-- invoice changes together or none do. Runs as the signed-in user, so row
-- level security still applies. A new invoice number is claimed for the
-- ticket's upload; the triggers above refuse another upload's number and
-- release numbers no ticket uses any more. The source file, page and upload
-- of a ticket are never changed here (and members cannot update them).
create or replace function public.load_desk_update_records(target_workspace text, changes jsonb)
returns integer
language plpgsql
security invoker
set search_path = ''
as $$
declare
  change jsonb;
  current_row record;
  next_key text;
  updated integer := 0;
begin
  if not public.load_desk_is_member(target_workspace) then
    raise exception 'not_member' using errcode = '42501';
  end if;
  if jsonb_typeof(changes) is distinct from 'array' then
    raise exception 'invalid_changes' using errcode = '22023';
  end if;
  for change in select value from jsonb_array_elements(changes) loop
    select r.batch_id, r.invoice_key
      into current_row
      from public.load_desk_records r
      where r.workspace_id = target_workspace
        and r.id = (change->>'id')::bigint
      for update;
    if not found then
      raise exception 'record_missing' using errcode = 'P0002';
    end if;
    next_key := lower(btrim(change->'record'->'invoice'->>'invoice_number'));
    if next_key is null or next_key = '' then
      raise exception 'invalid_changes' using errcode = '22023';
    end if;
    if next_key <> current_row.invoice_key then
      insert into public.load_desk_invoices (workspace_id, invoice_key, batch_id)
      values (target_workspace, next_key, current_row.batch_id)
      on conflict (workspace_id, invoice_key) do nothing;
    end if;
    update public.load_desk_records r
      set invoice_key = next_key,
          ticket_date = (change->>'ticket_date')::date,
          record = change->'record',
          updated_at = now(),
          updated_by = (select auth.uid())
      where r.workspace_id = target_workspace
        and r.id = (change->>'id')::bigint;
    updated := updated + 1;
  end loop;
  return updated;
end;
$$;
revoke all on function public.load_desk_update_records(text, jsonb) from public, anon;
grant execute on function public.load_desk_update_records(text, jsonb) to authenticated;

-- Row level security: members of the row's workspace only.
alter table public.load_desk_invoices enable row level security;
alter table public.load_desk_records enable row level security;
alter table public.load_desk_profiles enable row level security;

revoke all on public.load_desk_invoices, public.load_desk_records, public.load_desk_profiles from anon, authenticated;
grant select, insert, delete on public.load_desk_invoices to authenticated;
grant select, insert, delete on public.load_desk_records to authenticated;
-- Edits change only the ticket, its invoice and its date, never its source or upload.
grant update (invoice_key, ticket_date, record, updated_at, updated_by)
  on public.load_desk_records to authenticated;
grant select, insert, update, delete on public.load_desk_profiles to authenticated;

create policy "Members read invoices" on public.load_desk_invoices
  for select to authenticated using (public.load_desk_is_member(workspace_id));
create policy "Members claim invoices" on public.load_desk_invoices
  for insert to authenticated with check (public.load_desk_is_member(workspace_id));

create policy "Members read tickets" on public.load_desk_records
  for select to authenticated using (public.load_desk_is_member(workspace_id));
create policy "Members save tickets" on public.load_desk_records
  for insert to authenticated with check (
    public.load_desk_is_member(workspace_id) and created_by = (select auth.uid())
  );
create policy "Members delete tickets" on public.load_desk_records
  for delete to authenticated using (public.load_desk_is_member(workspace_id));
create policy "Members edit tickets" on public.load_desk_records
  for update to authenticated
  using (public.load_desk_is_member(workspace_id))
  with check (public.load_desk_is_member(workspace_id));

create policy "Members read profiles" on public.load_desk_profiles
  for select to authenticated using (public.load_desk_is_member(workspace_id));
create policy "Members add profiles" on public.load_desk_profiles
  for insert to authenticated with check (public.load_desk_is_member(workspace_id));
create policy "Members edit profiles" on public.load_desk_profiles
  for update to authenticated
  using (public.load_desk_is_member(workspace_id))
  with check (public.load_desk_is_member(workspace_id));
create policy "Members delete profiles" on public.load_desk_profiles
  for delete to authenticated using (public.load_desk_is_member(workspace_id));

-- Private bucket for original scans, stored as <workspace_id>/<sha256>.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'load-desk-originals',
  'load-desk-originals',
  false,
  20971520,
  array['application/pdf', 'image/png', 'image/jpeg', 'image/tiff', 'image/webp', 'text/plain', 'application/octet-stream']
)
on conflict (id) do nothing;

drop policy if exists "Members read ticket scans" on storage.objects;
drop policy if exists "Members upload ticket scans" on storage.objects;
drop policy if exists "Members delete ticket scans" on storage.objects;
create policy "Members read ticket scans" on storage.objects
  for select to authenticated
  using (bucket_id = 'load-desk-originals' and public.load_desk_is_member((storage.foldername(name))[1]));
create policy "Members upload ticket scans" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'load-desk-originals' and public.load_desk_is_member((storage.foldername(name))[1]));
create policy "Members delete ticket scans" on storage.objects
  for delete to authenticated
  using (bucket_id = 'load-desk-originals' and public.load_desk_is_member((storage.foldername(name))[1]));
