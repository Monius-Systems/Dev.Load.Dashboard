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

   `WEBSITE_URL` is what lets the website's Client Login sign people in; see
   step 4 for why its exact spelling matters.

   `OPENAI_API_KEY` is what reads load tickets. One Monius key serves every
   client workspace, so onboarding a client adds no variable of its own; which
   company a ticket belongs to is decided by the signed-in member's workspace.
   It is read only on the server, in `app/api/extract/route.ts`, and never
   reaches the browser. Without it, uploading a ticket says the reader is not
   configured and everything else still works.

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

## Known limits to tell the client

- Scanning is meant to be hands-off: tickets are read, checked against what
  the workspace knows, filed on their date's invoice and numbered without
  anyone looking. A ticket the evidence settles is approved on its own. What
  it cannot settle is asked once under **Needs your input** on Load Desk — a
  customer nobody has hauled for, a date that could not be read — and one
  answer covers every ticket it applies to. The project and the job site are
  never asked: what was read, or what the customer's saved sites complete,
  stands, and a site the customer has not been to before is saved onto them
  as the ticket is approved. Only a ticket with a problem of its own (a
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
- A photo where the sheet runs off the top, left or right is refused at
  capture.
- Carriers named under `knownCarriers` in `client.config.json` are set
  outright: a carrier line containing "Z FORCE" becomes Z Force
  Transportation with nothing to confirm. Add a carrier there to have it
  filled in the same way.
- Tickets uploaded together are grouped by their ticket date: one invoice per
  date. More tickets can be added to an invoice while reviewing it.
- Invoice numbers follow the ticket dates across the whole ledger, whatever
  order the paper arrives in: uploading older tickets after newer ones moves
  the newer invoices' numbers along to make room. An invoice already printed
  or sent can therefore change its number afterwards — treat a number as
  final only once every older ticket is in.
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
