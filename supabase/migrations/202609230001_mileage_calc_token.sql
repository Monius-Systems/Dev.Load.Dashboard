-- Mileage: which calculation a day is being worked out by. claimDay writes a
-- fresh token whenever it takes the day, and a result or a state is written
-- only by the calculation whose token the row still carries. A calculation
-- overtaken by a newer one therefore writes nothing: the newest valid answer
-- stands, and never an older one that finished late.
alter table public.load_desk_daily_mileage
  add column calc_token text check (calc_token is null or length(calc_token) <= 64);
