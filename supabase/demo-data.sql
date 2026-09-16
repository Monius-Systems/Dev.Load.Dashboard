-- Demo data for one workspace: a company profile, 3 bill-to clients,
-- 5 customers, 4 trucks, and 14 saved tickets across 5 invoices over the last
-- three weeks.
--
-- Everything here is invented. No real company, customer, address or phone
-- number appears in this file.
--
-- HOW TO RUN
--   Paste the whole file into Supabase -> SQL Editor and Run. It fills the
--   workspace named on the `ws` line below, currently 'Monius Trucking'.
--   To fill a different one, change that line. The workspace ids in use are:
--     select distinct workspace_id from public.workspace_members;
--
-- It refuses to run on a workspace that already has tickets, or that already
-- has customers, trucks or clients (it would add a second set rather than
-- replace them). A company name and address already saved on the Account page
-- is kept as it is; the demo company is only used when none has been saved.
--
-- If it refuses, nothing at all is written — the whole script is one
-- transaction, so a failure part way through leaves no half-filled workspace.
--
-- TO REMOVE IT AGAIN, with the same workspace id (this deletes ALL tickets,
-- invoices and profiles in that workspace, so only use it on a demo one):
--   delete from public.load_desk_records   where workspace_id = 'Monius Trucking';
--   delete from public.load_desk_invoices  where workspace_id = 'Monius Trucking';
--   delete from public.load_desk_profiles  where workspace_id = 'Monius Trucking';
--
-- The tickets have no scanned image behind them, because a scan is a real file
-- in storage. Opening one says the original is not stored; everything else —
-- invoices, printing, totals, customers, trucks, the charts — works normally.
--
-- READING TICKETS IN THIS WORKSPACE
--   Uploading a new ticket here sends it to be read, and each workspace reads
--   on its own OpenAI key. For 'Monius Trucking' that is the server variable
--   OPENAI_API_KEY_MONIUS_TRUCKING (the workspace id in capitals, with
--   anything that is not a letter or digit as an underscore). Set it as a
--   secret on the host, or in .dev.vars locally. Without it, and without a
--   shared OPENAI_API_KEY, an upload says which variable is missing.

do $$
declare
  ws text := 'Monius Trucking';  -- the demo company's workspace

  client_midway  bigint;
  client_lake    bigint;
  client_prairie bigint;

  cust_ridge   bigint;
  cust_halsted bigint;
  cust_calsag  bigint;
  cust_north   bigint;
  cust_blue    bigint;

  truck_a bigint;
  truck_b bigint;
  truck_c bigint;
  truck_d bigint;

  -- Every ticket field, all empty. Each ticket below fills in what it knows,
  -- exactly as a scanned ticket does.
  blank_ticket constant jsonb := jsonb_build_object(
    'plant_code', null, 'plant_name', null, 'plant_address', null,
    'ticket_number', null, 'ticket_date', null, 'time_in', null, 'time_out', null,
    'customer_id', null, 'customer_name', null, 'order_number', null,
    'project_name', null, 'project_address', null, 'po_number', null,
    'product_code', null, 'product_description', null, 'other_charge', null,
    'dispatch_number', null, 'delivery_status', null, 'carrier_id', null,
    'carrier_name', null, 'vehicle_id', null, 'weighmaster', null,
    'rate_type', null, 'fuel_type', null,
    'gross_lb', null, 'tare_lb', null, 'net_lb', null,
    'gross_tons', null, 'tare_tons', null, 'net_tons', null,
    'ordered_loads', null, 'remaining_loads', null,
    'today_tons', null, 'today_loads', null,
    'rate', null, 'fuel_charge', null, 'hours', null
  );

  spec record;
  ticket_json jsonb;
  invoice_json jsonb;
  bill_to jsonb;
  ticket_day date;
  net_lb numeric;
  customer_id bigint;
  truck_id bigint;
  fake_sha text;
begin
  if ws = 'demo-workspace' then
    raise exception 'Set ws to a real workspace id first.';
  end if;

  if exists (select 1 from public.load_desk_records where workspace_id = ws) then
    raise exception 'Workspace % already has tickets; not adding demo data on top.', ws;
  end if;

  -- Customers, trucks and clients would be added a second time rather than
  -- replaced, which is worse than refusing.
  if exists (
    select 1 from public.load_desk_profiles
    where workspace_id = ws and kind in ('customer', 'truck', 'client')
  ) then
    raise exception
      'Workspace % already has customers, trucks or clients. Clear them first: delete from public.load_desk_profiles where workspace_id = % and kind in (''customer'',''truck'',''client'');',
      ws, quote_literal(ws);
  end if;

  ---------------------------------------------------------------- the company
  -- A workspace may have only one company profile. If this one already saved
  -- its name and address, that was a deliberate act and it is kept; the demo
  -- company is only used when there is nothing there yet.
  if not exists (
    select 1 from public.load_desk_profiles where workspace_id = ws and kind = 'company'
  ) then
    insert into public.load_desk_profiles (workspace_id, kind, profile)
    values (ws, 'company', jsonb_build_object(
      'name', 'MONIUS TRUCKING LLC',
      'display_name', 'Monius Trucking',
      'address_lines', jsonb_build_array('4120 W 55TH ST', 'CHICAGO, IL 60632'),
      'updated_at', now()
    ));
  end if;

  ------------------------------------------------------------ bill-to clients
  insert into public.load_desk_profiles (workspace_id, kind, profile)
  values (ws, 'client', jsonb_build_object(
    'name', 'MIDWAY AGGREGATE SUPPLY',
    'address_lines', jsonb_build_array('1450 S CICERO AVE', 'CICERO, IL 60804'),
    'phone', '708-555-0142', 'notes', '', 'created_at', now()
  )) returning id into client_midway;

  insert into public.load_desk_profiles (workspace_id, kind, profile)
  values (ws, 'client', jsonb_build_object(
    'name', 'LAKESHORE READY MIX',
    'address_lines', jsonb_build_array('2200 E 95TH ST', 'CHICAGO, IL 60617'),
    'phone', '773-555-0188', 'notes', 'Invoices emailed weekly.', 'created_at', now()
  )) returning id into client_lake;

  insert into public.load_desk_profiles (workspace_id, kind, profile)
  values (ws, 'client', jsonb_build_object(
    'name', 'PRAIRIE STATE MATERIALS',
    'address_lines', jsonb_build_array('830 N HARLEM AVE', 'OAK PARK, IL 60302'),
    'phone', '630-555-0110', 'notes', '', 'created_at', now()
  )) returning id into client_prairie;

  -- New invoices start billed to this one.
  update public.load_desk_profiles
  set profile = profile || jsonb_build_object('default_client_id', client_midway)
  where workspace_id = ws and kind = 'company';

  ----------------------------------------------------------------- customers
  insert into public.load_desk_profiles (workspace_id, kind, profile)
  values (ws, 'customer', jsonb_build_object(
    'name', 'Ridgeline Concrete',
    'ticket_customer_ids', jsonb_build_array('60311596'),
    'ticket_names', jsonb_build_array('RIDGELINE CONCRETE', 'RIDGELINE CONC'),
    'flat_rate', 275, 'rate_type', 'flat',
    'fuel_charge', 35, 'fuel_type', 'flat',
    'notes', '', 'created_at', now()
  )) returning id into cust_ridge;

  insert into public.load_desk_profiles (workspace_id, kind, profile)
  values (ws, 'customer', jsonb_build_object(
    'name', 'Halsted Excavating',
    'ticket_customer_ids', jsonb_build_array('60311742'),
    'ticket_names', jsonb_build_array('HALSTED EXCAVATING'),
    'flat_rate', 8.5, 'rate_type', 'per_ton',
    'fuel_charge', 12, 'fuel_type', 'percent',
    'notes', 'Paid per ton.', 'created_at', now()
  )) returning id into cust_halsted;

  insert into public.load_desk_profiles (workspace_id, kind, profile)
  values (ws, 'customer', jsonb_build_object(
    'name', 'Cal-Sag Paving',
    'ticket_customer_ids', jsonb_build_array('60312001'),
    'ticket_names', jsonb_build_array('CAL-SAG PAVING', 'CAL SAG PAVING'),
    'flat_rate', 95, 'rate_type', 'hourly',
    'fuel_charge', 40, 'fuel_type', 'flat',
    'notes', 'Hourly work, hours on the ticket.', 'created_at', now()
  )) returning id into cust_calsag;

  insert into public.load_desk_profiles (workspace_id, kind, profile)
  values (ws, 'customer', jsonb_build_object(
    'name', 'Northbrook Site Works',
    'ticket_customer_ids', jsonb_build_array('60312233'),
    'ticket_names', jsonb_build_array('NORTHBROOK SITE WORKS'),
    'flat_rate', 310, 'rate_type', 'flat',
    'fuel_charge', 30, 'fuel_type', 'flat',
    'notes', '', 'created_at', now()
  )) returning id into cust_north;

  insert into public.load_desk_profiles (workspace_id, kind, profile)
  values (ws, 'customer', jsonb_build_object(
    'name', 'Blue Island Grading',
    'ticket_customer_ids', jsonb_build_array('60312890'),
    'ticket_names', jsonb_build_array('BLUE ISLAND GRADING'),
    'flat_rate', 7.25, 'rate_type', 'per_ton',
    'fuel_charge', 10, 'fuel_type', 'percent',
    'notes', '', 'created_at', now()
  )) returning id into cust_blue;

  -------------------------------------------------------------------- trucks
  insert into public.load_desk_profiles (workspace_id, kind, profile)
  values (ws, 'truck', jsonb_build_object(
    'truck_number', '3211', 'nickname', 'Blue tri-axle', 'driver', 'M. Sobczak',
    'license_plate', 'IL 884213', 'notes', '', 'active', true, 'created_at', now()
  )) returning id into truck_a;

  insert into public.load_desk_profiles (workspace_id, kind, profile)
  values (ws, 'truck', jsonb_build_object(
    'truck_number', '3214', 'nickname', 'White Mack', 'driver', 'R. Delgado',
    'license_plate', 'IL 884977', 'notes', '', 'active', true, 'created_at', now()
  )) returning id into truck_b;

  insert into public.load_desk_profiles (workspace_id, kind, profile)
  values (ws, 'truck', jsonb_build_object(
    'truck_number', '4102', 'nickname', 'Quad', 'driver', 'T. Okafor',
    'license_plate', 'IL 901455', 'notes', 'New tarp.', 'active', true, 'created_at', now()
  )) returning id into truck_c;

  insert into public.load_desk_profiles (workspace_id, kind, profile)
  values (ws, 'truck', jsonb_build_object(
    'truck_number', '4108', 'nickname', 'Old red', 'driver', 'J. Nowak',
    'license_plate', 'IL 901502', 'notes', 'Out of service.', 'active', false, 'created_at', now()
  )) returning id into truck_d;

  ------------------------------------------------------- invoices and tickets
  for spec in
    select * from (values
      -- invoice,  batch,     days ago, ticket #,   customer,  truck, tons,  hours, project,                 destination
      ('10431', 'demo-b1',  19, '884201', 'ridge',   'a', 21.4::numeric, null::numeric, 'RIDGELINE PLANT 2',    '9200 S ASHLAND AVE, CHICAGO IL'),
      ('10431', 'demo-b1',  19, '884202', 'ridge',   'a', 22.1,  null, 'RIDGELINE PLANT 2',    '9200 S ASHLAND AVE, CHICAGO IL'),
      ('10431', 'demo-b1',  19, '884203', 'ridge',   'b', 20.8,  null, 'RIDGELINE PLANT 2',    '9200 S ASHLAND AVE, CHICAGO IL'),

      ('10437', 'demo-b2',  15, '884511', 'halsted', 'b', 23.6,  null, 'HALSTED SITE 4',       '1400 W 47TH ST, CHICAGO IL'),
      ('10437', 'demo-b2',  15, '884512', 'halsted', 'c', 24.2,  null, 'HALSTED SITE 4',       '1400 W 47TH ST, CHICAGO IL'),
      ('10437', 'demo-b2',  14, '884518', 'halsted', 'b', 22.9,  null, 'HALSTED SITE 4',       '1400 W 47TH ST, CHICAGO IL'),

      ('10442', 'demo-b3',  11, '884713', 'calsag',  'c', null,  8.5,  'CAL-SAG RESURFACE',    '13000 S CICERO AVE, ALSIP IL'),
      ('10442', 'demo-b3',  10, '884720', 'calsag',  'c', null,  9.0,  'CAL-SAG RESURFACE',    '13000 S CICERO AVE, ALSIP IL'),

      ('10448', 'demo-b4',   6, '885002', 'north',   'a', 19.7,  null, 'NORTHBROOK COMMONS',   '1750 SHERMER RD, NORTHBROOK IL'),
      ('10448', 'demo-b4',   6, '885003', 'north',   'b', 20.3,  null, 'NORTHBROOK COMMONS',   '1750 SHERMER RD, NORTHBROOK IL'),
      ('10448', 'demo-b4',   5, '885011', 'north',   'a', 21.0,  null, 'NORTHBROOK COMMONS',   '1750 SHERMER RD, NORTHBROOK IL'),

      ('10455', 'demo-b5',   2, '885308', 'blue',    'c', 25.1,  null, 'BLUE ISLAND YARD',     '12700 S WESTERN AVE, BLUE ISLAND IL'),
      ('10455', 'demo-b5',   2, '885309', 'blue',    'b', 24.4,  null, 'BLUE ISLAND YARD',     '12700 S WESTERN AVE, BLUE ISLAND IL'),
      ('10455', 'demo-b5',   1, '885315', 'blue',    'c', 23.8,  null, 'BLUE ISLAND YARD',     '12700 S WESTERN AVE, BLUE ISLAND IL')
    ) as t(invoice_number, batch_id, days_ago, ticket_number, customer_key, truck_key,
           net_tons, hours, project_name, project_address)
  loop
    ticket_day := current_date - spec.days_ago;

    customer_id := case spec.customer_key
      when 'ridge' then cust_ridge when 'halsted' then cust_halsted
      when 'calsag' then cust_calsag when 'north' then cust_north
      else cust_blue end;

    truck_id := case spec.truck_key
      when 'a' then truck_a when 'b' then truck_b
      when 'c' then truck_c else truck_d end;

    -- The bill-to is the client that invoice is addressed to.
    bill_to := case
      when spec.invoice_number in ('10431', '10448') then jsonb_build_object(
        'name', 'MIDWAY AGGREGATE SUPPLY',
        'address_lines', jsonb_build_array('1450 S CICERO AVE', 'CICERO, IL 60804'),
        'phone', '708-555-0142')
      when spec.invoice_number = '10437' then jsonb_build_object(
        'name', 'LAKESHORE READY MIX',
        'address_lines', jsonb_build_array('2200 E 95TH ST', 'CHICAGO, IL 60617'),
        'phone', '773-555-0188')
      else jsonb_build_object(
        'name', 'PRAIRIE STATE MATERIALS',
        'address_lines', jsonb_build_array('830 N HARLEM AVE', 'OAK PARK, IL 60302'),
        'phone', '630-555-0110')
    end;

    net_lb := coalesce(spec.net_tons, 0) * 2000;

    ticket_json := blank_ticket || jsonb_strip_nulls(jsonb_build_object(
      'plant_name', 'THORNTON QUARRY',
      'plant_address', 'THORNTON, IL',
      'ticket_number', spec.ticket_number,
      'ticket_date', to_char(ticket_day, 'YYYY-MM-DD'),
      'time_in', '07:'  || lpad(((spec.days_ago * 7) % 60)::text, 2, '0'),
      'time_out', '08:' || lpad(((spec.days_ago * 11) % 60)::text, 2, '0'),
      'customer_id', case spec.customer_key
        when 'ridge' then '60311596' when 'halsted' then '60311742'
        when 'calsag' then '60312001' when 'north' then '60312233'
        else '60312890' end,
      'customer_name', upper(case spec.customer_key
        when 'ridge' then 'Ridgeline Concrete' when 'halsted' then 'Halsted Excavating'
        when 'calsag' then 'Cal-Sag Paving' when 'north' then 'Northbrook Site Works'
        else 'Blue Island Grading' end),
      'project_name', spec.project_name,
      'project_address', spec.project_address,
      'product_description', 'CA-6 CRUSHED STONE',
      'carrier_name', 'MONIUS TRUCKING LLC',
      'vehicle_id', case spec.truck_key
        when 'a' then '3211' when 'b' then '3214' when 'c' then '4102' else '4108' end,
      'weighmaster', 'D. REYES',
      'rate_type', case spec.customer_key
        when 'halsted' then 'per_ton' when 'calsag' then 'hourly'
        when 'blue' then 'per_ton' else 'flat' end,
      'fuel_type', case spec.customer_key
        when 'halsted' then 'percent' when 'blue' then 'percent' else 'flat' end,
      'net_tons', spec.net_tons,
      'net_lb', case when spec.net_tons is null then null else net_lb end,
      'gross_lb', case when spec.net_tons is null then null else net_lb + 31000 end,
      'tare_lb', case when spec.net_tons is null then null else 31000 end,
      'hours', spec.hours,
      'rate', case spec.customer_key
        when 'ridge' then 275 when 'halsted' then 8.5 when 'calsag' then 95
        when 'north' then 310 else 7.25 end,
      'fuel_charge', case spec.customer_key
        when 'ridge' then 35 when 'halsted' then 12 when 'calsag' then 40
        when 'north' then 30 else 10 end
    ));

    invoice_json := jsonb_build_object(
      'invoice_number', spec.invoice_number,
      'invoice_date', to_char(ticket_day, 'YYYY-MM-DD'),
      'return_date', '',
      'truck_number', case spec.truck_key
        when 'a' then '3211' when 'b' then '3214' when 'c' then '4102' else '4108' end,
      'bill_to', bill_to
    );

    -- A stand-in for the scan's fingerprint: 64 hex characters, unique per
    -- ticket, so the "already saved" check behaves as it does for real files.
    fake_sha := md5(ws || spec.ticket_number) || md5(spec.ticket_number || ws);

    insert into public.load_desk_invoices (workspace_id, invoice_key, batch_id)
    values (ws, lower(btrim(spec.invoice_number)), spec.batch_id)
    on conflict do nothing;

    insert into public.load_desk_records
      (workspace_id, invoice_key, batch_id, source_sha256, source_page, ticket_date, record)
    values (
      ws,
      lower(btrim(spec.invoice_number)),
      spec.batch_id,
      fake_sha,
      1,
      ticket_day,
      jsonb_build_object(
        'saved_at', (now() - (spec.days_ago || ' days')::interval),
        'ticket', ticket_json,
        'invoice', invoice_json,
        'source', jsonb_build_object(
          'file_name', 'ticket-' || spec.ticket_number || '.pdf',
          'sha256', fake_sha,
          'page', 1,
          'size', 184320,
          'type', 'application/pdf',
          'kind', 'upload'
        ),
        'original_stored', false,
        'ocr_text', 'Demo ticket ' || spec.ticket_number || ' — no scan stored.',
        'customer_profile_id', customer_id,
        'truck_id', truck_id,
        'invoice_batch_id', spec.batch_id
      )
    );
  end loop;

  raise notice 'Demo data added to workspace %.', ws;
end $$;
