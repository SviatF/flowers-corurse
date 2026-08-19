import { readFile } from "node:fs/promises";
import path from "node:path";

export const dynamic = "force-dynamic";

export async function GET() {
  const assetsDir = path.join(process.cwd(), "public", "assets");
  const parts = await Promise.all([
    readFile(path.join(assetsDir, "florist-hero.b64.1"), "utf8"),
    readFile(path.join(assetsDir, "florist-hero.b64.2"), "utf8"),
    readFile(path.join(assetsDir, "florist-hero.b64.3"), "utf8"),
  ]);

  const base64 = parts.join("").replace(/\s+/g, "");
  const image = Buffer.from(base64, "base64");

  return new Response(image, {
    status: 200,
    headers: {
      "content-type": "image/webp",
      "cache-control": "public, max-age=31536000, immutable",
    },
  });
}
