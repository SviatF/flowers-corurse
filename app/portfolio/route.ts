import type { NextRequest } from "next/server";

export function GET(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = "/";
  url.hash = "programs";
  return Response.redirect(url, 308);
}
