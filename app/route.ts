import type { NextRequest } from "next/server";

const SOURCE_URL = "https://danmall.com/?ref=lapaninja";
const SOURCE_ORIGIN = "https://danmall.com/";
const DAN_HERO_ASSET =
  "https://framerusercontent.com/images/hIvMq00Eiq5eJzxlzt69EooL6Cg.jpg";

function injectBase(html: string) {
  if (html.includes("<base ")) return html;
  return html.replace(/<head([^>]*)>/i, `<head$1><base href="${SOURCE_ORIGIN}">`);
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

  let html = injectBase(await upstream.text());
  const origin = request.nextUrl.origin;

  // Replace the Dan Mall hero portrait BEFORE the HTML reaches the browser.
  // Keeping any original query string is harmless; our local image route ignores it.
  html = html.replaceAll(DAN_HERO_ASSET, `${origin}/florist-hero`);

  const runtime = [
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
      "x-project-copy": "floral-runtime-v5",
    },
  });
}
