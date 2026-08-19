from __future__ import annotations

import hashlib
import html as html_lib
import re
import shutil
from collections import deque
from pathlib import Path
from urllib.parse import urljoin, urlsplit, urlunsplit
from urllib.request import Request, urlopen

from bs4 import BeautifulSoup

ROOT = Path.cwd()
HTML_PATH = ROOT / "public" / "snapshot" / "reference.html"
VENDOR_ROOT = ROOT / "public" / "vendor"

MIRROR_HOSTS = {
    "framerusercontent.com",
    "fonts.gstatic.com",
    "fonts.googleapis.com",
    "rsms.me",
    "www.hvdfonts.com",
    "www.reset-type.com",
    "reset-type.com",
    "emyselfdesign.com",
    "www.emyselfdesign.com",
}

TEXT_SUFFIXES = {".mjs", ".js", ".css", ".json", ".svg", ".html", ".txt", ".xml"}
ABS_URL_RE = re.compile(r"https?://[^\s\"'<>\\)]+")
URL_FUNC_RE = re.compile(r"url\(\s*(['\"]?)([^)'\"]+)\1\s*\)", re.I)
IMPORT_RE = re.compile(r"(?:from\s*|import\s*\()(['\"])([^'\"]+)\1", re.I)
NEW_URL_RE = re.compile(r"new\s+URL\(\s*(['\"])([^'\"]+)\1\s*,\s*import\.meta\.url\s*\)", re.I)

WORDMARK_RE = re.compile(
    r"https://framerusercontent\.com/images/nT1RIIaymTzAI6UESI2yEzrKinU\.png(?:\?[^\s\"'<>)]*)?",
    re.I,
)
HERO_PHOTO_RE = re.compile(
    r"https://framerusercontent\.com/images/hIvMq00Eiq5eJzxlzt69EooL6Cg\.jpg(?:\?[^\s\"'<>)]*)?",
    re.I,
)


def clean_url(value: str) -> str:
    value = html_lib.unescape(value.strip()).rstrip(".,;")
    p = urlsplit(value)
    return urlunsplit((p.scheme, p.netloc, p.path, p.query, ""))


def should_mirror(url: str) -> bool:
    try:
        return urlsplit(url).netloc.lower() in MIRROR_HOSTS
    except Exception:
        return False


def local_target(url: str) -> tuple[Path, str]:
    p = urlsplit(url)
    host = p.netloc.lower()
    rel = Path((p.path or "/index").lstrip("/"))
    if not rel.name:
        rel = rel / "index"
    if p.query:
        digest = hashlib.sha1(p.query.encode()).hexdigest()[:10]
        if rel.suffix:
            rel = rel.with_name(f"{rel.stem}__q_{digest}{rel.suffix}")
        else:
            rel = rel.with_name(f"{rel.name}__q_{digest}")
    fs = VENDOR_ROOT / host / rel
    public = "/vendor/" + "/".join((host, *rel.parts))
    return fs, public


def get(url: str) -> tuple[bytes, str]:
    req = Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/150 Safari/537.36",
            "Accept": "*/*",
        },
    )
    with urlopen(req, timeout=60) as response:
        return response.read(), response.headers.get("content-type", "")


def is_text(path: Path, content_type: str) -> bool:
    return path.suffix.lower() in TEXT_SUFFIXES or any(
        key in content_type.lower()
        for key in ("text/", "javascript", "json", "svg", "xml")
    )


def references(text: str, base: str) -> dict[str, str]:
    found: dict[str, str] = {}
    for raw in ABS_URL_RE.findall(text):
        resolved = clean_url(raw)
        if should_mirror(resolved):
            found[raw] = resolved
    for pattern in (URL_FUNC_RE, IMPORT_RE, NEW_URL_RE):
        for match in pattern.finditer(text):
            raw = match.group(2)
            if raw.startswith(("data:", "blob:", "#", "mailto:", "tel:", "/vendor/")):
                continue
            resolved = clean_url(urljoin(base, raw))
            if should_mirror(resolved):
                found[raw] = resolved
    return found


def prepare_html(source: str) -> str:
    # Replace hero values everywhere, including Framer hydration payloads.
    source = WORDMARK_RE.sub("/assets/hero-wordmark.svg", source)
    source = HERO_PHOTO_RE.sub("/hero-florist", source)
    source = source.replace("images/nT1RIIaymTzAI6UESI2yEzrKinU.png", "/assets/hero-wordmark.svg")
    source = source.replace("images/hIvMq00Eiq5eJzxlzt69EooL6Cg.jpg", "/hero-florist")
    source = source.replace('data-framer-name="Dan Mall"', 'data-framer-name="ГРОШІ НА КВІТАХ"')
    source = source.replace('data-framer-name="Danmal Image"', 'data-framer-name="Hero Floral Image"')

    soup = BeautifulSoup(source, "html.parser")

    # No reference-site analytics/editor/search network calls.
    for script in list(soup.find_all("script")):
        src = script.get("src", "")
        body = script.get_text(" ", strip=True)
        if any(
            token in src or token in body
            for token in (
                "events.framer.com",
                "googletagmanager.com",
                "t.rightmessage.com",
                "__framer_force_showing_editorbar_since",
            )
        ):
            script.decompose()

    for meta in list(soup.find_all("meta")):
        if meta.get("name") in {"framer-search-index", "framer-search-index-fallback"}:
            meta.decompose()

    for link in list(soup.find_all("link")):
        href = link.get("href", "")
        rel = {str(x).lower() for x in link.get("rel", [])}
        if "preconnect" in rel and href.startswith("https://"):
            link.decompose()

    # Direct DOM values too, in case serializer normalized the source.
    for img in soup.find_all("img"):
        src = img.get("src", "")
        if "nT1RIIaymTzAI6UESI2yEzrKinU" in src:
            img["src"] = "/assets/hero-wordmark.svg"
            img.attrs.pop("srcset", None)
            img.attrs.pop("sizes", None)
            img["alt"] = "ГРОШІ НА КВІТАХ"
        elif "hIvMq00Eiq5eJzxlzt69EooL6Cg" in src:
            img["src"] = "/hero-florist"
            img.attrs.pop("srcset", None)
            img.attrs.pop("sizes", None)
            img["alt"] = "Квіти"

    return str(soup)


def mirror(source: str) -> tuple[str, list[str]]:
    queue: deque[str] = deque()
    queued: set[str] = set()
    mapping: dict[str, str] = {}
    text_assets: dict[str, tuple[str, dict[str, str]]] = {}
    failures: list[str] = []

    for resolved in references(source, "https://danmall.com/").values():
        if resolved not in queued:
            queued.add(resolved)
            queue.append(resolved)

    while queue:
        url = queue.popleft()
        fs, public = local_target(url)
        mapping[url] = public
        try:
            data, content_type = get(url)
        except Exception as exc:
            failures.append(f"{url} :: {exc}")
            continue

        fs.parent.mkdir(parents=True, exist_ok=True)
        fs.write_bytes(data)

        if is_text(fs, content_type):
            try:
                text = data.decode("utf-8")
            except UnicodeDecodeError:
                continue
            refs = references(text, url)
            text_assets[url] = (text, refs)
            for resolved in refs.values():
                if resolved not in queued:
                    queued.add(resolved)
                    queue.append(resolved)

    if failures:
        raise RuntimeError("Could not mirror:\n" + "\n".join(failures))

    for url, (text, refs) in text_assets.items():
        for raw, resolved in sorted(refs.items(), key=lambda item: len(item[0]), reverse=True):
            local = mapping.get(resolved)
            if local:
                text = text.replace(raw, local)
        fs, _ = local_target(url)
        fs.write_text(text, encoding="utf-8")

    html_refs = references(source, "https://danmall.com/")
    for raw, resolved in sorted(html_refs.items(), key=lambda item: len(item[0]), reverse=True):
        local = mapping.get(resolved)
        if local:
            source = source.replace(raw, local)

    return source, sorted(mapping)


def audit_html(source: str) -> None:
    forbidden = (
        "danmall.com",
        "framerusercontent.com",
        "fonts.gstatic.com",
        "fonts.googleapis.com",
        "events.framer.com",
        "t.rightmessage.com",
        "googletagmanager.com",
        "floral-hero-title.js",
        "floral-copy-core.js",
    )
    hits = [token for token in forbidden if token in source]
    if hits:
        raise RuntimeError("Forbidden runtime references remain in HTML: " + ", ".join(hits))
    if "/assets/hero-wordmark.svg" not in source:
        raise RuntimeError("Local hero wordmark is missing")
    if "/hero-florist" not in source:
        raise RuntimeError("Local hero floral image is missing")
    if "ГРОШІ НА КВІТАХ" not in source:
        raise RuntimeError("Hero title label is missing")


def audit_vendor() -> None:
    forbidden = ("framerusercontent.com", "fonts.gstatic.com", "fonts.googleapis.com")
    hits: list[str] = []
    for path in VENDOR_ROOT.rglob("*"):
        if not path.is_file() or path.suffix.lower() not in TEXT_SUFFIXES:
            continue
        try:
            text = path.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            continue
        for token in forbidden:
            if token in text:
                hits.append(f"{path.relative_to(ROOT)} -> {token}")
    if hits:
        raise RuntimeError("External asset imports remain:\n" + "\n".join(hits[:80]))


def main() -> None:
    source = HTML_PATH.read_text(encoding="utf-8")
    source = prepare_html(source)

    if VENDOR_ROOT.exists():
        shutil.rmtree(VENDOR_ROOT)

    source, mirrored = mirror(source)
    audit_html(source)
    HTML_PATH.write_text(source, encoding="utf-8")
    audit_vendor()

    report = [
        "FULL SELF-HOST BUILD",
        f"mirrored runtime assets: {len(mirrored)}",
        "client-side floral override scripts: 0",
        "danmall.com runtime dependencies: 0",
        "framerusercontent.com runtime dependencies: 0",
        "fonts CDN runtime dependencies: 0",
        "hero wordmark: /assets/hero-wordmark.svg",
        "hero floral image: /hero-florist",
        "",
        *mirrored,
    ]
    (ROOT / "public" / "snapshot" / "SELFHOST_REPORT.txt").write_text(
        "\n".join(report) + "\n", encoding="utf-8"
    )


if __name__ == "__main__":
    main()
