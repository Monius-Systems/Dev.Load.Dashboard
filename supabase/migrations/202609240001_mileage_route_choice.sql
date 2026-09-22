-- The way a truck actually goes between two places.
--
-- Mileage asks the router for a route and caches it under a key made of the
-- two places and the truck's size, so every repeat of that run — the ninth
-- load of the day, and the same run next week — reads the same row. That is
-- also why a person only has to settle such a run once: what is stored here
-- is what every one of those legs is worth.
--
-- `options` holds the ways the router last offered for this pair, so a choice
-- can name one of them by position and no distance ever has to be taken from
-- a browser. `chosen_index` says which one a person settled on; the row's own
-- miles, seconds and geometry are that option, copied up, so nothing that
-- reads a route has to know a choice was made. A chosen row is also the one
-- thing "Update mileage" does not throw away.

alter table public.load_desk_routes
  add column if not exists options jsonb not null default '[]'::jsonb
    check (jsonb_typeof(options) = 'array'),
  add column if not exists options_at timestamptz,
  add column if not exists chosen_index smallint check (chosen_index >= 0),
  add column if not exists chosen_at timestamptz;

comment on column public.load_desk_routes.options is
  'The ways the router last offered for this pair: [{miles, seconds, geometry, precision}].';
comment on column public.load_desk_routes.chosen_index is
  'Which of those a person chose; null means the router''s own first answer.';
