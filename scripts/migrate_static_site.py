from pathlib import Path
from bs4 import BeautifulSoup
import html
import json
import re

ROOT = Path.cwd()
SNAPSHOT = ROOT / "public" / "snapshot" / "reference.html"


def load_map(name: str) -> dict[str, str]:
    src = (ROOT / "public" / name).read_text(encoding="utf-8")
    m = re.search(r"const\s+map\s*=\s*(\{.*?\});\s*window\.__FLORAL_COPY__", src, re.S)
    if not m:
        raise RuntimeError(f"Could not parse {name}")
    return json.loads(m.group(1))


source = SNAPSHOT.read_text(encoding="utf-8")
copy = {}
for name in ("floral-copy-core.js", "floral-copy-results.js", "floral-copy-footer.js"):
    copy.update(load_map(name))

# Bake all previous copy overrides directly into the stored HTML and Framer payload.
for old, new in sorted(copy.items(), key=lambda item: len(item[0]), reverse=True):
    source = source.replace(old, new)
    source = source.replace(html.escape(old, quote=False), html.escape(new, quote=False))
    source = source.replace(
        json.dumps(old, ensure_ascii=False)[1:-1],
        json.dumps(new, ensure_ascii=False)[1:-1],
    )

soup = BeautifulSoup(source, "html.parser")

# No runtime publisher/editor/analytics code from the reference site.
for script in list(soup.find_all("script")):
    blob = (script.get("src") or "") + " " + script.get_text(" ", strip=True)
    if any(
        token in blob
        for token in (
            "t.rightmessage.com",
            "googletagmanager.com",
            "__framer_force_showing_editorbar_since",
        )
    ):
        script.decompose()

for base in soup.find_all("base"):
    base.decompose()

# Metadata belongs to this project, not the reference domain.
if soup.title:
    soup.title.string = "ГРОШІ НА КВІТАХ — курси флористики та квіткового бізнесу"
for meta in soup.find_all("meta"):
    if meta.get("name") == "description":
        meta["content"] = "Курси флористики: професійна база, запуск квіткового бізнесу та VIP-наставництво."
    elif meta.get("property") == "og:title":
        meta["content"] = "ГРОШІ НА КВІТАХ — курси флористики"
    elif meta.get("property") == "og:description":
        meta["content"] = "Три програми: професія флориста, квітковий бізнес і VIP-наставництво."

for link in list(soup.find_all("link", rel="canonical")):
    link.decompose()
for meta in list(soup.find_all("meta", attrs={"property": "og:url"})):
    meta.decompose()

# The hero is edited directly. No MutationObserver, no DOM targeting, no overlay JS.
hero_backgrounds = 0
hero_wordmarks = 0
for img in soup.find_all("img"):
    src = img.get("src", "")
    if "hIvMq00Eiq5eJzxlzt69EooL6Cg" in src or (
        img.get("width") == "2000" and img.get("height") == "1333"
    ):
        img["src"] = "/hero-florist"
        img.attrs.pop("srcset", None)
        img.attrs.pop("sizes", None)
        img["alt"] = "Квіти"
        hero_backgrounds += 1
    elif "nT1RIIaymTzAI6UESI2yEzrKinU" in src:
        img["src"] = "/assets/hero-wordmark.svg"
        img.attrs.pop("srcset", None)
        img.attrs.pop("sizes", None)
        img["alt"] = "ГРОШІ НА КВІТАХ"
        hero_wordmarks += 1

for layer in soup.find_all(attrs={"data-framer-name": "Dan Mall"}):
    layer["data-framer-name"] = "ГРОШІ НА КВІТАХ"
for layer in soup.find_all(attrs={"data-framer-name": "Danmal Image"}):
    layer["data-framer-name"] = "Hero Floral Image"

# Programs navigation is stored in HTML rather than intercepted at runtime.
program_target = None
for node in soup.find_all(["a", "div", "section", "article"]):
    if "Флорист від нуля до результату" in " ".join(node.stripped_strings):
        program_target = node
        break
if program_target is not None:
    program_target["id"] = "programs"

for anchor in soup.find_all("a"):
    label = " ".join(anchor.stripped_strings).strip().lower()
    href = anchor.get("href", "")
    if (
        label in {"програми", "portfolio"}
        or re.search(r"/portfolio/?(?:$|[?#])", href, re.I)
        or "danmall.com" in href
    ):
        anchor["href"] = "#programs"
        anchor.attrs.pop("target", None)
        anchor.attrs.pop("rel", None)

# Replace the reference person's structured data.
for script in list(soup.find_all("script", attrs={"type": "application/ld+json"})):
    if "Dan Mall" in script.get_text():
        script.string = json.dumps(
            {
                "@context": "https://schema.org",
                "@type": "EducationalOrganization",
                "name": "Floral Education",
                "description": "Курси флористики та квіткового бізнесу",
            },
            ensure_ascii=False,
        )

result = str(soup)
if "floral-hero-title.js" in result or "floral-copy-core.js" in result:
    raise RuntimeError("Runtime override scripts unexpectedly present in stored HTML")
if "danmall.com" in result:
    raise RuntimeError("Reference domain still present after migration")
if hero_backgrounds < 1 or hero_wordmarks < 1:
    raise RuntimeError(
        f"Hero migration incomplete: background={hero_backgrounds}, wordmark={hero_wordmarks}"
    )
if program_target is None:
    raise RuntimeError("Programs target was not found")

SNAPSHOT.write_text(result, encoding="utf-8")
print(
    f"Static migration complete: background={hero_backgrounds}, "
    f"wordmark={hero_wordmarks}, copy={len(copy)}"
)
