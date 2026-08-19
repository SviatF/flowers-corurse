from __future__ import annotations

import hashlib
import html as html_lib
import json
import re
import shutil
import subprocess
from collections import deque
from pathlib import Path
from urllib.parse import urljoin, urlsplit, urlunsplit
from urllib.request import Request, urlopen

from bs4 import BeautifulSoup, NavigableString

ROOT = Path.cwd()
OUTPUT_HTML = ROOT / "public" / "snapshot" / "reference.html"
VENDOR_FINAL = ROOT / "public" / "vendor"
VENDOR_BUILD = ROOT / "public" / "vendor.__build"
REPORT = ROOT / "public" / "snapshot" / "CLEAN_SELFHOST_REPORT.txt"

CLEAN_SNAPSHOT_COMMIT = "241be1ca7361b77cf993cc9178c7be5888679939"
COPY_MAP_COMMIT = "b37380f72bd0d2b728bc0721d502d62d8aae80cd"

MIRROR_HOSTS = {"framerusercontent.com", "fonts.gstatic.com", "fonts.googleapis.com"}
RESOURCE_SUFFIXES = {
    ".mjs", ".js", ".css", ".json", ".png", ".jpg", ".jpeg", ".webp",
    ".svg", ".woff", ".woff2", ".ttf", ".otf", ".avif", ".gif", ".ico",
}
TEXT_SUFFIXES = {".mjs", ".js", ".css", ".json", ".svg", ".html", ".txt", ".xml"}

# Deliberately stop at JS template/string punctuation as well as HTML punctuation.
ABS_URL_RE = re.compile(r"https?://[^\s\"'<>\\)``,;{}\[\]]+")
URL_FUNC_RE = re.compile(r"url\(\s*(['\"]?)([^)'\"]+)\1\s*\)", re.I)
IMPORT_RE = re.compile(
    r"(?:^|[;\n])\s*(?:import\s+(?:[^'\";]+?\s+from\s+)?|export\s+[^'\";]+?\s+from\s+)(['\"])([^'\"]+)\1",
    re.I | re.M,
)
DYNAMIC_IMPORT_RE = re.compile(r"import\(\s*(['\"])([^'\"]+)\1\s*\)", re.I)
NEW_URL_RE = re.compile(r"new\s+URL\(\s*(['\"])([^'\"]+)\1\s*,\s*import\.meta\.url\s*\)", re.I)

HERO_ASSETS = {
    "https://framerusercontent.com/images/BZcrpXuxs1Fhqa1qlhbe2HKEPIQ.webp": "/assets/flowers/pink-orchid-layer.webp",
    "https://framerusercontent.com/images/Vj2sUVeKh69wBm6eGZIvVWtEDo.webp": "/assets/flowers/white-magnolia-layer.webp",
    "https://framerusercontent.com/images/nT1RIIaymTzAI6UESI2yEzrKinU.png": "/assets/hero-wordmark.svg",
    "https://framerusercontent.com/images/hIvMq00Eiq5eJzxlzt69EooL6Cg.jpg": "/hero-florist",
}


def git_show(commit: str, path: str) -> str:
    return subprocess.check_output(
        ["git", "show", f"{commit}:{path}"], cwd=ROOT, text=True, encoding="utf-8"
    )


def parse_copy_map(source: str) -> dict[str, str]:
    match = re.search(r"const\s+map\s*=\s*(\{.*?\});\s*window\.__FLORAL_COPY__", source, re.S)
    if not match:
        raise RuntimeError("Could not parse floral copy map")
    return json.loads(match.group(1))


def load_copy() -> dict[str, str]:
    merged: dict[str, str] = {}
    for path in (
        "public/floral-copy-core.js",
        "public/floral-copy-results.js",
        "public/floral-copy-footer.js",
    ):
        merged.update(parse_copy_map(git_show(COPY_MAP_COMMIT, path)))
    return merged


def norm(value: str) -> str:
    return re.sub(r"\s+", " ", value.replace("\u00a0", " ")).strip()


def template_literal(value: str) -> str:
    return "`" + value.replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${") + "`"


def replace_exact_tokens(text: str, mapping: dict[str, str]) -> str:
    # Only complete string literals are replaced. This prevents e.g. Meta from
    # corrupting siteMetadata or any URL/module identifier.
    for old, new in sorted(mapping.items(), key=lambda item: len(item[0]), reverse=True):
        old_json = json.dumps(old, ensure_ascii=False)
        new_json = json.dumps(new, ensure_ascii=False)
        text = text.replace(old_json, new_json)
        text = text.replace(template_literal(old), template_literal(new))
        text = text.replace("'" + old.replace("'", "\\'") + "'", "'" + new.replace("'", "\\'") + "'")
    return text


def rewrite_hero_urls_everywhere(text: str) -> str:
    for remote, local in HERO_ASSETS.items():
        text = text.replace(remote, local)
        text = text.replace(remote.replace("/", "\\/"), local.replace("/", "\\/"))
    # Saveweb-style paths from any previous serialized copy.
    for key, local in (
        ("BZcrpXuxs1Fhqa1qlhbe2HKEPIQ.webp", "/assets/flowers/pink-orchid-layer.webp"),
        ("Vj2sUVeKh69wBm6eGZIvVWtEDo.webp", "/assets/flowers/white-magnolia-layer.webp"),
        ("nT1RIIaymTzAI6UESI2yEzrKinU.png", "/assets/hero-wordmark.svg"),
        ("hIvMq00Eiq5eJzxlzt69EooL6Cg.jpg", "/hero-florist"),
    ):
        text = text.replace("images/" + key, local)
    return text


def build_custom_html() -> str:
    source = git_show(CLEAN_SNAPSHOT_COMMIT, "public/snapshot/reference.html")
    mapping = load_copy()
    soup = BeautifulSoup(source, "html.parser")

    # Remove publisher/editor/analytics integrations; Framer visual runtime stays.
    for script in list(soup.find_all("script")):
        src = script.get("src", "")
        body = script.get_text(" ", strip=True)
        if any(
            token in src or token in body
            for token in (
                "googletagmanager.com",
                "t.rightmessage.com",
                "events.framer.com",
                "__framer_force_showing_editorbar_since",
            )
        ):
            script.decompose()

    for meta in list(soup.find_all("meta")):
        if meta.get("name") in {"framer-search-index", "framer-search-index-fallback"}:
            meta.decompose()
        if meta.get("property") == "og:url":
            meta.decompose()

    for link in list(soup.find_all("link")):
        rel = {str(x).lower() for x in link.get("rel", [])}
        if "canonical" in rel:
            link.decompose()
        elif "preconnect" in rel and str(link.get("href", "")).startswith("https://"):
            link.decompose()

    # Visible copy: exact normalized text-node matching only.
    lookup = {norm(k): v for k, v in mapping.items()}
    for node in list(soup.find_all(string=True)):
        parent = node.parent
        if not parent or parent.name in {"script", "style", "noscript"}:
            continue
        key = norm(str(node))
        if key in lookup:
            node.replace_with(NavigableString(lookup[key]))

    # Text-like attributes can also be changed safely when the whole value matches.
    for tag in soup.find_all(True):
        for attr in ("aria-label", "alt", "title"):
            value = tag.get(attr)
            if isinstance(value, str) and norm(value) in lookup:
                tag[attr] = lookup[norm(value)]

    # Direct hero/image DOM changes. No client mutation layer.
    for img in soup.find_all("img"):
        src = str(img.get("src", ""))
        if "BZcrpXuxs1Fhqa1qlhbe2HKEPIQ" in src:
            img["src"] = "/assets/flowers/pink-orchid-layer.webp"
            img.attrs.pop("srcset", None)
            img.attrs.pop("sizes", None)
        elif "Vj2sUVeKh69wBm6eGZIvVWtEDo" in src:
            img["src"] = "/assets/flowers/white-magnolia-layer.webp"
            img.attrs.pop("srcset", None)
            img.attrs.pop("sizes", None)
        elif "nT1RIIaymTzAI6UESI2yEzrKinU" in src:
            img["src"] = "/assets/hero-wordmark.svg"
            img.attrs.pop("srcset", None)
            img.attrs.pop("sizes", None)
            img["alt"] = "ГРОШІ НА КВІТАХ"
        elif "hIvMq00Eiq5eJzxlzt69EooL6Cg" in src:
            img["src"] = "/hero-florist"
            img.attrs.pop("srcset", None)
            img.attrs.pop("sizes", None)
            img["alt"] = "Квіти"

    for tag in soup.find_all(attrs={"data-framer-name": "Dan Mall"}):
        tag["data-framer-name"] = "ГРОШІ НА КВІТАХ"
    for tag in soup.find_all(attrs={"data-framer-name": "Danmal Image"}):
        tag["data-framer-name"] = "Hero Floral Image"

    # Programs link is local in SSR markup. /portfolio route remains a server fallback too.
    program_target = None
    for tag in soup.find_all(["a", "div", "section", "article"]):
        if "Флорист від нуля до результату" in " ".join(tag.stripped_strings):
            program_target = tag
            break
    if program_target is None:
        raise RuntimeError("Could not locate programs section")
    program_target["id"] = "programs"

    for anchor in soup.find_all("a"):
        label = norm(" ".join(anchor.stripped_strings)).lower()
        href = str(anchor.get("href", ""))
        if label in {"програми", "portfolio"} or re.search(r"/portfolio/?(?:$|[?#])", href, re.I):
            anchor["href"] = "#programs"
            anchor.attrs.pop("target", None)
            anchor.attrs.pop("rel", None)

    if soup.title:
        soup.title.string = "ГРОШІ НА КВІТАХ — курси флористики та квіткового бізнесу"
    description = soup.find("meta", attrs={"name": "description"})
    if description:
        description["content"] = "Курси флористики: професійна база, квітковий бізнес та VIP-наставництво."

    # Hydration/code payload: only exact quoted text values, never raw substrings.
    for script in soup.find_all("script"):
        if script.string:
            updated = replace_exact_tokens(str(script.string), mapping)
            updated = rewrite_hero_urls_everywhere(updated)
            # Exact navigation values only.
            updated = updated.replace('"/portfolio"', '"#programs"').replace('`/portfolio`', '`#programs`')
            script.string.replace_with(updated)

    result = str(soup)
    result = rewrite_hero_urls_everywhere(result)

    # Explicitly guarantee no old hero hashes survive in SSR or hydration.
    for hash_value in (
        "BZcrpXuxs1Fhqa1qlhbe2HKEPIQ",
        "Vj2sUVeKh69wBm6eGZIvVWtEDo",
        "nT1RIIaymTzAI6UESI2yEzrKinU",
        "hIvMq00Eiq5eJzxlzt69EooL6Cg",
    ):
        if hash_value in result:
            raise RuntimeError(f"Old hero hash still present: {hash_value}")

    if "siteНАВИЧКАdata" in result:
        raise RuntimeError("Unsafe copy replacement corrupted siteMetadata")
    if "danmall.com" in result:
        # No runtime/reference-domain dependency is allowed. Ordinary legacy links
        # are redirected to programs before this check where relevant.
        result = result.replace("https://danmall.com", "#programs")
        result = result.replace("https://www.danmall.com", "#programs")
    return result


def clean_url(value: str) -> str:
    value = html_lib.unescape(value.strip()).rstrip(".,;")
    p = urlsplit(value)
    return urlunsplit((p.scheme, p.netloc, p.path, p.query, ""))


def valid_resource(url: str) -> bool:
    try:
        p = urlsplit(url)
    except Exception:
        return False
    if p.netloc.lower() not in MIRROR_HOSTS:
        return False
    if any(token in url for token in ("${", "`", "[", "]", "{", "}")):
        return False
    if p.netloc.lower() == "fonts.googleapis.com":
        return True
    return Path(p.path).suffix.lower() in RESOURCE_SUFFIXES


def local_target(url: str) -> tuple[Path, str]:
    p = urlsplit(url)
    host = p.netloc.lower()
    rel = Path((p.path or "/index").lstrip("/"))
    if not rel.name or not rel.suffix:
        rel = rel / "__index"
    if p.query:
        digest = hashlib.sha1(p.query.encode()).hexdigest()[:10]
        if rel.suffix:
            rel = rel.with_name(f"{rel.stem}__q_{digest}{rel.suffix}")
        else:
            rel = rel.with_name(f"{rel.name}__q_{digest}")
    fs = VENDOR_BUILD / host / rel
    public = "/vendor/" + "/".join((host, *rel.parts))
    return fs, public


def download(url: str) -> tuple[bytes, str]:
    req = Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/150 Safari/537.36",
            "Accept": "*/*",
        },
    )
    with urlopen(req, timeout=60) as response:
        return response.read(), response.headers.get("content-type", "")


def discover(text: str, base_url: str) -> dict[str, str]:
    found: dict[str, str] = {}
    for raw in ABS_URL_RE.findall(text):
        resolved = clean_url(raw)
        if valid_resource(resolved):
            found[raw] = resolved

    for pattern in (URL_FUNC_RE, IMPORT_RE, DYNAMIC_IMPORT_RE, NEW_URL_RE):
        for match in pattern.finditer(text):
            raw = match.group(2)
            if raw.startswith(("data:", "blob:", "#", "/vendor/")):
                continue
            resolved = clean_url(urljoin(base_url, raw))
            if valid_resource(resolved):
                found[raw] = resolved
    return found


def is_text_asset(path: Path, content_type: str) -> bool:
    return path.suffix.lower() in TEXT_SUFFIXES or any(
        key in content_type.lower() for key in ("text/", "javascript", "json", "svg", "xml")
    )


def mirror_runtime(source: str) -> tuple[str, list[str]]:
    if VENDOR_BUILD.exists():
        shutil.rmtree(VENDOR_BUILD)
    VENDOR_BUILD.mkdir(parents=True, exist_ok=True)

    queue: deque[str] = deque()
    queued: set[str] = set()
    mapping: dict[str, str] = {}
    text_assets: dict[str, tuple[str, dict[str, str]]] = {}

    for resolved in discover(source, "https://danmall.com/").values():
        if resolved not in queued:
            queued.add(resolved)
            queue.append(resolved)

    failures: list[str] = []
    while queue:
        url = queue.popleft()
        fs, public = local_target(url)
        mapping[url] = public
        try:
            data, content_type = download(url)
        except Exception as exc:
            failures.append(f"{url} :: {exc}")
            continue

        fs.parent.mkdir(parents=True, exist_ok=True)
        fs.write_bytes(data)

        if is_text_asset(fs, content_type):
            try:
                text = data.decode("utf-8")
            except UnicodeDecodeError:
                continue
            refs = discover(text, url)
            text_assets[url] = (text, refs)
            for resolved in refs.values():
                if resolved not in queued:
                    queued.add(resolved)
                    queue.append(resolved)

    if failures:
        raise RuntimeError("Failed runtime resources:\n" + "\n".join(failures))

    for url, (text, refs) in text_assets.items():
        for raw, resolved in sorted(refs.items(), key=lambda item: len(item[0]), reverse=True):
            if resolved in mapping:
                text = text.replace(raw, mapping[resolved])
        fs, _ = local_target(url)
        fs.write_text(text, encoding="utf-8")

    html_refs = discover(source, "https://danmall.com/")
    for raw, resolved in sorted(html_refs.items(), key=lambda item: len(item[0]), reverse=True):
        if resolved in mapping:
            source = source.replace(raw, mapping[resolved])

    return source, sorted(mapping)


def verify(source: str) -> None:
    forbidden_html = (
        "danmall.com",
        "framerusercontent.com",
        "fonts.gstatic.com",
        "fonts.googleapis.com",
        "events.framer.com",
        "googletagmanager.com",
        "t.rightmessage.com",
        "floral-hero-title.js",
        "floral-copy-core.js",
        "siteНАВИЧКАdata",
    )
    hits = [token for token in forbidden_html if token in source]
    if hits:
        raise RuntimeError("Forbidden HTML references remain: " + ", ".join(hits))

    required = (
        "/assets/flowers/pink-orchid-layer.webp",
        "/assets/flowers/white-magnolia-layer.webp",
        "/assets/hero-wordmark.svg",
        "/hero-florist",
        "ГРОШІ НА КВІТАХ",
        "Флорист від нуля до результату",
        "Флористичний бізнес від А до Я",
        "2999 €",
    )
    missing = [token for token in required if token not in source]
    if missing:
        raise RuntimeError("Required site content missing: " + ", ".join(missing))


def main() -> None:
    custom = build_custom_html()
    localized, mirrored = mirror_runtime(custom)
    verify(localized)

    # Publish atomically only after the complete build passes.
    OUTPUT_HTML.write_text(localized, encoding="utf-8")
    if VENDOR_FINAL.exists():
        shutil.rmtree(VENDOR_FINAL)
    VENDOR_BUILD.rename(VENDOR_FINAL)

    REPORT.write_text(
        "\n".join(
            [
                "CLEAN FULLY SELF-HOSTED REBUILD",
                f"safe copy replacements: {len(load_copy())}",
                f"mirrored runtime files: {len(mirrored)}",
                "client floral mutation scripts: 0",
                "danmall runtime dependency: 0",
                "framerusercontent runtime dependency: 0",
                "font CDN runtime dependency: 0",
                "hero wordmark: local SVG",
                "moving flower layers: local WebP",
                "",
                *mirrored,
            ]
        ) + "\n",
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
