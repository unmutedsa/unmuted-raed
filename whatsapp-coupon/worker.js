/* UNMUTED: the welcome code on WhatsApp (owner, 2026-11-03).
   The store's popup sends a mobile number here; this sends the store's discount code to that number on WhatsApp, once
   per number. The code itself lives only here (a secret), never on the site. Checks on the way: the request comes from
   the store, the visitor is not a bot (Cloudflare Turnstile), the number is a Saudi mobile, the same address is not
   hammering it. Numbers that got the code are kept (KV) so the owner can export the list.

   Who sends it (PROVIDER in wrangler.toml):
     "cartat" (default, owner 2026-11-08: the Salla app «كارتات إشعارات واتساب» she subscribed to) → Cartat's API,
              POST https://api.cartat.net/message/text with the store's Cartat access token. A plain text message
              (MESSAGE, {code} is replaced by the code); with CARTAT_TEMPLATE set, that approved template instead
              (official WhatsApp channel), the code in its parameter CARTAT_TEMPLATE_PARAM.
     "meta"   → WhatsApp Cloud API directly (an approved template, see README).

   POST /coupon   {"phone": "05…", "token": "<turnstile response>"}
     200 {"ok": true}                  sent
     200 {"ok": true, "already": true} this number had it before (not sent again)
     400 {"error": "phone"}            not a Saudi mobile
     403 {"error": "bot"}              Turnstile failed       403 {"error": "origin"}  not from the store
     429 {"error": "slow"}             too many tries from this address
     502 {"error": "send"}             WhatsApp refused (the number may not be on WhatsApp)
   GET /export?key=…  the numbers that got the code, as CSV (ADMIN_KEY)

   Secrets (Cloudflare dashboard or wrangler secret put …): COUPON_CODE, TURNSTILE_SECRET, ADMIN_KEY, and
   CARTAT_TOKEN (cartat) or WA_TOKEN (meta).
   Settings (wrangler.toml [vars]): PROVIDER, MESSAGE, CARTAT_TEMPLATE, CARTAT_TEMPLATE_PARAM, WA_PHONE_ID, TEMPLATE_NAME,
   TEMPLATE_LANG, TEMPLATE_BODY_CODE, TEMPLATE_COPY_BUTTON, GRAPH_VERSION, ALLOWED_ORIGINS, DRY_RUN ("1": everything but
   the WhatsApp call, for testing). KV binding: SENT. */

const json = (body, status, cors) => new Response(JSON.stringify(body), { status: status || 200, headers: { 'content-type': 'application/json; charset=utf-8', ...cors } });

// a Saudi mobile in any common writing (05…, 5…, +9665…, 009665…, Arabic digits, spaces) → 9665XXXXXXXX, else ''
export function saudiMobile(raw) {
  let d = String(raw || '').replace(/[٠-٩]/g, (c) => String(c.charCodeAt(0) - 0x660)).replace(/[۰-۹]/g, (c) => String(c.charCodeAt(0) - 0x6f0)).replace(/\D/g, '');
  if (d.startsWith('00')) d = d.slice(2);
  if (d.startsWith('966')) d = d.slice(3);
  if (d.startsWith('0')) d = d.slice(1);
  return /^5\d{8}$/.test(d) ? '966' + d : '';
}

// the text message (cartat without a template): the owner's wording from the README, {code} → the code
const DEFAULT_MESSAGE = 'هلا! هذا كود خصمك على أول صوت تختاره من UNMUTED:\n{code}\nاستخدمه عند الدفع في unmutedsa.com\nالبس صوتك.';
export function messageText(env) {
  return String(env.MESSAGE || DEFAULT_MESSAGE).replace(/\\n/g, '\n').split('{code}').join(env.COUPON_CODE || '');
}

function corsFor(req, env) {
  const origin = req.headers.get('origin') || '';
  const allowed = String(env.ALLOWED_ORIGINS || '').split(',').map((s) => s.trim()).filter(Boolean);
  if (!allowed.includes(origin)) return null;
  return { 'access-control-allow-origin': origin, 'access-control-allow-methods': 'POST, OPTIONS', 'access-control-allow-headers': 'content-type', 'access-control-max-age': '86400', vary: 'origin' };
}

async function turnstileOk(token, ip, env) {
  if (!token) return false;
  const form = new FormData();
  form.append('secret', env.TURNSTILE_SECRET);
  form.append('response', token);
  if (ip) form.append('remoteip', ip);
  const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: form });
  const out = await r.json().catch(() => ({}));
  return out.success === true;
}

// at most 20 tries an hour from one address (KV: counts per address and hour). Not lower: many phones on one
// mobile network share an address; Turnstile is the real check
async function tooMany(ip, env) {
  if (!ip) return false;
  const key = 'ip:' + ip + ':' + Math.floor(Date.now() / 3600000);
  const n = Number(await env.SENT.get(key)) || 0;
  if (n >= 20) return true;
  await env.SENT.put(key, String(n + 1), { expirationTtl: 3700 });
  return false;
}

// Cartat: https://docs.cartat.net (Authorization: Bearer <access token>; number with country code, no +)
export function cartatBody(to, env) {
  if (env.CARTAT_TEMPLATE) return { number: to, template_name: env.CARTAT_TEMPLATE, parameters: { [env.CARTAT_TEMPLATE_PARAM || 'code']: env.COUPON_CODE } };
  return { number: to, message: messageText(env) };
}
async function sendCartat(to, env) {
  const body = cartatBody(to, env);
  if (env.DRY_RUN === '1') return { ok: true, dry: body };
  const r = await fetch('https://api.cartat.net/message/text', {
    method: 'POST',
    headers: { authorization: 'Bearer ' + env.CARTAT_TOKEN, accept: 'application/json', 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  const out = await r.json().catch(() => ({}));
  const failed = out.status === 'error' || out.success === false || out.error;
  return { ok: r.ok && !failed, error: failed ? r.status + ' ' + JSON.stringify(out.error || out.message || out).slice(0, 200) : (r.ok ? '' : String(r.status)) };
}

async function sendMeta(to, env) {
  const components = [];
  if (env.TEMPLATE_BODY_CODE === '1') components.push({ type: 'body', parameters: [{ type: 'text', text: env.COUPON_CODE }] });
  if (env.TEMPLATE_COPY_BUTTON === '1') components.push({ type: 'button', sub_type: 'COPY_CODE', index: '0', parameters: [{ type: 'coupon_code', coupon_code: env.COUPON_CODE }] });
  const body = { messaging_product: 'whatsapp', to, type: 'template', template: { name: env.TEMPLATE_NAME, language: { code: env.TEMPLATE_LANG || 'ar' }, components } };
  if (env.DRY_RUN === '1') return { ok: true, dry: body };
  const r = await fetch('https://graph.facebook.com/' + (env.GRAPH_VERSION || 'v21.0') + '/' + env.WA_PHONE_ID + '/messages', {
    method: 'POST',
    headers: { authorization: 'Bearer ' + env.WA_TOKEN, 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  const out = await r.json().catch(() => ({}));
  return { ok: r.ok && !!(out.messages && out.messages[0]), error: out.error && (out.error.code + ' ' + out.error.message) };
}

const sendCode = (to, env) => ((env.PROVIDER || 'cartat') === 'meta' ? sendMeta(to, env) : sendCartat(to, env));

async function exportCsv(env) {
  const rows = ['number,sent_at'];
  let cursor;
  do {
    const page = await env.SENT.list({ prefix: 'sent:', cursor });
    for (const k of page.keys) rows.push(k.name.slice(5) + ',' + ((k.metadata && k.metadata.at) || ''));
    cursor = page.list_complete ? null : page.cursor;
  } while (cursor);
  return new Response(rows.join('\n') + '\n', { headers: { 'content-type': 'text/csv; charset=utf-8', 'content-disposition': 'attachment; filename="unmuted-whatsapp-numbers.csv"' } });
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (req.method === 'GET' && url.pathname === '/export') {
      return env.ADMIN_KEY && url.searchParams.get('key') === env.ADMIN_KEY ? exportCsv(env) : new Response('not found', { status: 404 });
    }
    if (url.pathname !== '/coupon') return new Response('not found', { status: 404 });
    const cors = corsFor(req, env);
    if (req.method === 'OPTIONS') return cors ? new Response(null, { status: 204, headers: cors }) : new Response(null, { status: 403 });
    if (req.method !== 'POST') return new Response('method', { status: 405 });
    if (!cors) return json({ error: 'origin' }, 403, {});

    const ip = req.headers.get('cf-connecting-ip') || '';
    const data = await req.json().catch(() => ({}));
    const phone = saudiMobile(data.phone);
    if (!phone) return json({ error: 'phone' }, 400, cors);
    if (await tooMany(ip, env)) return json({ error: 'slow' }, 429, cors);
    if (!(await turnstileOk(data.token, ip, env))) return json({ error: 'bot' }, 403, cors);
    if (await env.SENT.get('sent:' + phone)) return json({ ok: true, already: true }, 200, cors);

    const res = await sendCode(phone, env);
    if (!res.ok) {
      console.log('whatsapp send failed', phone.slice(0, 6) + '…', res.error || '');
      return json({ error: 'send' }, 502, cors);
    }
    await env.SENT.put('sent:' + phone, '1', { metadata: { at: new Date().toISOString() } });
    return json(env.DRY_RUN === '1' ? { ok: true, dry: res.dry } : { ok: true }, 200, cors);
  },
};
