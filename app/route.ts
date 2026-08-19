import { readFile } from "node:fs/promises";
import path from "node:path";
import type { NextRequest } from "next/server";

const SNAPSHOT_PATH = path.join(
  process.cwd(),
  "public",
  "snapshot",
  "reference.html",
);
const SOURCE_ORIGIN = "https://danmall.com/";
const DAN_HERO_ASSET_PATTERN =
  /https:\/\/framerusercontent\.com\/images\/hIvMq00Eiq5eJzxlzt69EooL6Cg\.jpg(?:\?[^\s\"'<>)]*)?/gi;

function injectBase(html: string) {
  if (html.includes("<base ")) return html;
  return html.replace(/<head([^>]*)>/i, `<head$1><base href="${SOURCE_ORIGIN}">`);
}

function injectHeroOverrideCss(html: string) {
  const css = `<style id="floral-hero-hard-override">
[data-framer-background-image-wrapper="true"] > img[width="2000"][height="1333"] {
  opacity: 1 !important;
  visibility: visible !important;
  display: block !important;
  width: 100% !important;
  height: 100% !important;
  object-fit: cover !important;
  object-position: center center !important;
}
</style>`;

  return html.replace(/<head([^>]*)>/i, `<head$1>${css}`);
}

function applyLocalMetadata(html: string, origin: string) {
  let next = html.replace(
    /<title>.*?<\/title>/i,
    "<title>Floral Education — професія, стиль і квітковий бізнес</title>",
  );

  next = next.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
    '<meta name="description" content="Курси флористики: професійна база, запуск квіткового бізнесу та VIP-наставництво від концепції до перших клієнтів.">',
  );

  next = next.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
    `<link rel="canonical" href="${origin}/">`,
  );

  next = next.replace(
    /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:url" content="${origin}/">`,
  );

  next = next.replace(
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i,
    '<meta property="og:title" content="Floral Education — професія, стиль і квітковий бізнес">',
  );

  next = next.replace(
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i,
    '<meta property="og:description" content="Три програми: флористика з нуля, запуск квіткового бізнесу та VIP-наставництво.">',
  );

  return next;
}

export async function GET(request: NextRequest) {
  let snapshot: string;

  try {
    snapshot = await readFile(SNAPSHOT_PATH, "utf8");
  } catch (error) {
    console.error("Unable to read local reference snapshot", error);
    return new Response(
      `<!doctype html><html><body style="font-family:system-ui;padding:32px"><h1>Local reference snapshot unavailable</h1></body></html>`,
      { status: 500, headers: { "content-type": "text/html; charset=utf-8" } },
    );
  }

  const origin = request.nextUrl.origin;
  const heroUrl = `${origin}/hero-florist?v=20260819-5`;
  let html = injectBase(snapshot);
  html = injectHeroOverrideCss(html);
  html = applyLocalMetadata(html, origin);

  html = html.replace(DAN_HERO_ASSET_PATTERN, heroUrl);

  const runtime = [
    `<script src="${origin}/floral-image-overrides.js?v=20260819-5"></script>`,
    `<script src="${origin}/floral-copy-core.js?v=20260819-5"></script>`,
    `<script src="${origin}/floral-copy-results.js?v=20260819-5"></script>`,
    `<script src="${origin}/floral-copy-footer.js?v=20260819-5"></script>`,
    `<script src="${origin}/floral-programs-nav.js?v=20260819-5"></script>`,
    `<script src="${origin}/floral-hero-title.js?v=20260819-7"></script>`,
    `<script src="${origin}/floral-course-cleanup.js?v=20260819-5"></script>`,
  ].join("");

  html = html.includes("</body>")
    ? html.replace("</body>", `${runtime}</body>`)
    : `${html}${runtime}`;

  return new Response(html, {
    status: 200,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store, max-age=0",
      "x-reference-source": "local-snapshot",
      "x-project-copy": "floral-runtime-v22-text-only-hero-title",
    },
  });
}
