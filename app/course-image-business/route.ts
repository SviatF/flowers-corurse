import part1 from "./part1";
import part2 from "./part2";
import part3 from "./part3";

export const dynamic = "force-static";

export function GET() {
  const bytes = Buffer.from(`${part1}${part2}${part3}`, "base64");
  return new Response(bytes, {
    headers: {
      "Content-Type": "image/webp",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
