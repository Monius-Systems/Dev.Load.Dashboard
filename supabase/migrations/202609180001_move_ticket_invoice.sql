-- A ticket belongs on the invoice of its date. Correcting the date on a saved
-- ticket can therefore take it off one invoice and onto another: onto the
-- invoice the other tickets of that date are already on, or onto a new one of
-- its own when there is none. Until now the upload (batch) a ticket was saved
-- with was fixed for life, and the invoice number a ticket carries is claimed
-- by that batch, so a ticket could change its number but never join another
-- upload's invoice — the claim on the number belonged to the other batch and
-- the check below refused it.
--
-- This lets an edit move a ticket to another batch. The rules stay: a number is
-- claimed by exactly one batch, a ticket's number must be claimed by the
-- ticket's own batch, and a number no ticket uses is released. What changes is
-- that the batch is now the ticket's to give, and the claim follows it.

-- The claim must hold for the batch the row ends up in, however it got there.
drop trigger if exists load_desk_records_check_invoice on public.load_desk_records;
create trigger load_desk_records_check_invoice
  before insert or update of invoice_key, batch_id on public.load_desk_records
  for each row execute function public.load_desk_check_invoice_claim();

-- Edits may now move a ticket between uploads. Its source file and page still
-- cannot change.
grant update (batch_id) on public.load_desk_records to authenticated;

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
  next_batch text;
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
    -- The batch the ticket is moving to, or the one it is on.
    next_batch := coalesce(nullif(btrim(change->>'batch_id'), ''), current_row.batch_id);
    if next_key <> current_row.invoice_key or next_batch <> current_row.batch_id then
      -- Claim the number for the batch the ticket will be on. Joining an
      -- invoice another batch already holds the claim to leaves that claim as
      -- it is, and the check trigger then decides whether the ticket may take
      -- that number: it may exactly when it is joining that batch.
      insert into public.load_desk_invoices (workspace_id, invoice_key, batch_id)
      values (target_workspace, next_key, next_batch)
      on conflict (workspace_id, invoice_key) do nothing;
    end if;
    update public.load_desk_records r
      set invoice_key = next_key,
          batch_id = next_batch,
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
