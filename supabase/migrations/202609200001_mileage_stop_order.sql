-- Mileage: the order a person confirmed for a day's stops, kept beside the
-- day it was given for. { ticket_ids, basis, confirmed_at }: the basis ties
-- the confirmation to the tickets and addresses it was made for, so it is
-- dropped once the day changes rather than ordering the wrong stops.
alter table public.load_desk_daily_mileage
  add column stop_order jsonb check (stop_order is null or jsonb_typeof(stop_order) = 'object');
