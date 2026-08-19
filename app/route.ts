import { readFile } from "node:fs/promises";
import path from "node:path";

const SITE_HTML = path.join(
  process.cwd(),
  "public",
  "snapshot",
  "reference.html",
);

export async function GET() {
  try {
    const html = await readFile(SITE_HTML, "utf8");
    return new Response(html, {
      status: 200,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "no-store, max-age=0",
        "x-site-source": "local-static-html",
      },
    });
  } catch (error) {
    console.error("Unable to serve local site HTML", error);
    return new Response("Local site unavailable", { status: 500 });
  }
}
