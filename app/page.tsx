import fs from "node:fs";
import path from "node:path";
import "./site.css";

export const dynamic = "force-dynamic";

export default function Page() {
  const siteHtml = fs.readFileSync(path.join(process.cwd(), "src", "site.html"), "utf8");
  return <div id="site-host" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: siteHtml }} />;
}
