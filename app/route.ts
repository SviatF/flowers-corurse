import type { NextRequest } from "next/server";

const SOURCE_URL = "https://danmall.com/?ref=lapaninja";
const SOURCE_ORIGIN = "https://danmall.com/";
const DAN_HERO_ASSET_PATTERN =
  /https:\/\/framerusercontent\.com\/images\/hIvMq00Eiq5eJzxlzt69EooL6Cg\.jpg(?:\?[^\s\"'<>)]*)?/gi;

function injectBase(html: string) {
  if (html.includes("<base ")) return html;
  return html.replace(/<head([^>]*)>/i, `<head$1><base href="${SOURCE_ORIGIN}">`);
}

function injectHeroOverrideCss(html: string, origin: string) {
  const css = `<style id="floral-hero-hard-override">
[data-framer-background-image-wrapper="true"]:has(> img[alt="Dan Mall"][width="2000"][height="1333"]) {
  background-image: url("${origin}/hero-florist") !important;
  background-size: cover !important;
  background-position: center center !important;
  background-repeat: no-repeat !important;
}
[data-framer-background-image-wrapper="true"] > img[alt="Dan Mall"][width="2000"][height="1333"] {
  opacity: 0 !important;
  visibility: hidden !important;
}
</style>`;

  return html.replace(/<head([^>]*)>/i, `<head$1>${css}`);
}

export async function GET(request: NextRequest) {
  const upstream = await fetch(SOURCE_URL, {
    cache: "no-store",
    headers: {
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150 Safari/537.36",
      accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    },
  });

  if (!upstream.ok) {
    return new Response(
      `<!doctype html><html><body style="font-family:system-ui;padding:32px"><h1>Reference snapshot unavailable</h1><p>Dan Mall returned ${upstream.status}.</p></body></html>`,
      { status: 502, headers: { "content-type": "text/html; charset=utf-8" } },
    );
  }

  const origin = request.nextUrl.origin;
  let html = injectBase(await upstream.text());
  html = injectHeroOverrideCss(html, origin);

  const transparentPixel =
    "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
  html = html.replace(DAN_HERO_ASSET_PATTERN, transparentPixel);

  const runtime = [
    `<script src="${origin}/floral-image-overrides.js"></script>`,
    `<script src="${origin}/floral-copy-core.js"></script>`,
    `<script src="${origin}/floral-copy-results.js"></script>`,
    `<script src="${origin}/floral-copy-footer.js"></script>`,
  ].join("");

  html = html.includes("</body>")
    ? html.replace("</body>", `${runtime}</body>`)
    : `${html}${runtime}`;

  html = html.replace(
    /<title>.*?<\/title>/i,
    "<title>Floral Education — професія, стиль і квітковий бізнес</title>",
  );

  return new Response(html, {
    status: 200,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store, max-age=0",
      "x-reference-source": "danmall.com",
      "x-project-copy": "floral-runtime-v10-decoded-hero",
    },
  });
}
