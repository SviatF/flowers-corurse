from __future__ import annotations

import mimetypes
import shutil
import time
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import urlsplit, urlunsplit
from urllib.request import Request, urlopen

import rebuild_clean_selfhost as build


ORIGINAL_CLEAN_URL = build.clean_url
ORIGINAL_MIRROR_RUNTIME = build.mirror_runtime


def clean_url(value: str) -> str:
    url = ORIGINAL_CLEAN_URL(value)
    p = urlsplit(url)
    query = p.query.rstrip("&")

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

    # Existing cache may use either the old host-shaped directory names or the
    # final neutral project directory names.
    old_candidate = build.VENDOR_FINAL / rel
    if old_candidate.is_file() and old_candidate.stat().st_size > 0:
        return old_candidate

    parts = list(rel.parts)
    aliases = {
        "framerusercontent.com": "framer",
        "fonts.gstatic.com": "fonts",
        "fonts.googleapis.com": "font-css",
    }
    if parts and parts[0] in aliases:
        parts[0] = aliases[parts[0]]
        neutral_candidate = build.VENDOR_FINAL.joinpath(*parts)
        if neutral_candidate.is_file() and neutral_candidate.stat().st_size > 0:
            return neutral_candidate

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
        except HTTPError as exc:
            if exc.code == 404 and urlsplit(url).path.lower().endswith(".css"):
                return b"/* unavailable legacy stylesheet; intentionally empty */\n", "text/css"
            last_error = exc
        except (URLError, TimeoutError, ConnectionError, OSError, RuntimeError) as exc:
            last_error = exc

        if attempt == 4:
            break
        time.sleep(1.25 * (attempt + 1))

    raise RuntimeError(f"download failed after retries: {last_error}")


def force_local_urls(text: str) -> str:
    replacements = (
        ("https://framerusercontent.com", "/vendor/framer"),
        ("https:\\/\\/framerusercontent.com", "/vendor/framer"),
        ("/vendor/framerusercontent.com", "/vendor/framer"),
        ("https://fonts.gstatic.com", "/vendor/fonts"),
        ("https:\\/\\/fonts.gstatic.com", "/vendor/fonts"),
        ("/vendor/fonts.gstatic.com", "/vendor/fonts"),
        ("https://fonts.googleapis.com", "/vendor/font-css"),
        ("https:\\/\\/fonts.googleapis.com", "/vendor/font-css"),
        ("/vendor/fonts.googleapis.com", "/vendor/font-css"),
        ("https://events.framer.com", ""),
        ("https:\\/\\/events.framer.com", ""),
        ("https://www.danmall.com", "/"),
        ("https://danmall.com", "/"),
        ("https:\\/\\/www.danmall.com", "/"),
        ("https:\\/\\/danmall.com", "/"),
        ("www.danmall.com", "local-site"),
        ("danmall.com", "local-site"),
        ("framerusercontent.com", "framer"),
        ("fonts.gstatic.com", "fonts"),
        ("fonts.googleapis.com", "font-css"),
    )
    for old, new in replacements:
        text = text.replace(old, new)
    return text


def rename_vendor_roots() -> None:
    aliases = {
        "framerusercontent.com": "framer",
        "fonts.gstatic.com": "fonts",
        "fonts.googleapis.com": "font-css",
    }
    for old_name, new_name in aliases.items():
        old = build.VENDOR_BUILD / old_name
        new = build.VENDOR_BUILD / new_name
        if not old.exists():
            continue
        if new.exists():
            shutil.rmtree(new)
        old.rename(new)


def mirror_runtime(source: str) -> tuple[str, list[str]]:
    localized, mirrored = ORIGINAL_MIRROR_RUNTIME(source)

    rename_vendor_roots()
    localized = force_local_urls(localized)

    for path in build.VENDOR_BUILD.rglob("*"):
        if not path.is_file() or path.suffix.lower() not in build.TEXT_SUFFIXES:
            continue
        try:
            text = path.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            continue
        updated = force_local_urls(text)
        if updated != text:
            path.write_text(updated, encoding="utf-8")

    # Report values are diagnostic only; return neutral local paths so no source
    # host names are persisted in the final report either.
    mirrored = [force_local_urls(item) for item in mirrored]
    return localized, mirrored


build.clean_url = clean_url
build.download = download
build.mirror_runtime = mirror_runtime
build.main()
