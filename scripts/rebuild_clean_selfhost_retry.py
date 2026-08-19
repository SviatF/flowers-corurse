from __future__ import annotations

import time
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import urlsplit, urlunsplit
from urllib.request import Request, urlopen

import rebuild_clean_selfhost as build


ORIGINAL_CLEAN_URL = build.clean_url


def clean_url(value: str) -> str:
    url = ORIGINAL_CLEAN_URL(value)
    p = urlsplit(url)
    query = p.query.rstrip("&")

    # Framer image/font query strings only request resized variants. Mirroring
    # the canonical local file avoids dozens of duplicate downloads and makes
    # the final site independent of the CDN image transformer.
    suffix = Path(p.path).suffix.lower()
    if p.netloc.lower() == "framerusercontent.com" and suffix in {
        ".png", ".jpg", ".jpeg", ".webp", ".svg", ".avif", ".gif",
        ".woff", ".woff2", ".ttf", ".otf",
    }:
        query = ""

    return urlunsplit((p.scheme, p.netloc, p.path, query, ""))


def download(url: str) -> tuple[bytes, str]:
    last_error: Exception | None = None
    for attempt in range(8):
        req = Request(
            url,
            headers={
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/150 Safari/537.36",
                "Accept": "*/*",
                "Connection": "close",
                "Cache-Control": "no-cache",
            },
        )
        try:
            with urlopen(req, timeout=90) as response:
                data = response.read()
                content_type = response.headers.get("content-type", "")
                if not data:
                    raise RuntimeError("empty response")
                time.sleep(0.08)
                return data, content_type
        except (HTTPError, URLError, TimeoutError, ConnectionError, OSError, RuntimeError) as exc:
            last_error = exc
            if attempt == 7:
                break
            time.sleep(min(20, 1.5 * (2 ** attempt)))

    raise RuntimeError(f"download failed after retries: {last_error}")


build.clean_url = clean_url
build.download = download
build.main()
