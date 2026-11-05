# LORIX Energy website

Marketing site for LORIX Energy: home, about, products (LFP battery, hybrid inverter, sodium-ion), technology, blog and contact.

**Stack:** Next.js 15 (App Router, TypeScript), Tailwind CSS v4, GSAP + ScrollTrigger + SplitText, three.js via React Three Fiber (lazy-loaded), Supabase (Postgres for posts and leads), Resend (email), Cloudflare Turnstile (spam), hosted on Cloudflare Workers via OpenNext, with media in Cloudflare R2.

Every page is statically generated. The only runtime work is the enquiry form (a server action), the blog revalidation webhook and a daily keep-alive cron.

## Local setup

```bash
pnpm install
cp .env.example .env.local   # then fill in the values (see below)
pnpm dev                     # http://localhost:3000
```

Other scripts:

| Command | What it does |
| --- | --- |
| `pnpm build && pnpm start` | Production build and server |
| `pnpm typecheck` | TypeScript check |
| `pnpm test` | Unit tests (Vitest) |
| `pnpm test:e2e` | Playwright smoke tests on desktop and mobile (needs `pnpm build` first) |
| `pnpm images <folder>` | Crops and converts source photos into AVIF/WebP in `public/images` (uses `scripts/crops.json`) |
| `node scripts/render-products.mjs` | Re-renders the 3D product stills in `public/renders` (needs `pnpm dev --port 3100`) |
| `pnpm cf:preview` | Builds for Cloudflare and runs the Worker locally |
| `pnpm cf:deploy` | Builds and deploys to Cloudflare |

## Environment variables

| Name | Where | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | public | `https://lorixenergy.com` in production |
| `NEXT_PUBLIC_SUPABASE_URL` | public | `https://hawtqspleiakwvyaqfkf.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | public | Supabase dashboard, API keys |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | public | Cloudflare dashboard, Turnstile |
| `TURNSTILE_SECRET_KEY` | secret | Turnstile secret |
| `SERVER_DB_TOKEN` | secret | Random string. Its SHA-256 must match `private.settings.server_token_sha256` in Supabase |
| `RESEND_API_KEY` | secret | Resend dashboard. Without it, leads are saved but no emails are sent |
| `LEAD_ALERT_TO` | secret | Inbox that receives new enquiries |
| `LEAD_FROM` | secret | Sender, on a domain verified in Resend |
| `REVALIDATE_SECRET` | secret | Shared with the Supabase webhook |
| `CRON_SECRET` | secret | Used by the daily keep-alive cron |
| `IP_HASH_SALT` | secret | Salt for hashing IPs in the rate-limit log |
| `NEXT_PUBLIC_MEDIA_URL` | public | `https://media.lorixenergy.com` in production; leave empty locally |

Never commit `.env.local`.

## Supabase

Migrations live in `supabase/migrations`. Apply them in order (Supabase CLI `supabase db push`, or paste them into the SQL editor).

- Tables: `posts`, `profiles`, `leads`, `submission_log`. Row level security is on for all of them.
- The site writes only through `SECURITY DEFINER` functions (`submit_lead`, `mark_lead_email`, `keepalive`), which check `SERVER_DB_TOKEN` against the stored hash. To rotate the token:
  ```sql
  update private.settings set value = encode(extensions.digest('NEW_TOKEN','sha256'),'hex') where key = 'server_token_sha256';
  ```
- Blog posts are read with the publishable key (published posts only).
- **Blog revalidation:** add a Database Webhook on `posts` (insert, update, delete) that POSTs to `https://lorixenergy.com/api/revalidate` with the header `x-revalidate-secret: <REVALIDATE_SECRET>`.

## Cloudflare

One-time setup with Wrangler (`npx wrangler login`):

```bash
npx wrangler r2 bucket create lorix-next-cache
npx wrangler r2 bucket create lorix-media
npx wrangler d1 create lorix-tag-cache        # copy the database_id into wrangler.jsonc
```


### Automatic deploys (recommended, works from Windows)

OpenNext builds most reliably on Linux, so let Cloudflare build the site from GitHub:

1. Cloudflare dashboard → Workers & Pages → Create → Import a repository → pick `Lorix-code`.
2. Build command: `pnpm cf:build`. Deploy command: `npx opennextjs-cloudflare deploy`.
3. Every push to `main` then builds and deploys. Public build values come from `.env.production` (committed; public values only).

Then set the secrets (one per variable in the "secret" rows above):

```bash
npx wrangler secret put TURNSTILE_SECRET_KEY
# ...and so on
```

The `NEXT_PUBLIC_*` values are baked in at build time, so put them in `.env.production` or in your CI environment before `pnpm cf:deploy`.

- **Custom domains:** attach `lorixenergy.com` and `www.lorixenergy.com` to the Worker, and `media.lorixenergy.com` to the `lorix-media` bucket.
- **Cron:** `wrangler.jsonc` runs the keep-alive daily at 00:30 UTC so the free Supabase project does not pause.
- **Size:** the Worker is about 1.3 MiB gzipped, under the 3 MiB free-plan limit.

## Resend

Verify `lorixenergy.com` in Resend by adding its SPF, DKIM and DMARC DNS records in Cloudflare. Then set `LEAD_FROM` to an address on that domain. Each lead sends two emails: an alert to the team and an auto-reply to the customer.

## Content notes

- LFP battery specs come from the LORIX datasheet. The 10 kWh model is assumed to be 51.2 V 200 Ah.
- Hybrid inverter specs are indicative placeholders until the datasheet is available.
- The sodium-ion page only registers interest until launch. Its images are 3D concept renders.
- The privacy policy and terms are drafts and need legal review.
- The CSP uses `'unsafe-inline'` for scripts so that pages can stay fully static (nonces would force dynamic rendering).

## Admin panel (`/admin`)

Sign in at `/admin/login` with a Supabase Auth account that has a row in `profiles`.

- **Admins** see the dashboard, all leads (search, filter, status, private notes, call/WhatsApp/email, delete, CSV export) and the blog.
- **Editors** see only the blog (write, preview, publish, schedule, images). Only admins can delete posts.

Add a staff member:

1. Supabase → Authentication → Users → **Add user** → create with email and password (tick auto-confirm).
2. Give them a role in the SQL editor:
   ```sql
   insert into public.profiles (id, display_name, role)
   select id, 'Their Name', 'admin' from auth.users where email = 'person@lorixenergy.com';
   ```
3. In Authentication → Sign In / Providers, turn **off** "Allow new users to sign up". Accounts without a profile row can't see anything anyway, but this keeps the user list clean.

Sessions are httpOnly cookies scoped to `/admin`, refreshed by `middleware.ts`. Every data call uses the signed-in user's token, so Postgres row level security enforces who can do what.

Blog images are resized in the browser (max 1600px, WebP), uploaded to the `lorix-media` R2 bucket, and served from `NEXT_PUBLIC_MEDIA_URL` (set it to `https://media.lorixenergy.com` in production) or from `/media/...` when that is not set. Saving a post refreshes the blog pages straight away.

## Next phase

- Final product photography, the official inverter datasheet and sodium-ion copy.
