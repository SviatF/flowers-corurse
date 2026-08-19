from __future__ import annotations

import mimetypes
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

    # Resized Framer image/font variants can safely reuse the canonical local
    # file. This avoids duplicate CDN requests while preserving the same asset.
    suffix = Path(p.path).suffix.lower()
    if p.netloc.lower() == "framerusercontent.com" and suffix in {
        ".png", ".jpg", ".jpeg", ".webp", ".svg", ".avif", ".gif",
        ".woff", ".woff2", ".ttf", ".otf",
    }:
        query = ""

    return urlunsplit((p.scheme, p.netloc, p.path, query, ""))


def cached_file(url: str) -> Path | None:
    build_path, _ = build.local_target(url)
    try:
        rel = build_path.relative_to(build.VENDOR_BUILD)
    except ValueError:
        return None
    candidate = build.VENDOR_FINAL / rel
    if candidate.is_file() and candidate.stat().st_size > 0:
        return candidate
    return None


def download(url: str) -> tuple[bytes, str]:
    cached = cached_file(url)
    if cached is not None:
        content_type = mimetypes.guess_type(cached.name)[0] or "application/octet-stream"
        return cached.read_bytes(), content_type

    last_error: Exception | None = None
    for attempt in range(5):
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
            with urlopen(req, timeout=75) as response:
                data = response.read()
                content_type = response.headers.get("content-type", "")
                if not data:
                    raise RuntimeError("empty response")
                return data, content_type
        except (HTTPError, URLError, TimeoutError, ConnectionError, OSError, RuntimeError) as exc:
            last_error = exc
            if attempt == 4:
                break
            time.sleep(1.25 * (attempt + 1))

    raise RuntimeError(f"download failed after retries: {last_error}")


build.clean_url = clean_url
build.download = download
build.main()
