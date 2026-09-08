#!/usr/bin/env python3
"""Static preview server + same-origin webview proxy for ohou.se pages."""
from __future__ import annotations

import html as html_lib
import re
import ssl
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.error import HTTPError, URLError
from urllib.parse import parse_qs, urlparse
from urllib.request import Request, urlopen

HOST_OK = re.compile(r'(^|\.)ohou\.se$')
UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'


def allowed(url: str) -> bool:
    host = (urlparse(url).hostname or '').lower()
    return bool(host and HOST_OK.search(host))


def strip_frame_headers(headers: dict[str, str]) -> dict[str, str]:
    out = {}
    for k, v in headers.items():
        lk = k.lower()
        if lk == 'x-frame-options':
            continue
        if lk in ('content-security-policy', 'content-security-policy-report-only'):
            v = re.sub(r'frame-ancestors[^;]*;?', '', v, flags=re.I).strip().strip(';').strip()
            if not v:
                continue
        if lk in ('content-encoding', 'transfer-encoding', 'content-length'):
            continue
        out[k] = v
    return out


def inject_base(body: bytes, base: str) -> bytes:
    text = body.decode('utf-8', errors='replace')
    tag = f'<base href="{html_lib.escape(base, quote=True)}">'
    if re.search(r'<head[^>]*>', text, flags=re.I):
        text = re.sub(r'(<head[^>]*>)', r'\1' + tag, text, count=1, flags=re.I)
    else:
        text = tag + text
    return text.encode('utf-8')


class Handler(SimpleHTTPRequestHandler):
    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path == '/__webview':
            self.proxy(parse_qs(parsed.query).get('url', [''])[0])
            return
        super().do_GET()

    def log_message(self, fmt, *args):
        super().log_message(fmt, *args)

    def proxy(self, url: str):
        url = (url or '').strip()
        if not allowed(url):
            self.send_error(400, 'host not allowed')
            return
        req = Request(url, headers={'User-Agent': UA, 'Accept': 'text/html,*/*'})
        ctx = ssl.create_default_context()
        try:
            with urlopen(req, timeout=20, context=ctx) as res:
                final = res.geturl()
                if not allowed(final):
                    self.send_error(400, 'redirect host not allowed')
                    return
                raw = res.read()
                headers = {k: v for k, v in res.headers.items()}
                status = res.status
        except HTTPError as e:
            raw = e.read() if e.fp else b''
            headers = {k: v for k, v in (e.headers.items() if e.headers else [])}
            status = e.code
            final = url
        except URLError:
            self.send_error(502, 'upstream failed')
            return

        ctype = (headers.get('Content-Type') or headers.get('content-type') or '')
        if 'text/html' in ctype.lower():
            raw = inject_base(raw, final)
        out = strip_frame_headers(headers)
        out['Cache-Control'] = 'no-store'
        self.send_response(status)
        for k, v in out.items():
            self.send_header(k, v)
        self.send_header('Content-Length', str(len(raw)))
        self.end_headers()
        self.wfile.write(raw)


if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', '8765'))
    httpd = ThreadingHTTPServer(('0.0.0.0', port), Handler)
    print(f'serving preview on http://127.0.0.1:{port}')
    httpd.serve_forever()
