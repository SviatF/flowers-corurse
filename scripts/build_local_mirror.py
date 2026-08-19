from __future__ import annotations

import base64
import hashlib
import html as html_lib
import json
import mimetypes
import re
import shutil
from collections import deque
from pathlib import Path
from urllib.parse import urljoin, urlsplit, urlunsplit
from urllib.request import Request, urlopen

from bs4 import BeautifulSoup

ROOT = Path.cwd()
SOURCE = ROOT / "public" / "snapshot" / "reference.html"
OUT = ROOT / "public" / "local-site"
VENDOR = OUT / "vendor"
ASSETS = OUT / "assets"

MIRROR_HOSTS = {
    "framerusercontent.com",
    "fonts.gstatic.com",
    "rsms.me",
    "www.hvdfonts.com",
    "www.reset-type.com",
    "www.emyselfdesign.com",
    "emyselfdesign.com",
}

TEXT_EXTS = {".css", ".js", ".mjs", ".json", ".svg", ".html", ".txt", ".xml"}
ABS_URL_RE = re.compile(r"https?://[^\s\"'<>\\)]+")
REF_PATTERNS = [
    re.compile(r"url\(\s*(['\"]?)([^)'\"]+)\1\s*\)", re.I),
    re.compile(r"(?:from\s*|import\s*\()(['\"])([^'\"]+)\1", re.I),
    re.compile(r"new\s+URL\(\s*(['\"])([^'\"]+)\1\s*,\s*import\.meta\.url\s*\)", re.I),
]


def norm_url(url: str) -> str:
    url = html_lib.unescape(url.strip()).rstrip(".,;")
    parts = urlsplit(url)
    return urlunsplit((parts.scheme, parts.netloc, parts.path, parts.query, ""))


def is_mirror_url(url: str) -> bool:
    try:
        return urlsplit(url).netloc.lower() in MIRROR_HOSTS
    except Exception:
        return False


def local_parts(url: str) -> tuple[Path, str]:
    parts = urlsplit(url)
    host = parts.netloc.lower()
    remote_path = parts.path or "/index"
    if remote_path.endswith("/"):
        remote_path += "index"
    path = Path(remote_path.lstrip("/"))
    if parts.query:
        q = hashlib.sha1(parts.query.encode()).hexdigest()[:10]
        if path.suffix:
            path = path.with_name(f"{path.stem}__q_{q}{path.suffix}")
        else:
            path = path.with_name(f"{path.name}__q_{q}")
    fs_path = VENDOR / host / path
    public_url = "/local-site/vendor/" + "/".join((host, *path.parts))
    return fs_path, public_url


def fetch(url: str) -> tuple[bytes, str]:
    req = Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/150 Safari/537.36",
            "Accept": "*/*",
        },
    )
    with urlopen(req, timeout=45) as response:
        return response.read(), response.headers.get("content-type", "")


def is_text_asset(path: Path, content_type: str, data: bytes) -> bool:
    if path.suffix.lower() in TEXT_EXTS:
        return True
    if any(x in content_type.lower() for x in ("text/", "javascript", "json", "svg", "xml")):
        return True
    return False


def discover_refs(text: str, base_url: str) -> dict[str, str]:
    found: dict[str, str] = {}
    for raw in ABS_URL_RE.findall(text):
        cleaned = norm_url(raw)
        if is_mirror_url(cleaned):
            found[raw] = cleaned
    for pattern in REF_PATTERNS:
        for match in pattern.finditer(text):
            raw = match.group(2)
            if raw.startswith(("data:", "blob:", "#", "mailto:", "tel:")):
                continue
            resolved = norm_url(urljoin(base_url, raw))
            if is_mirror_url(resolved):
                found[raw] = resolved
    return found


def load_copy_maps() -> dict[str, str]:
    merged: dict[str, str] = {}
    for name in ("floral-copy-core.js", "floral-copy-results.js", "floral-copy-footer.js"):
        path = ROOT / "public" / name
        if not path.exists():
            continue
        src = path.read_text(encoding="utf-8")
        match = re.search(r"const\s+map\s*=\s*(\{.*?\});\s*window\.__FLORAL_COPY__", src, re.S)
        if not match:
            raise RuntimeError(f"Could not parse copy map from {name}")
        merged.update(json.loads(match.group(1)))
    return merged


def replace_copy_everywhere(source: str, mapping: dict[str, str]) -> str:
    for old, new in sorted(mapping.items(), key=lambda kv: len(kv[0]), reverse=True):
        source = source.replace(old, new)
        old_escaped = html_lib.escape(old, quote=False)
        new_escaped = html_lib.escape(new, quote=False)
        source = source.replace(old_escaped, new_escaped)
        old_json = json.dumps(old, ensure_ascii=False)[1:-1]
        new_json = json.dumps(new, ensure_ascii=False)[1:-1]
        source = source.replace(old_json, new_json)
    return source


def build_hero_asset() -> None:
    ASSETS.mkdir(parents=True, exist_ok=True)
    chunks = []
    for i in range(1, 8):
        p = ROOT / "public" / "assets" / f"hero-live.b64.{i:02d}"
        chunks.append(p.read_text(encoding="utf-8"))
    payload = re.sub(r"\s+", "", "".join(chunks))
    (ASSETS / "hero-florist.webp").write_bytes(base64.b64decode(payload))


def customize_html(source: str) -> tuple[str, list[str]]:
    source = replace_copy_everywhere(source, load_copy_maps())
    soup = BeautifulSoup(source, "html.parser")
    report: list[str] = []

    # Remove publisher/editor/analytics scripts that are not needed for the visual runtime.
    for script in list(soup.find_all("script")):
        blob = (script.get("src") or "") + " " + script.get_text(" ", strip=True)
        if any(token in blob for token in ("t.rightmessage.com", "googletagmanager.com", "__framer_force_showing_editorbar_since")):
            script.decompose()

    for base in soup.find_all("base"):
        base.decompose()

    title = soup.find("title")
    if title:
        title.string = "ГРОШІ НА КВІТАХ — курси флористики та квіткового бізнесу"

    meta_desc = soup.find("meta", attrs={"name": "description"})
    if meta_desc:
        meta_desc["content"] = "Курси флористики: професійна база, запуск квіткового бізнесу та VIP-наставництво від концепції до перших клієнтів."

    # Direct hero image replacement inside local HTML. No runtime JS override.
    hero_count = 0
    for img in soup.find_all("img"):
        src = img.get("src", "")
        if (
            "hIvMq00Eiq5eJzxlzt69EooL6Cg" in src
            or (img.get("width") == "2000" and img.get("height") == "1333")
        ):
            img["src"] = "/local-site/assets/hero-florist.webp"
            img.pop("srcset", None)
            img.pop("sizes", None)
            img["alt"] = "Квіти — ГРОШІ НА КВІТАХ"
            hero_count += 1
    report.append(f"hero images replaced: {hero_count}")

    # Direct program navigation inside local HTML.
    program_target = None
    for tag in soup.find_all(["a", "div", "section", "article"]):
        text = " ".join(tag.stripped_strings)
        if "Флорист від нуля до результату" in text:
            program_target = tag
            break
    if program_target:
        program_target["id"] = "programs"
        report.append(f"program target: <{program_target.name}>")
    else:
        report.append("program target: NOT FOUND")

    for a in soup.find_all("a"):
        txt = " ".join(a.stripped_strings).strip().lower()
        href = a.get("href", "")
        if txt in {"програми", "portfolio"} or re.search(r"/portfolio/?(?:$|[?#])", href, re.I):
            a["href"] = "#programs"
            a.attrs.pop("target", None)
            a.attrs.pop("rel", None)

    # Find the actual text containers for the large hero wordmark and replace their text directly.
    def compact(text: str) -> str:
        return re.sub(r"[^a-z]", "", text.lower())

    body = soup.body
    hero_candidates: dict[str, list] = {"dan": [], "mall": []}
    if body:
        for tag in body.find_all(True):
            if tag.name in {"script", "style", "svg", "img", "picture", "canvas", "video"}:
                continue
            own_text = "".join(tag.stripped_strings)
            c = compact(own_text)
            if c in hero_candidates:
                # Prefer the smallest DOM container carrying exactly the word.
                child_same = any(
                    compact("".join(child.stripped_strings)) == c
                    for child in tag.find_all(True, recursive=False)
                    if child.name not in {"svg", "img", "picture"}
                )
                if not child_same:
                    hero_candidates[c].append(tag)

    replacements = {"dan": "ГРОШІ", "mall": "НА КВІТАХ"}
    for key, replacement in replacements.items():
        candidates = hero_candidates[key]
        report.append(f"hero text candidates {key}: {len(candidates)}")
        for idx, candidate in enumerate(candidates[:8]):
            report.append(f"  {key}[{idx}] {str(candidate)[:700]}")
        if candidates:
            target = candidates[0]
            # Preserve the existing element and attributes/classes; only replace textual children.
            for child in list(target.contents):
                child.extract()
            target.append(replacement)
            target["data-local-hero-title"] = key
            report.append(f"hero title {key} replaced directly")
        else:
            report.append(f"hero title {key}: NOT FOUND")

    # Make old Dan Mall destination links local/non-destructive.
    for a in soup.find_all("a"):
        href = a.get("href", "")
        if "danmall.com" in href:
            a["href"] = "#programs"
            a.attrs.pop("target", None)
            a.attrs.pop("rel", None)

    return str(soup), report


def mirror_resources(html_text: str) -> tuple[str, list[str]]:
    queue: deque[str] = deque()
    queued: set[str] = set()
    mapping: dict[str, str] = {}
    asset_text: dict[str, tuple[str, dict[str, str], str]] = {}
    report: list[str] = []

    initial_refs = discover_refs(html_text, "https://danmall.com/")
    for resolved in initial_refs.values():
        if resolved not in queued:
            queued.add(resolved)
            queue.append(resolved)

    while queue:
        url = queue.popleft()
        fs_path, public_url = local_parts(url)
        mapping[url] = public_url
        try:
            data, content_type = fetch(url)
        except Exception as exc:
            report.append(f"FAILED {url}: {exc}")
            continue

        fs_path.parent.mkdir(parents=True, exist_ok=True)
        fs_path.write_bytes(data)

        if is_text_asset(fs_path, content_type, data):
            try:
                text = data.decode("utf-8")
            except UnicodeDecodeError:
                continue
            refs = discover_refs(text, url)
            asset_text[url] = (text, refs, content_type)
            for resolved in refs.values():
                if resolved not in queued:
                    queued.add(resolved)
                    queue.append(resolved)

    # Rewrite text resources to local URLs. Relative refs are rewritten too, so root-relative module imports stay local.
    for url, (text, refs, content_type) in asset_text.items():
        rewritten = text
        for raw, resolved in sorted(refs.items(), key=lambda kv: len(kv[0]), reverse=True):
            if resolved in mapping:
                rewritten = rewritten.replace(raw, mapping[resolved])
        fs_path, _ = local_parts(url)
        fs_path.write_text(rewritten, encoding="utf-8")

    # Rewrite absolute resource references in HTML.
    rewritten_html = html_text
    all_html_refs = discover_refs(rewritten_html, "https://danmall.com/")
    for raw, resolved in sorted(all_html_refs.items(), key=lambda kv: len(kv[0]), reverse=True):
        if resolved in mapping:
            rewritten_html = rewritten_html.replace(raw, mapping[resolved])

    report.append(f"mirrored resources: {len(mapping)}")
    report.append(f"failed resources: {sum(1 for line in report if line.startswith('FAILED '))}")
    return rewritten_html, report


def assert_no_runtime_dependencies(html_text: str) -> list[str]:
    offenders = []
    for url in ABS_URL_RE.findall(html_text):
        host = urlsplit(norm_url(url)).netloc.lower()
        if host in MIRROR_HOSTS or host in {"danmall.com", "www.danmall.com", "framer.com", "events.framer.com", "t.rightmessage.com", "www.googletagmanager.com"}:
            offenders.append(url)
    return sorted(set(offenders))


def main() -> None:
    if OUT.exists():
        shutil.rmtree(OUT)
    OUT.mkdir(parents=True, exist_ok=True)
    build_hero_asset()

    source = SOURCE.read_text(encoding="utf-8")
    customized, custom_report = customize_html(source)
    mirrored, mirror_report = mirror_resources(customized)

    offenders = assert_no_runtime_dependencies(mirrored)
    (OUT / "index.html").write_text(mirrored, encoding="utf-8")

    report = custom_report + mirror_report
    report.append(f"runtime external dependencies remaining: {len(offenders)}")
    report.extend(f"  EXTERNAL {url}" for url in offenders)
    (OUT / "BUILD_REPORT.txt").write_text("\n".join(report) + "\n", encoding="utf-8")

    if offenders:
        raise SystemExit("Local mirror still contains runtime dependency URLs; see BUILD_REPORT.txt")


if __name__ == "__main__":
    main()
