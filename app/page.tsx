import fs from "node:fs";
import path from "node:path";
import "./site.css";
import "./hero.css";
import HeroParallax from "./HeroParallax";

export const dynamic = "force-dynamic";

const HERO_PATTERN = /<header\b(?=[^>]*data-framer-name="Hero Section")[^>]*>[\s\S]*?<\/header>/;

const LOCAL_HERO = String.raw`
<header class="pts-hero" data-framer-name="Hero Section" aria-label="Hero">
  <div class="pts-hero__stage">
    <img
      class="pts-hero__portrait"
      src="/site/images/95e2e4fcdce83e14.jpg"
      alt=""
      width="2000"
      height="1333"
      loading="eager"
      decoding="async"
      fetchpriority="high"
    />
    <div class="pts-hero__veil" aria-hidden="true"></div>
    <img
      class="pts-hero__pink"
      src="/site/images/25a19fcf83a07670.webp"
      alt=""
      aria-hidden="true"
      loading="eager"
      decoding="async"
    />
    <img
      class="pts-hero__magnolia"
      src="/site/images/3f61b04bf5f0c093.webp"
      alt=""
      aria-hidden="true"
      loading="eager"
      decoding="async"
    />
    <h1 class="pts-hero__title" aria-label="СТВОРЮЙ. РОСТИ. ЗАРОБЛЯЙ.">
      <span>СТВОРЮЙ.</span>
      <span>РОСТИ.</span>
      <span>ЗАРОБЛЯЙ.</span>
    </h1>
    <p class="pts-hero__subtitle">I help designers make more money<br />and get their flowers.</p>
  </div>
</header>`;

export default function Page() {
  const sourceHtml = fs.readFileSync(path.join(process.cwd(), "src", "site.html"), "utf8");
  const siteHtml = HERO_PATTERN.test(sourceHtml)
    ? sourceHtml.replace(HERO_PATTERN, LOCAL_HERO)
    : sourceHtml;

  return (
    <>
      <div
        id="site-host"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: siteHtml }}
      />
      <HeroParallax />
    </>
  );
}
