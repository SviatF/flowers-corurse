import hq1 from "./hq1";
import hq2 from "./hq2";
import hq3 from "./hq3";
import hq4 from "./hq4";

export const dynamic = "force-static";

export function GET() {
  const bytes = Buffer.from(`${hq1}${hq2}${hq3}${hq4}`, "base64");
  return new Response(bytes, {
    headers: {
      "Content-Type": "image/avif",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
