-- Rate & Fuel Agent: the rates a customer agreed to for a job and a period,
-- the emails that asked for them, the replies that answered, the trail of what
-- was applied and by whom, and the invoices that have been finalized against
-- them. Adds five tables and touches nothing that exists.
--
-- Applied with `supabase db push` on the DEV project only; production is
-- migrated separately, after the feature is signed off.
--
-- Every row carries a workspace_id, and the policies are the ones the other
-- load_desk_* tables use: members of the row's workspace only, checked by
-- public.load_desk_is_member (see 202609150001_load_desk.sql). Anonymous
-- access is revoked. No foreign keys between these tables or to the profiles:
-- the trail of what a customer was charged outlives a deleted profile, a
-- discarded request or a reply that was thrown away.

-- What one figure is, for one job, from one day until another. A rate is never
-- edited in place: a new period supersedes the old one, so an invoice printed
-- last month can always be explained by the row that was current then.
create table public.load_desk_rate_periods (
  id bigint generated always as identity primary key,
  workspace_id text not null,
  customer_profile_id bigint not null,
  -- normalizeName(job or site) — what tickets are matched by.
  job_key text not null check (job_key <> '' and length(job_key) <= 300),
  job_label text not null default '' check (length(job_label) <= 200),
  -- base: the haul rate. fuel: the fuel charge added to it.
  kind text not null check (kind in ('base', 'fuel')),
  effective_from date not null,
  -- Null means open ended: in force until a later period supersedes it.
  effective_to date check (effective_to is null or effective_to >= effective_from),
  -- PERIOD: the dates above are the whole of it. PROJECT_DURATION: the
  -- customer quoted the rate for the job, however long the job runs.
  validity text not null check (validity in ('PERIOD', 'PROJECT_DURATION')),
  -- How the figure is charged; see BASE_RATE_TYPES/FUEL_RATE_TYPES in
  -- lib/load-desk/rates.ts. A customer can agree to more shapes than a ticket
  -- can hold, so these are the customer's words, not the ticket's fields.
  rate_type text check (rate_type in
    ('PER_TON', 'PER_LOAD', 'PER_HOUR', 'PER_MILE', 'PER_DAY', 'FLAT_RATE', 'CUSTOM')),
  fuel_type text check (fuel_type in
    ('PERCENTAGE', 'PER_TON', 'PER_LOAD', 'PER_MILE', 'FIXED_AMOUNT', 'INCLUDED', 'NONE', 'CUSTOM')),
  -- Dollars, or a percentage for a PERCENTAGE fuel surcharge. Null means the
  -- customer named the job but not a figure, and nothing can be priced from it.
  value numeric(12, 4),
  -- Where the figure came from, so a number on an invoice can be traced back
  -- (RATE_SOURCES in lib/load-desk/rates.ts).
  source text not null check (source in
    ('customer_email', 'simulated_response', 'manual', 'site_rate')),
  source_request_id bigint,
  source_response_id bigint,
  confidence double precision check (confidence is null or (confidence >= 0 and confidence <= 1)),
  -- auto: applied on the reply's own confidence. human: somebody confirmed it.
  applied_by text not null check (applied_by in ('auto', 'human')),
  confirmed_by text check (length(confirmed_by) <= 200),
  confirmed_at timestamptz,
  -- The period that replaced this one; null while this one still stands.
  superseded_by bigint,
  note text check (length(note) <= 2000),
  created_at timestamptz not null default now()
);
create index load_desk_rate_periods_lookup
  on public.load_desk_rate_periods
  (workspace_id, customer_profile_id, job_key, kind, effective_from desc);

-- An email asking a customer what the jobs on their next period are charged
-- at: what was asked, when it went, and how many times it has been chased.
create table public.load_desk_rate_requests (
  id bigint generated always as identity primary key,
  workspace_id text not null,
  customer_profile_id bigint not null,
  period_from date not null,
  period_to date not null check (period_to >= period_from),
  -- RATE_REQUEST_STATUSES in lib/load-desk/rates.ts.
  status text not null check (status in
    ('DRAFT', 'READY_TO_SEND', 'SENT', 'WAITING_FOR_REPLY', 'RESPONSE_RECEIVED',
     'AI_PROCESSING', 'NEEDS_CONFIRMATION', 'RESOLVED', 'FOLLOW_UP_DUE', 'CLOSED', 'FAILED')),
  -- How far the request may go on its own: written and left as a draft, sent
  -- once somebody approves it, or sent by the agent.
  mode text not null check (mode in ('DRAFT_ONLY', 'APPROVAL_REQUIRED', 'AUTO_SEND')),
  recipient text check (length(recipient) <= 320),
  cc text[] not null default '{}',
  subject text not null default '' check (length(subject) <= 400),
  body text not null default '' check (length(body) <= 100000),
  -- The jobs asked about (RequestItem[]).
  items jsonb not null default '[]'::jsonb check (jsonb_typeof(items) = 'array'),
  -- The job-and-field pairs a reply has already settled.
  answered jsonb not null default '[]'::jsonb check (jsonb_typeof(answered) = 'array'),
  sent_at timestamptz,
  reply_at timestamptz,
  follow_up_due_at timestamptz,
  follow_up_count integer not null default 0 check (follow_up_count >= 0),
  -- The mail thread this belongs to, so a reply can be tied back to it.
  thread_ref text check (length(thread_ref) <= 400),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index load_desk_rate_requests_status
  on public.load_desk_rate_requests (workspace_id, status);
create index load_desk_rate_requests_customer
  on public.load_desk_rate_requests (workspace_id, customer_profile_id, period_from);

-- A reply, as it arrived, with what was read out of it. The message hash is
-- unique per workspace: the same reply delivered twice is stored once, and
-- cannot apply its rates a second time.
create table public.load_desk_rate_responses (
  id bigint generated always as identity primary key,
  workspace_id text not null,
  -- Null for a reply that arrived without a request to tie it to.
  request_id bigint,
  customer_profile_id bigint not null,
  source text not null check (source in ('simulated', 'email')),
  -- The normalized message (NormalizedMessage): from, subject, body, dates.
  message jsonb not null check (jsonb_typeof(message) = 'object'),
  message_hash text not null check (message_hash <> '' and length(message_hash) <= 200),
  -- What was read out of it (ParsedRateLine[]) and what each line was matched
  -- to (RateMatch[]).
  lines jsonb not null default '[]'::jsonb check (jsonb_typeof(lines) = 'array'),
  matches jsonb not null default '[]'::jsonb check (jsonb_typeof(matches) = 'array'),
  status text not null check (status in
    ('received', 'processing', 'needs_confirmation', 'applied', 'rejected', 'duplicate')),
  ai_model text check (length(ai_model) <= 120),
  processed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (workspace_id, message_hash)
);
create index load_desk_rate_responses_request
  on public.load_desk_rate_responses (workspace_id, request_id);

-- Everything the agent did, in order: a request sent, a reply parsed, a rate
-- applied or confirmed, an invoice finalized or unlocked. Append only.
create table public.load_desk_rate_events (
  id bigint generated always as identity primary key,
  workspace_id text not null,
  -- One of the RateEvent kinds in lib/load-desk/rates.ts. Not constrained to
  -- that list: the trail is history, and a kind added later must not need a
  -- migration before the app can record what it did.
  kind text not null check (kind <> '' and length(kind) <= 60),
  customer_profile_id bigint,
  request_id bigint,
  response_id bigint,
  period_id bigint,
  invoice_key text check (length(invoice_key) <= 200),
  detail text not null default '' check (length(detail) <= 2000),
  -- Who it was, when a person did it; null for the agent's own work.
  actor text check (length(actor) <= 200),
  at timestamptz not null default now()
);
create index load_desk_rate_events_recent
  on public.load_desk_rate_events (workspace_id, at desc);

-- An invoice that has been finalized against the rates of the day, with those
-- figures kept in the snapshot. A later rate change cannot move a finalized
-- invoice; it has to be unlocked first, and the reason is on the row.
create table public.load_desk_invoice_locks (
  workspace_id text not null,
  invoice_key text not null
    check (invoice_key = lower(btrim(invoice_key)) and invoice_key <> ''),
  finalized_at timestamptz not null default now(),
  finalized_by text check (length(finalized_by) <= 200),
  snapshot jsonb not null check (jsonb_typeof(snapshot) = 'object'),
  unlocked_at timestamptz,
  unlock_reason text check (length(unlock_reason) <= 2000),
  primary key (workspace_id, invoice_key)
);

-- Row level security: members of the row's workspace only.
alter table public.load_desk_rate_periods enable row level security;
alter table public.load_desk_rate_requests enable row level security;
alter table public.load_desk_rate_responses enable row level security;
alter table public.load_desk_rate_events enable row level security;
alter table public.load_desk_invoice_locks enable row level security;

revoke all on public.load_desk_rate_periods, public.load_desk_rate_requests,
  public.load_desk_rate_responses, public.load_desk_rate_events,
  public.load_desk_invoice_locks
  from anon, authenticated;
grant select, insert, update, delete on public.load_desk_rate_periods to authenticated;
grant select, insert, update, delete on public.load_desk_rate_requests to authenticated;
grant select, insert, update, delete on public.load_desk_rate_responses to authenticated;
grant select, insert, update, delete on public.load_desk_rate_events to authenticated;
grant select, insert, update, delete on public.load_desk_invoice_locks to authenticated;

create policy "Members read rate periods" on public.load_desk_rate_periods
  for select to authenticated using (public.load_desk_is_member(workspace_id));
create policy "Members add rate periods" on public.load_desk_rate_periods
  for insert to authenticated with check (public.load_desk_is_member(workspace_id));
create policy "Members edit rate periods" on public.load_desk_rate_periods
  for update to authenticated
  using (public.load_desk_is_member(workspace_id))
  with check (public.load_desk_is_member(workspace_id));
create policy "Members delete rate periods" on public.load_desk_rate_periods
  for delete to authenticated using (public.load_desk_is_member(workspace_id));

create policy "Members read rate requests" on public.load_desk_rate_requests
  for select to authenticated using (public.load_desk_is_member(workspace_id));
create policy "Members add rate requests" on public.load_desk_rate_requests
  for insert to authenticated with check (public.load_desk_is_member(workspace_id));
create policy "Members edit rate requests" on public.load_desk_rate_requests
  for update to authenticated
  using (public.load_desk_is_member(workspace_id))
  with check (public.load_desk_is_member(workspace_id));
create policy "Members delete rate requests" on public.load_desk_rate_requests
  for delete to authenticated using (public.load_desk_is_member(workspace_id));

create policy "Members read rate responses" on public.load_desk_rate_responses
  for select to authenticated using (public.load_desk_is_member(workspace_id));
create policy "Members add rate responses" on public.load_desk_rate_responses
  for insert to authenticated with check (public.load_desk_is_member(workspace_id));
create policy "Members edit rate responses" on public.load_desk_rate_responses
  for update to authenticated
  using (public.load_desk_is_member(workspace_id))
  with check (public.load_desk_is_member(workspace_id));
create policy "Members delete rate responses" on public.load_desk_rate_responses
  for delete to authenticated using (public.load_desk_is_member(workspace_id));

create policy "Members read rate events" on public.load_desk_rate_events
  for select to authenticated using (public.load_desk_is_member(workspace_id));
create policy "Members add rate events" on public.load_desk_rate_events
  for insert to authenticated with check (public.load_desk_is_member(workspace_id));
create policy "Members edit rate events" on public.load_desk_rate_events
  for update to authenticated
  using (public.load_desk_is_member(workspace_id))
  with check (public.load_desk_is_member(workspace_id));
create policy "Members delete rate events" on public.load_desk_rate_events
  for delete to authenticated using (public.load_desk_is_member(workspace_id));

create policy "Members read invoice locks" on public.load_desk_invoice_locks
  for select to authenticated using (public.load_desk_is_member(workspace_id));
create policy "Members add invoice locks" on public.load_desk_invoice_locks
  for insert to authenticated with check (public.load_desk_is_member(workspace_id));
create policy "Members edit invoice locks" on public.load_desk_invoice_locks
  for update to authenticated
  using (public.load_desk_is_member(workspace_id))
  with check (public.load_desk_is_member(workspace_id));
create policy "Members delete invoice locks" on public.load_desk_invoice_locks
  for delete to authenticated using (public.load_desk_is_member(workspace_id));
