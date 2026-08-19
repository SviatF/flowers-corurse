import { readFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const filePath = path.join(
      process.cwd(),
      "public",
      "assets",
      "florist-hero.webp",
    );

    // The asset was previously committed as Base64 text instead of raw binary.
    // Decode it here and serve the real WebP bytes to the browser.
    const encoded = (await readFile(filePath, "utf8")).trim();
    const image = Buffer.from(encoded, "base64");

    return new Response(image, {
      status: 200,
      headers: {
        "content-type": "image/webp",
        "cache-control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Unable to serve florist hero", error);
    return new Response("Hero image unavailable", { status: 500 });
  }
}
