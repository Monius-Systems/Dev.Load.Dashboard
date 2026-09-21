-- What the reader gets wrong, learned from what people type over it — for
-- every workspace on this deployment.
--
-- When a date the reader read as 12/18/2025 is typed over as 12/15/2025 in
-- Load Desk, the fact worth keeping is not the date, which is one company's,
-- but that on this vendor's tickets the reader read an 8 where a 5 was
-- printed. That is a fact about the reader and the paper, not about any
-- customer, so it is kept here without a workspace and shared: the count of
-- each (vendor, read digit, printed digit) pair, and nothing else. A row
-- holds two single characters and a vendor name; there is nothing in it to
-- keep from anyone. Every signed-in user may read the counts; they are added
-- to only through the function below, which checks what it is given.

create table if not exists public.load_desk_misreads (
  vendor text not null check (vendor = lower(btrim(vendor)) and vendor <> '' and length(vendor) <= 40),
  field text not null check (field in ('date', 'number', 'weight')),
  read_char text not null check (length(read_char) = 1 and read_char ~ '^[0-9A-Za-z]$'),
  actual_char text not null check (length(actual_char) = 1 and actual_char ~ '^[0-9A-Za-z]$'),
  count integer not null default 0 check (count >= 0),
  updated_at timestamptz not null default now(),
  primary key (vendor, field, read_char, actual_char)
);

alter table public.load_desk_misreads enable row level security;
revoke all on public.load_desk_misreads from anon, authenticated;
grant select on public.load_desk_misreads to authenticated;

drop policy if exists "Signed-in users read misread counts" on public.load_desk_misreads;
create policy "Signed-in users read misread counts" on public.load_desk_misreads
  for select to authenticated using (true);

-- One more sighting of a pair. Runs as the definer so the table takes no
-- writes from the app directly, and refuses anything but a single character
-- either side and a vendor it recognises the shape of.
create or replace function public.load_desk_note_misread(
  p_vendor text,
  p_field text,
  p_read text,
  p_actual text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'not_signed_in' using errcode = '42501';
  end if;
  if p_read = p_actual then
    return;
  end if;
  insert into public.load_desk_misreads (vendor, field, read_char, actual_char, count, updated_at)
  values (lower(btrim(p_vendor)), p_field, p_read, p_actual, 1, now())
  on conflict (vendor, field, read_char, actual_char)
  do update set count = public.load_desk_misreads.count + 1, updated_at = now();
end;
$$;
revoke all on function public.load_desk_note_misread(text, text, text, text) from public, anon;
grant execute on function public.load_desk_note_misread(text, text, text, text) to authenticated;
