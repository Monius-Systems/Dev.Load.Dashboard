-- Monius Operator: what the agent was asked, what it did about it, what it
-- asked permission for, and how far the workspace lets it go on its own. Four
-- tables — runs, actions, pending confirmations and per-workspace settings —
-- and nothing that exists is touched.
--
-- Applied with `supabase db push` on the DEV project only; production is
-- migrated separately, after the feature is signed off.
--
-- No chain-of-thought is ever stored. A run keeps the tool names it called,
-- the one-line summary each call reported, the entities it touched and the
-- outcome; what the model made of any of it is never written down, never read
-- back and never shown. What a person audits here is what the app did.
--
-- Every row carries a workspace_id, and the policies are the ones the other
-- load_desk_* tables use: members of the row's workspace only, checked by
-- public.load_desk_is_member (see 202609150001_load_desk.sql). Anonymous
-- access is revoked, and nothing here runs with rights of its own: the
-- Operator acts as the signed-in member and can reach nothing that member
-- cannot reach for themselves.
-- No foreign keys: the trail of what the agent did outlives a deleted profile
-- or a run whose rows have been aged out.

-- One turn: a person's request, the tool calls it led to, and how it ended.
-- `activity` is the panel's own list — an ISO time, a tool name, a kind and a
-- sentence — and `entities` the things the run talked about, so a finished run
-- can be reopened without asking a model anything a second time.
create table public.load_desk_agent_runs (
  id uuid primary key,
  workspace_id text not null,
  user_id uuid not null,
  request text not null default '' check (length(request) <= 4000),
  -- The page the person was on when they asked, when the panel sent one.
  context jsonb check (context is null or jsonb_typeof(context) = 'object'),
  status text not null check (status in
    ('running', 'completed', 'awaiting_confirmation', 'failed', 'limited')),
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  -- ActivityItem[]: tool names and one-line summaries. Nothing the model thought.
  activity jsonb not null default '[]'::jsonb check (jsonb_typeof(activity) = 'array'),
  entities jsonb not null default '[]'::jsonb check (jsonb_typeof(entities) = 'array'),
  summary text not null default '' check (length(summary) <= 2000),
  -- Why it stopped, in the words a person was shown. Null when it did not.
  error text check (error is null or length(error) <= 1000),
  tool_calls integer not null default 0 check (tool_calls >= 0),
  writes integer not null default 0 check (writes >= 0),
  created_at timestamptz not null default now()
);
create index load_desk_agent_runs_recent
  on public.load_desk_agent_runs (workspace_id, started_at desc);

-- The audit log. No invisible AI writes: every write the Operator performs
-- leaves a row here, whether it worked or not. `before` and `after` are the
-- changed fields as the tool reported them, truncated by the store — a whole
-- record is never stored, and the row is evidence of a change, not a copy of
-- the thing changed. `verification` is what the tool re-read afterwards, so a
-- write that claimed success and did not happen is visible as such.
create table public.load_desk_agent_actions (
  id bigint generated always as identity primary key,
  workspace_id text not null,
  run_id uuid not null,
  user_id uuid not null,
  tool text not null check (tool <> '' and length(tool) <= 80),
  risk smallint not null check (risk >= 0 and risk <= 3),
  -- auto: policy allowed it outright. confirmed: a person pressed the button.
  confirmation text not null check (confirmation in ('auto', 'confirmed')),
  entity_type text check (entity_type is null or length(entity_type) <= 40),
  entity_id text check (entity_id is null or length(entity_id) <= 200),
  before jsonb,
  after jsonb,
  reason text not null default '' check (length(reason) <= 1000),
  outcome text not null check (outcome in ('done', 'partial', 'failed', 'refused')),
  verification jsonb not null default '{}'::jsonb check (jsonb_typeof(verification) = 'object'),
  at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create index load_desk_agent_actions_recent
  on public.load_desk_agent_actions (workspace_id, at desc);
create index load_desk_agent_actions_run
  on public.load_desk_agent_actions (workspace_id, run_id);

-- A write the policy would not do unattended. The row is the whole of the
-- proposal — the parsed arguments the tool will run and the dry run's figures
-- — so that confirming is a matter of taking this row, not of trusting
-- anything that comes back from the browser. Single use: `consumed_at` is set
-- when it is taken, and a taken or expired row is never taken again.
create table public.load_desk_agent_pending (
  id uuid primary key,
  workspace_id text not null,
  run_id uuid not null,
  user_id uuid not null,
  tool text not null check (tool <> '' and length(tool) <= 80),
  input jsonb not null default '{}'::jsonb check (jsonb_typeof(input) = 'object'),
  impact jsonb not null default '{}'::jsonb check (jsonb_typeof(impact) = 'object'),
  risk smallint not null check (risk >= 0 and risk <= 3),
  reason text not null default '' check (length(reason) <= 1000),
  expires_at timestamptz not null,
  consumed_at timestamptz,
  created_at timestamptz not null default now()
);
create index load_desk_agent_pending_live
  on public.load_desk_agent_pending (workspace_id, expires_at);

-- How far the Operator may go in this workspace, and which writes a person has
-- granted it. These are facts about the workspace, set on the Operator's
-- settings screen. Nothing in a run — no request, no tool result, no model
-- output — can change a row here.
create table public.load_desk_operator_settings (
  workspace_id text primary key,
  autonomy text not null default 'assist'
    check (autonomy in ('assist', 'controlled', 'autonomous')),
  -- WritePermission[] from lib/operator/types.ts. Empty is the default: the
  -- Operator reads and recommends until somebody says otherwise.
  granted jsonb not null default '[]'::jsonb check (jsonb_typeof(granted) = 'array'),
  updated_at timestamptz not null default now(),
  updated_by uuid,
  created_at timestamptz not null default now()
);

-- Row level security: members of the row's workspace only.
alter table public.load_desk_agent_runs enable row level security;
alter table public.load_desk_agent_actions enable row level security;
alter table public.load_desk_agent_pending enable row level security;
alter table public.load_desk_operator_settings enable row level security;

revoke all on public.load_desk_agent_runs, public.load_desk_agent_actions,
  public.load_desk_agent_pending, public.load_desk_operator_settings
  from anon, authenticated;
grant select, insert, update, delete on public.load_desk_agent_runs to authenticated;
grant select, insert, update, delete on public.load_desk_agent_actions to authenticated;
grant select, insert, update, delete on public.load_desk_agent_pending to authenticated;
grant select, insert, update, delete on public.load_desk_operator_settings to authenticated;

create policy "Members read agent runs" on public.load_desk_agent_runs
  for select to authenticated using (public.load_desk_is_member(workspace_id));
create policy "Members add agent runs" on public.load_desk_agent_runs
  for insert to authenticated with check (public.load_desk_is_member(workspace_id));
create policy "Members edit agent runs" on public.load_desk_agent_runs
  for update to authenticated
  using (public.load_desk_is_member(workspace_id))
  with check (public.load_desk_is_member(workspace_id));
create policy "Members delete agent runs" on public.load_desk_agent_runs
  for delete to authenticated using (public.load_desk_is_member(workspace_id));

create policy "Members read agent actions" on public.load_desk_agent_actions
  for select to authenticated using (public.load_desk_is_member(workspace_id));
create policy "Members add agent actions" on public.load_desk_agent_actions
  for insert to authenticated with check (public.load_desk_is_member(workspace_id));
create policy "Members edit agent actions" on public.load_desk_agent_actions
  for update to authenticated
  using (public.load_desk_is_member(workspace_id))
  with check (public.load_desk_is_member(workspace_id));
create policy "Members delete agent actions" on public.load_desk_agent_actions
  for delete to authenticated using (public.load_desk_is_member(workspace_id));

create policy "Members read agent confirmations" on public.load_desk_agent_pending
  for select to authenticated using (public.load_desk_is_member(workspace_id));
create policy "Members add agent confirmations" on public.load_desk_agent_pending
  for insert to authenticated with check (public.load_desk_is_member(workspace_id));
create policy "Members edit agent confirmations" on public.load_desk_agent_pending
  for update to authenticated
  using (public.load_desk_is_member(workspace_id))
  with check (public.load_desk_is_member(workspace_id));
create policy "Members delete agent confirmations" on public.load_desk_agent_pending
  for delete to authenticated using (public.load_desk_is_member(workspace_id));

create policy "Members read operator settings" on public.load_desk_operator_settings
  for select to authenticated using (public.load_desk_is_member(workspace_id));
create policy "Members add operator settings" on public.load_desk_operator_settings
  for insert to authenticated with check (public.load_desk_is_member(workspace_id));
create policy "Members edit operator settings" on public.load_desk_operator_settings
  for update to authenticated
  using (public.load_desk_is_member(workspace_id))
  with check (public.load_desk_is_member(workspace_id));
create policy "Members delete operator settings" on public.load_desk_operator_settings
  for delete to authenticated using (public.load_desk_is_member(workspace_id));
