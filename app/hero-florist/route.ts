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

    const encoded = (await readFile(filePath, "utf8")).trim();
    const image = Buffer.from(encoded, "base64");

    return new Response(image, {
      status: 200,
      headers: {
        "content-type": "image/webp",
        "cache-control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error("Unable to serve florist hero", error);
    return new Response("Hero image unavailable", { status: 500 });
  }
}
