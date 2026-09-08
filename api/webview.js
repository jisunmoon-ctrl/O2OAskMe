const HOST_OK = /(^|\.)ohou\.se$/i;
const UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';

function allowed(url) {
  try {
    return HOST_OK.test(new URL(url).hostname);
  } catch {
    return false;
  }
}

function escapeAttr(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

function injectBase(html, base) {
  const tag = `<base href="${escapeAttr(base)}">`;
  return /<head[^>]*>/i.test(html) ? html.replace(/<head[^>]*>/i, (m) => m + tag) : tag + html;
}

function stripFrame(headers) {
  const out = {};
  for (const [k, v] of Object.entries(headers)) {
    const lk = k.toLowerCase();
    if (lk === 'x-frame-options' || lk === 'content-encoding' || lk === 'transfer-encoding' || lk === 'content-length') continue;
    if (lk === 'content-security-policy' || lk === 'content-security-policy-report-only') {
      const next = String(v).replace(/frame-ancestors[^;]*;?/gi, '').trim().replace(/^;|;$/g, '');
      if (next) out[k] = next;
      continue;
    }
    out[k] = v;
  }
  return out;
}

export default async function handler(req, res) {
  const url = String(req.query.url || '').trim();
  if (!allowed(url)) {
    res.status(400).send('host not allowed');
    return;
  }
  const upstream = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'text/html,*/*' }, redirect: 'follow' });
  if (!allowed(upstream.url)) {
    res.status(400).send('redirect host not allowed');
    return;
  }
  const buf = Buffer.from(await upstream.arrayBuffer());
  const ctype = upstream.headers.get('content-type') || '';
  let body = buf;
  if (ctype.toLowerCase().includes('text/html')) {
    body = Buffer.from(injectBase(buf.toString('utf8'), upstream.url), 'utf8');
  }
  const headers = {};
  upstream.headers.forEach((v, k) => { headers[k] = v; });
  const out = stripFrame(headers);
  out['cache-control'] = 'no-store';
  res.status(upstream.status);
  for (const [k, v] of Object.entries(out)) res.setHeader(k, v);
  res.send(body);
}
