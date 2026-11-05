// Wraps the OpenNext worker to add a daily Cron Trigger that pings Supabase.
// @ts-expect-error: generated at build time by `opennextjs-cloudflare build`
import handler from './.open-next/worker.js';

type Env = { CRON_SECRET?: string; NEXT_PUBLIC_SITE_URL?: string };

export default {
  fetch: handler.fetch,
  async scheduled(_event: unknown, env: Env, ctx: { waitUntil(p: Promise<unknown>): void }) {
    const req = new Request(`${env.NEXT_PUBLIC_SITE_URL ?? 'https://lorixenergy.com'}/api/keepalive`, {
      headers: { authorization: `Bearer ${env.CRON_SECRET ?? ''}` },
    });
    ctx.waitUntil(handler.fetch(req, env, ctx));
  },
};
