(() => {
  const norm = (value) =>
    (value || "")
      .replace(/\u00a0/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  const legacyHosts = [
    "danmall.com",
    "makemoremoney.design",
    "pricingdesignbook.com",
    "amzn.to",
    "linkedin.com",
    "twitter.com",
    "x.com",
    "youtube.com",
    "instagram.com",
    "gumroad.com",
    "reset-type.com",
    "hvdfonts.com",
    "emyselfdesign.com",
    "rsms.me",
  ];

  const legacyPath = /\/(portfolio|learn|posts|topics)(\/|$)/i;
  let applying = false;

  function svgWordmark(label, dark = true) {
    const fill = dark ? "#111111" : "#f5efe5";
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 120"><rect width="420" height="120" fill="transparent"/><text x="210" y="64" text-anchor="middle" dominant-baseline="middle" fill="${fill}" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="700" letter-spacing="2">${label}</text></svg>`;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }

  function replaceImage(img, src, alt) {
    if (!(img instanceof HTMLImageElement)) return;
    img.removeAttribute("srcset");
    img.removeAttribute("sizes");
    if (img.getAttribute("src") !== src) img.setAttribute("src", src);
    if (img.getAttribute("alt") !== alt) img.setAttribute("alt", alt);
  }

  function replaceLegacyVisuals() {
    // Keep the original layout/animation wrappers, but remove Dan Mall imagery.
    document.querySelectorAll("img").forEach((img) => {
      const alt = norm(img.getAttribute("alt"));
      if (/^Dan Mall$/i.test(alt) || /^Dan mail$/i.test(alt)) {
        replaceImage(img, "/assets/florist-hero.webp", "Флористика — навчання та квітковий бізнес");
      }
    });

    // Preserve the animated logo strip, replacing unrelated company marks with course themes.
    const themes = ["КОМПОЗИЦІЯ", "КОЛІР", "ФОРМА", "СЕЗОННІСТЬ", "ЦІНА", "БРЕНД", "ПРОДАЖІ"];
    document.querySelectorAll('img[alt="Logo"]').forEach((img, index) => {
      const label = themes[index % themes.length];
      replaceImage(img, svgWordmark(label), label);
      img.style.setProperty("object-fit", "contain", "important");
    });
  }

  function findAnchorByText(fragment) {
    return [...document.querySelectorAll("a")].find((a) =>
      norm(a.textContent).toLowerCase().includes(fragment.toLowerCase()),
    );
  }

  function findElementByText(fragment) {
    const needle = fragment.toLowerCase();
    return [...document.querySelectorAll("h1,h2,h3,h4,p,span,div")].find((el) => {
      const text = norm(el.textContent);
      return text && text.length < 220 && text.toLowerCase().includes(needle);
    });
  }

  function setId(el, id) {
    if (!el) return;
    if (!document.getElementById(id)) el.id = id;
    el.style.scrollMarginTop = "32px";
  }

  function markCourseTargets() {
    const first = findAnchorByText("Флорист від нуля до результату");
    const business = findAnchorByText("Флористичний бізнес від А до Я");
    const vip = findAnchorByText("VIP-наставництво");

    setId(first, "program-1");
    setId(business, "program-2");
    setId(vip, "program-3");

    if (first && !document.getElementById("programs")) {
      const holder = first.parentElement || first;
      setId(holder, "programs");
    }

    setId(findElementByText("ЩО ТИ ОТРИМАЄШ"), "learning");
  }

  function intendedTarget(anchor) {
    const text = norm(anchor.textContent).toLowerCase();

    if (text.includes("флорист від нуля до результату")) return "#program-1";
    if (text.includes("флористичний бізнес від а до я")) return "#program-2";
    if (text.includes("vip-наставництво") || text.includes("дізнатись про vip")) return "#program-3";
    if (text === "навчання" || text.includes("що ти отримаєш")) return "#learning";
    if (text === "програми" || text.includes("обрати програму") || text.includes("обрати свій формат")) return "#programs";
    if (text.includes("навчання флористиці")) return "#program-1";
    if (text.includes("флористичний бізнес")) return "#program-2";
    if (text.includes("3 програми")) return "#programs";

    const rawHref = anchor.getAttribute("href") || "";
    if (!rawHref || rawHref.startsWith("#")) return null;

    let url;
    try {
      url = new URL(rawHref, document.baseURI);
    } catch {
      return null;
    }

    const host = url.hostname.replace(/^www\./, "").toLowerCase();
    const isLegacyHost = legacyHosts.some((legacy) => host === legacy || host.endsWith(`.${legacy}`));
    const isLegacyPath = legacyPath.test(url.pathname);

    return isLegacyHost || isLegacyPath ? "#programs" : null;
  }

  function sanitizeLinks() {
    document.querySelectorAll("a").forEach((anchor) => {
      // The old Portfolio slot becomes Programs so the navigation layout remains unchanged.
      if (norm(anchor.textContent) === "Portfolio") anchor.textContent = "Програми";

      const target = intendedTarget(anchor);
      if (!target) return;

      if (anchor.getAttribute("href") !== target) anchor.setAttribute("href", target);
      anchor.removeAttribute("target");
      anchor.removeAttribute("rel");
      anchor.removeAttribute("download");
    });
  }

  function replaceLegacySocialIcons() {
    const entries = [
      ["linkedin.com", "01"],
      ["twitter.com", "02"],
      ["x.com", "02"],
      ["youtube.com", "03"],
      ["instagram.com", "↗"],
    ];

    document.querySelectorAll("a").forEach((anchor) => {
      const href = anchor.getAttribute("href") || "";
      const match = entries.find(([host]) => href.includes(host));
      if (!match) return;
      anchor.querySelectorAll("img").forEach((img) => {
        replaceImage(img, svgWordmark(match[1], false), "Програма навчання");
        img.style.setProperty("object-fit", "contain", "important");
      });
    });
  }

  function apply() {
    if (applying) return;
    applying = true;
    try {
      markCourseTargets();
      replaceLegacySocialIcons();
      sanitizeLinks();
      replaceLegacyVisuals();
      document.documentElement.setAttribute("data-floral-course-clean", "true");
    } finally {
      applying = false;
    }
  }

  const schedule = () => requestAnimationFrame(apply);
  apply();
  document.addEventListener("DOMContentLoaded", apply, { once: true });
  window.addEventListener("load", apply, { once: true });

  new MutationObserver(schedule).observe(document.documentElement, {
    subtree: true,
    childList: true,
    characterData: true,
    attributes: true,
    attributeFilter: ["href", "src", "srcset", "alt"],
  });

  [50, 150, 350, 700, 1200, 2200, 4000].forEach((delay) => setTimeout(apply, delay));
})();
