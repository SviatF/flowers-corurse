import { readFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const assetsDir = path.join(process.cwd(), "public", "assets");
    const parts = await Promise.all(
      [1, 2, 3, 4, 5, 6, 7].map((n) =>
        readFile(
          path.join(assetsDir, `hero-live.b64.${String(n).padStart(2, "0")}`),
          "utf8",
        ),
      ),
    );

    const base64 = parts.join("").replace(/\s+/g, "");
    const image = Buffer.from(base64, "base64");

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
