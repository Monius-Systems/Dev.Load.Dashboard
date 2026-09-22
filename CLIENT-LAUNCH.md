# A & D Trucking of Chicago — Load Desk launch

This app is A & D Trucking's client workspace: upload load tickets, review the
extracted fields, create invoices, and track customers, trucks and loads. It is
built to be linked from the Monius Systems website's **Client login**.

Where this stands: the database migration is applied and public sign-up is off
(step 1), and one account has workspace access for testing (step 2). **Nothing
is published yet.** Steps 3 and 4 are yours to run.

The addresses are decided:

| Address | What answers on it |
|---|---|
| `https://moniussystems.com` | the Monius Systems website |
| `https://dashboard.moniussystems.com` | this app, the Load Desk workspace |

Both are already written into the two projects (step 3 and step 4); what is
left is creating the hosting project, setting the server variables and pointing
DNS.

## How access and data work

- **Sign-in:** invite-only email and password through the Supabase project
  `ivpnwmpyoauymvjtjwmd`. Public sign-up is off, so an account can only be added
  from the Supabase dashboard (step 2).
- **Workspace:** every ticket, customer, truck and invoice belongs to a
  workspace, and a person's workspace comes from their row in
  `public.workspace_members` — not from anything in the build. A & D's is
  `ad-trucking-chicago`. No membership row means no access at all.
- **More than one company:** two companies can use the same deployment and
  neither sees the other's work. Everything is separated by workspace, in the
  database's own security rules as well as in the app, including invoice
  numbering and stored scans. Who shares with whom is decided entirely by which
  workspace you put each person in (step 2).
- **Data:** saved tickets, invoice numbers, and customer and truck profiles
  live in Postgres tables `load_desk_records`, `load_desk_invoices` and
  `load_desk_profiles`. Ticket scans live in the private storage bucket
  `load-desk-originals` under `ad-trucking-chicago/<sha256>`. How each field
  was read and settled is stored inside the ticket's own `record` JSON — there
  is no new table — and only values somebody reviewed are used to complete a
  later ticket.
- **Isolation:** row level security lets signed-in users read and write only
  rows and files for workspaces they are a member of. Every API route also
  checks membership on the server. Sign-in cookies are httpOnly and never
  readable by page scripts. Only the publishable key is used; never put a
  service-role or secret key in this app.
- **Local preview:** with `AUTH_MODE=local`, `npm run dev` on localhost runs
  without sign-in and saves in the browser. This is refused outside
  development and localhost, so it can never be the live behavior.
- **Language:** each person picks English or Polish under **Account →
  Language**, and it follows their account to any browser. Printed invoices and
  CSV exports stay in English.
- **Phone camera:** on a phone, **Load Desk → Scan ticket** photographs a
  ticket, finds its edges, straightens it and hands the result to the usual
  upload. Browsers only allow a camera on `https://`, so it works on the live
  address but not over a plain `http://` test address.

## 1. Create the database tables (once) — done

Applied to project `ivpnwmpyoauymvjtjwmd`, and sign-up is off. Kept here for a
rebuild, a restore, or a second client.

Review `supabase/migrations/202609150001_load_desk.sql`, then apply it to
project `ivpnwmpyoauymvjtjwmd`. It creates `public.workspace_members`, the
`load_desk_*` tables and functions, the `load-desk-originals` bucket and their
policies, and changes nothing else.

**It drops and recreates any existing `load_desk_*` tables, deleting their
rows.** The project had leftover `load_desk_invoices` and `load_desk_records`
tables from testing; confirm nothing in them is needed first.

Either paste the file into **Supabase → SQL Editor** and run it, or from this
folder:

```bash
supabase link --project-ref ivpnwmpyoauymvjtjwmd
supabase db push
```

`db push` applies the migrations in this folder's `supabase/migrations` only.
Take a backup first if the project holds other clients' data.

Keep **Authentication → Sign In / Providers → Allow new users to sign up**
turned off. Switching it on would let anyone create an account, though they
still could not open the workspace without a membership row.

### Later migrations

`supabase/migrations/202609210001_misreads.sql` adds one shared table,
`load_desk_misreads`, holding what the reader gets wrong learned from what
people type over it — a vendor name, a kind of field and two single
characters, counted. It has no workspace on purpose: it carries nothing of
any company's tickets, and every workspace on the deployment benefits from
it. Apply it with `supabase db push` (or paste it into the SQL editor).
Until it is applied the app learns nothing and says nothing about it.

`supabase/migrations/202609220001_rates.sql` adds the five tables the **Rates**
page works from — `load_desk_rate_periods`, `load_desk_rate_requests`,
`load_desk_rate_responses`, `load_desk_rate_events` and
`load_desk_invoice_locks` — all workspace-scoped with row-level security, like
every other Load Desk table. **It is not applied yet.** The DEV dashboard and
production share one Supabase project, so applying it touches both: it is the
manager's call when to run it, not something to push from a working copy.
Until it is applied the Rates page cannot load its rows and says the rates
could not be loaded; nothing else on the dashboard is affected.

`supabase/migrations/202609230001_mileage_calc_token.sql` adds one column,
`calc_token`, to `load_desk_daily_mileage`. A day is claimed with a fresh
token before it is worked out, and a result is written only by the calculation
whose token the row still carries, so two overlapping calculations of the same
day cannot leave an older answer behind. It changes no other table and no
policy. Apply it with `supabase db push`. Until it is applied a day that is
calculated twice at once can end up showing whichever answer finished last.

## 2. Give A & D Trucking accounts

`matthewmoniuszko@icloud.com` already has access, for testing. A & D's own
accounts still need creating, and test accounts removing, before handover.

For each person:

1. **Supabase → Authentication → Users → Add user.** Enter their email and a
   password (or send an invite), with "Auto confirm" on for a password user.
2. Put them in a workspace in the SQL editor. **This is the step that decides
   whose data they see**, so read the workspace id before running it:

```sql
insert into public.workspace_members (workspace_id, user_id)
select 'ad-trucking-chicago', id
from auth.users
where email = 'person@example.com';
```

Someone at A & D goes in `ad-trucking-chicago`, alongside their colleagues —
the dispatcher who scans tickets and the owner who invoices them need the same
customers, trucks and invoice numbers. Someone at a **different company** gets
their own id instead (see "Adding a second company" below). Putting them in
A & D's workspace would show them A & D's tickets and customers.

Remove someone's access (their account stays, the app locks them out):

```sql
delete from public.workspace_members
where workspace_id = 'ad-trucking-chicago'
  and user_id = (select id from auth.users where email = 'person@example.com');
```

Password resets: Supabase → Authentication → Users → the user → Send password
recovery, or set a new password there.

### Adding a second company

No migration and no second deployment. Make the account as above, then give it
a workspace id of its own — lowercase, with dashes:

```sql
insert into public.workspace_members (workspace_id, user_id)
select 'smith-hauling', id
from auth.users
where email = 'owner@smithhauling.com';
```

They sign in at the same address and see an empty dashboard: their own tickets,
their own customers and trucks, their own invoice numbers, and scans no one
else can open. Their first job is **Account → Company Name and Address** —
until they save it, their invoices say "Set your company name in Account"
instead of a company name, because no company is built into the app.

To add a colleague of theirs later, use the same `smith-hauling` id.

## 3. Deploy the app

The app uses the same stack as the Monius website (vinext on Cloudflare
Workers, packaged for OpenAI Sites by `@openai/sites-vite-plugin`).
`.openai/hosting.json` has no `project_id`, so it deploys as **its own** Sites
project and never overwrites the website.

1. Create a new Sites project for this folder and publish it the same way as
   the Monius website.
2. Set these server variables on the project (Supabase values from Supabase →
   Project Settings → API):

   | Name | Value |
   |---|---|
   | `AUTH_MODE` | `supabase` |
   | `SUPABASE_URL` | `https://ivpnwmpyoauymvjtjwmd.supabase.co` |
   | `SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_r-Y7LuRlb_yE5yTWwP3LxA_Zd0ZLqVH` |
   | `WEBSITE_URL` | `https://moniussystems.com` |
   | `OPENAI_API_KEY` | the Monius OpenAI key — set as a **secret**, value not recorded here |
   | `TOMTOM_API_KEY` | the Monius TomTom key for Mileage and IFTA — set as a **secret**, value not recorded here |
   | `RATE_MAIL_MODE` | leave unset. `DRAFT_ONLY` is what unset means, and it is the only mode this release can honour |
   | `RATE_DEV_TOOLS` | leave unset in production. `true` turns on the Rates page's "Simulate a reply" box and "Mark as sent" |

   `WEBSITE_URL` is what lets the website's Client Login sign people in; see
   step 4 for why its exact spelling matters.

   `OPENAI_API_KEY` is what reads load tickets. One Monius key serves every
   client workspace, so onboarding a client adds no variable of its own; which
   company a ticket belongs to is decided by the signed-in member's workspace.
   It is read only on the server, in `app/api/extract/route.ts`, and never
   reaches the browser. Without it, uploading a ticket says the reader is not
   configured and everything else still works.

   `TOMTOM_API_KEY` is what places ticket addresses and routes trucks for
   **Mileage** and **IFTA**. The same rules: one Monius key for every
   workspace, read only on the server (`lib/server/tomtom-key.ts`), never in
   the browser. Without it both pages say routing is not configured and
   everything else still works. The database tables they need are in
   `supabase/migrations/202609190001_ifta_mileage.sql`,
   `supabase/migrations/202609200001_mileage_stop_order.sql` and
   `supabase/migrations/202609230001_mileage_calc_token.sql`; apply all three
   with `supabase db push`.

3. Point `dashboard.moniussystems.com` at the project, as the host's custom-domain
   setup asks. The website keeps `moniussystems.com`. They have to be separate
   addresses: every route this app serves is at the root (`/login`,
   `/api/auth/website-login`, `/load-desk`), so it cannot live under a path of
   the website.
4. In **Supabase → Authentication → URL Configuration**, add
   `https://dashboard.moniussystems.com/**` as an allowed redirect URL, for invite
   and recovery emails.

Build locally before publishing:

```bash
npm ci
npm run verify   # typecheck, lint, build
npm test
```

## Rates: the rate & fuel agent

**Rates** is the seventh page on the bottom bar. It exists because the week's
invoices sit and wait for two figures the customer has not sent yet: the
hauling rate for a job, and that period's fuel surcharge.

What it does, in the order the desk does it:

1. **It says what is missing.** Every job a customer's loads went to over the
   period, and which of the two figures it is short. A rate already typed into
   **Customers** as a site rate counts as an answer and is never asked for — a
   hauling rate the office entered is what the tickets are billed at today.
2. **It drafts one email per customer**, busiest job first, in fixed wording
   worked out from the gap alone. No model writes to a customer. A person can
   edit any of it before it goes.
3. **It reads the reply.** A model may say what each sentence appears to state;
   what that means is settled afterwards by rules that cannot be talked round.
   Only a figure certain of all three things — which job, which unit, which
   number — and that no rule finds strange becomes a rate on its own.
   Everything else waits under **Replies to confirm**. A hauling rate three
   times what was last agreed (a dropped decimal point) is always a question,
   however plainly it is written.
4. **It prices the tickets.** The agreed rate is written onto the tickets'
   own fields, so the invoice, the print and the CSV export all read off one
   set of figures. A rate somebody typed by hand is never overwritten, and an
   invoice that has been finalized is never repriced — the disagreement is
   reported instead, with both totals.
5. **Invoices & tickets** shows what each invoice is still waiting for, and
   **Finalize** locks its pricing once it has gone out. **Unlock** reopens it
   and asks why; the reason is kept with the invoice.

### Nothing is emailed

This release writes drafts and stops. `mailAdapter()` in
`lib/server/rate-mail.ts` returns null, there is no network call anywhere in
that file or in any `app/api/rates/**` route, and **Send** refuses: 409
"Requests are drafts only on this deployment; nothing is emailed." on a
draft-only deployment, 503 "No email service is connected yet." on one that
would send but has no mailbox. Either way the draft is untouched and the
office copies it into its own mail. `RATE_MAIL_MODE` is the deployment's ceiling
and a customer's own send mode can only ask for less than it, so a profile
edited in Customers cannot turn a draft-only deployment into one that mails
people. Connecting a real mailbox is a deliberate act: one adapter, written
once and reviewed once, not a variable somebody sets.

### Trying it on DEV

With `RATE_DEV_TOOLS=true` (and automatically in the unprotected local
preview) the Rates page shows a **Development only** box that stands in for a
mailbox:

1. **Generate weekly requests** drafts what is missing for the period.
2. **Mark as sent (simulated)** moves a draft to "waiting for reply" without
   sending anything.
3. **Simulate a reply** takes a customer, an optional request and a message
   typed as the customer would have written it — "Markham fuel is 11%" — and
   puts it through the very same reader, matcher and pricing path an arriving
   email would go through. Nothing leaves the worker.

Leave `RATE_DEV_TOOLS` unset in production: with no mailbox connected, a
request there is marked sent by hand once the office has actually sent it.

`OPENAI_API_KEY` is what reads a reply in the customer's own words. Without
it the page says so and falls back to plain rules — "Markham 8.75/ton" still
reads — and anything the rules cannot place is left for a person. The key is
never what decides a figure.

## 4. Connect it to the website's Client Login

The website's footer **Client Login** opens its `/login` page, which has the
email and password form. Until the website knows this app's address it shows
"Sign-in isn't available yet" instead.

The form posts to this app's `/api/auth/website-login` as a normal page submit.
This app checks the account and workspace membership exactly like its own
login, sets its httpOnly session cookies, and opens the workspace. A failed
sign-in returns to the website's Client Login with a message. The endpoint
accepts posts only from the address in `WEBSITE_URL`; anything else gets 403.

1. The website folder's `app/client-portal.json` is already set:

   ```json
   { "dashboardUrl": "https://dashboard.moniussystems.com" }
   ```

   It is read at **build** time, so the website has to be rebuilt and published
   again for a change here to reach anyone. Only an `https://` address is
   accepted; anything else keeps the "not available yet" message.
2. On this app's Sites project, set `WEBSITE_URL` to `https://moniussystems.com`
   (step 3). **Signing in from the website does not work until this is set.**
   It also shows **Back to Monius Systems** on this app's own login page.

   **One address only.** The website's Client Login posts here from the browser,
   and this app compares that post's `Origin` against `WEBSITE_URL` exactly —
   one spelling, no others. If the website answers on both
   `moniussystems.com` and `www.moniussystems.com`, sign-in works from one and
   is refused with 403 from the other. Pick `https://moniussystems.com` as the
   real address and have `www` redirect to it, so there is only ever one origin
   to match.

This app's own `/login` keeps working on its own, for example as a bookmark.

Signing out returns to the website's Client Login too, using the same
`WEBSITE_URL`. Without it, sign-out falls back to this app's own login page.

Local development: the website reads `VITE_CLIENT_DASHBOARD_URL` from its
ignored `.env.local` (`http://127.0.0.1:4319`), and this app reads
`WEBSITE_URL` from `.dev.vars` (`http://127.0.0.1:4320`). Plain `http://` is
accepted only for localhost while developing. That website override is read
**in development only**: Vite loads `.env.local` whichever way it is building,
so without that guard a publish from a developer's own computer would carry
`http://127.0.0.1:4319` into the live site, where it is refused and the Client
Login quietly reads "Sign-in isn't available yet". A published build takes the
address from `client-portal.json` and nowhere else.

The link only opens the sign-in page; access is still decided by Supabase
membership. If more client dashboards follow, the website can link to a small
"choose your workspace" page instead.

## Before handing over

- [ ] Migration applied; sign-up disabled.
- [ ] A test account **with** membership can sign in, upload a ticket, save it,
      open the scan, print the invoice, and delete the ticket.
- [ ] A test account **without** membership sees "has not been given access"
      and every `/api/*` route returns 401 for it.
- [ ] The **published** website's Client Login shows a real sign-in form, not
      "Sign-in isn't available yet". Its form posts to
      `https://dashboard.moniussystems.com/api/auth/website-login` — check the page
      source if in doubt.
- [ ] Signing in from the website's Client Login opens the workspace, and doing
      it from `www.moniussystems.com` either redirects to the real address
      first or is not reachable at all (see step 4).
- [ ] Signing out returns to the **website's** Client Login (needs
      `WEBSITE_URL`), and the browser back button does not show workspace data.
- [ ] Two people saving tickets at the same time get distinct records; reusing
      another upload's invoice number is refused.
- [ ] **Invoices & tickets → Edit** reopens an invoice with its scan; changing
      a rate and the invoice number updates every ticket on it, the old number
      disappears, and taking another invoice's number is refused.
- [ ] Real A & D accounts created; test accounts removed.
- [ ] Supabase backups are enabled on the project's plan (or a scheduled export
      exists). The **Invoices & tickets → Export CSV** button is a manual
      backstop, not a backup.
- [ ] Company name and invoice address set under **Account → Company Name and
      Address**, and **Default bill-to client** set to the company A & D bills
      most, both confirmed with them. Until the address is saved, invoices print
      "Set your company name in Account" where the name belongs.
- [ ] With two companies on the deployment: signed in as the second company,
      the tickets, customers, trucks and invoice list are all empty, and an
      invoice number A & D already used can be used again there. Neither
      company's scans open for the other.
- [ ] A printed invoice (or Save as PDF) comes out as one US Letter landscape
      page for a normal invoice.
- [ ] On a real phone, on the live address: **Load Desk → Scan ticket** outlines
      a ticket, the person takes the photo, the app refuses a photo where the
      sheet runs off the top, left or right and asks for a retake, and the
      straightened photo extracts correctly.
- [ ] **Account → Language → Polski** translates the app for that person only,
      and a printed invoice is still English.
- [ ] `supabase/migrations/202609220001_rates.sql` applied (the manager decides
      when — DEV and production share the Supabase project), and **Rates** then
      loads with the period's jobs on it instead of saying the tables are
      missing.
- [ ] On **Rates**: generating the week's requests drafts one email per
      customer short a figure and none for a customer with nothing missing; a
      job whose rate is typed in **Customers** is asked only for fuel.
- [ ] `RATE_MAIL_MODE` and `RATE_DEV_TOOLS` are unset in production, the
      **Development only** box is not on the page, and **Send** says requests
      are drafts only on this deployment.
- [ ] **Invoices & tickets** shows "Waiting for rate" on an invoice with no
      rate, **Finalize** locks it, and a later rate change is reported against
      it rather than changing it.

## Known limits to tell the client

- Scanning is meant to be hands-off: tickets are read, checked against what
  the workspace knows, filed on their date's invoice and numbered without
  anyone looking. A ticket the evidence settles is approved on its own. What
  it cannot settle is asked once under **Needs your input** on Load Desk — a
  customer nobody has hauled for, a date that could not be read — and one
  answer covers every ticket it applies to. The project and the job site are
  never asked: what was read, or what the customer's saved sites complete,
  stands. A job site is saved onto a customer only when a person saves it
  there — from review, or by confirming a job under **Needs your input**,
  where "Don't save it" keeps it off the customer — never because a scan
  read it. A "New customer" question can be closed with **Don't create a
  customer**: the tickets are filed as read with no profile made. Customers
  and their addresses can be removed on the Customers page at any time. Only a ticket with a
  problem of its own (a
  cut-off ticket number, a weight that will not balance) opens the full
  review.
- Fields the reader cannot see whole are never completed by guessing.
- A field the printer cut off is completed only when the ticket itself, the
  vendor's layout, a saved customer profile, or a correction somebody made
  before in the same context supports one value, and the review screen shows
  the original print beside it. Reviewed ticket history corroborates but never
  decides on its own.
- Anything else is highlighted for confirmation, and ticket numbers, customer
  numbers, weights and dates are never completed from history.
- Heidelberg's ticket date is dot-matrix print in the margin and is never
  taken on the reader's word alone. Three things confirm it: the scale's own
  stamp (the `25DEC15` form, its year taken from the date box when the two
  faint year digits disagree), the plant's run of checked tickets numbered
  either side of it, and the pile it was scanned with — a day's tickets
  from one plant, numbered in sequence, date each other. A date one digit
  off that evidence is put right silently, and a month the margin cut off
  is completed. With none of it — a single ticket scanned on its own — the
  date is asked for under **Needs your input**. Any vendor whose dates get
  typed over three times, by anyone using the system, is treated the same
  way from then on.
- The job and the job site are never a question. A printed site that is one
  saved on the customer — the same once case and punctuation are set aside,
  or cut short, or a letter or two off — is written as saved; otherwise the
  print stands as read and can be corrected in review.
- Invoice numbers can be changed on any invoice in review. The typed number
  is where the series starts, worked back from that invoice's place in date
  order, and the other invoices move along to make room; a number another
  invoice held is not refused. Account → **Invoice numbers start at** sets
  the start directly.
- A photo where the sheet runs off the top, left or right is refused at
  capture.
- Carriers named under `knownCarriers` in `client.config.json` are set
  outright: a carrier line containing "Z FORCE" becomes Z Force
  Transportation with nothing to confirm. Add a carrier there to have it
  filled in the same way.
- Tickets uploaded together are grouped by their ticket date: one invoice per
  date. More tickets can be added to an invoice while reviewing it.
- Invoice numbers follow the ticket dates across the whole ledger, with no
  gaps, whatever order the paper arrives in: uploading older tickets after
  newer ones moves the newer invoices' numbers along to make room, and
  deleting an invoice closes the gap behind it (delete 2, and 3 becomes 2).
  An invoice already printed or sent can therefore change its number
  afterwards — treat a number as final only once every older ticket is in
  and nothing before it will be deleted.
- Load Desk keeps an upload in progress while you look at other pages, and a
  scan carries on reading in the background. Reloading the browser clears the
  queue; a ticket is only kept once it is saved.
- A customer name printed a letter or two differently still finds its profile,
  and the spelling can be remembered for next time. A name equally close to two
  customers matches neither, so the ticket is left without a profile.
- The camera scanner is for phones only, and needs the live `https://` address.
  The first time it opens, it downloads about 11 MB of vision code, which the
  phone then keeps.
- Everyone in the same workspace sees and can edit all tickets, customers and
  trucks (there are no per-user roles yet). People in different workspaces see
  nothing of each other's.
- Somebody who belongs to two workspaces gets the one they joined first; there
  is no way to switch between them yet.
- Supported ticket layouts: Heidelberg Materials and Ontario Trap Rock.
- Mileage and IFTA are two views of the same figures. **Mileage** is the
  working page: one card per truck and day, each saying how many loads, how
  far it drove, the estimated fuel, and where the day stands in plain words —
  *Ready*, *Updating…*, *Needs your help*, *Couldn't update* or *Settings
  changed*, each with its own mark so nothing is said by colour alone. **View
  route** opens the day: the miles, the loads, the estimated fuel, the route
  drawn on a map, the stops by name in the order they were driven, and the
  per-leg figures behind **Show details**. A day that needs a person says so
  in the same words and offers the one thing to press — **Fix order** when the
  tickets do not say which load was first, **Choose location** when the map
  cannot place an address, **Set yard** or **Set MPG** when a truck is missing
  either, **Open ticket** when an address is not on the ticket at all, and
  **Try again** when the routing service did not answer. **Update mileage**
  asks for the day again after settings change. **IFTA** only reports: a
  quarter at a time, totals, how many days are ready to file on, and a link
  back to Mileage for each day that is not. Nothing is corrected on the IFTA
  page.
- The mileage itself is an estimate: Yard → pickup → delivery per ticket →
  Yard, on roads open to the truck's configured size and weight as far as
  TomTom's data allows (its truck routing is marked beta). Fuel is route miles
  ÷ the truck's average MPG, not purchased fuel. Each truck needs its yard
  address entered in Truck Fleet; an address the map cannot place precisely is
  shown for a person to set once.
- Miles are not yet split by state, so the IFTA page reports a quarter as one
  line rather than per jurisdiction, and there is no filing export. The route
  geometry is stored for every leg, which is what a later release will split.
- **Rates** drafts the emails; it does not send them. No mailbox is connected
  in this release, so a request is copied out of the page and sent from the
  office's own mail, and a reply is pasted back in (or typed into the
  simulator on DEV). Replies are therefore not picked up automatically.
- The agent never invents a figure. A reply it is not certain of waits under
  **Replies to confirm** for a person, and a rate somebody typed on a ticket
  is never overwritten — the Rates page offers to apply the agreed one
  instead. Applying a rate to a ticket does not mark the ticket reviewed.
- A hauling rate agreed for a project is open-ended; a fuel surcharge holds
  only for the period it was given for, so last week's 11% can never quietly
  price next week's loads. A rate is never edited in place: a new figure
  supersedes the old one and the old one stays on file, so an invoice can
  always be explained by the rate in force when it was printed.
- Rates a ticket cannot hold — per mile, per day, custom pricing — are kept on
  file and the ticket says plainly that it cannot carry them, rather than
  being rounded into something it can.
