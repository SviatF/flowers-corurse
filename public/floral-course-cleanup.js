(() => {
  const norm = (value) =>
    (value || "")
      .replace(/\u00a0/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  const textOf = (element) => norm(element?.textContent || "").toLowerCase();

  const findByText = (needle) => {
    const wanted = needle.toLowerCase();
    return [...document.querySelectorAll("a, h1, h2, h3, p, div")].find((el) =>
      textOf(el).includes(wanted),
    );
  };

  const ensureTarget = (id, needle) => {
    let target = document.getElementById(id);
    if (target) return target;

    const hit = findByText(needle);
    if (!hit) return null;

    target = hit.closest("section, article, a, div") || hit;
    target.id = id;
    if (target instanceof HTMLElement) target.style.scrollMarginTop = "32px";
    return target;
  };

  const resolveDestination = (anchor) => {
    const text = textOf(anchor);
    const raw = anchor.getAttribute("href") || "";

    if (
      text === "програми" ||
      text.includes("обрати програму") ||
      text.includes("обрати свій формат") ||
      text.includes("флорист від нуля") ||
      /\/portfolio\/?(?:$|[?#])/i.test(raw)
    ) {
      return "#programs";
    }

    if (text === "навчання" || text.includes("що ти отримаєш") || /\/learn\/?(?:$|[?#])/i.test(raw)) {
      return "#learning";
    }

    if (text.includes("vip") || text.includes("дізнатись про vip")) {
      return "#vip";
    }

    let url;
    try {
      url = new URL(raw, document.baseURI);
    } catch {
      return null;
    }

    const host = url.hostname.replace(/^www\./, "");
    const legacyHosts = new Set([
      "danmall.com",
      "v3.danmall.com",
      "v4.danmall.com",
      "v5.danmall.com",
      "amzn.to",
      "makemoremoney.design",
      "pricingdesignbook.com",
      "rajputrajesh-448.gumroad.com",
      "twitter.com",
      "x.com",
      "instagram.com",
      "linkedin.com",
      "youtube.com",
    ]);

    if (legacyHosts.has(host)) return "#programs";
    return null;
  };

  const apply = () => {
    ensureTarget("programs", "флорист від нуля до результату");
    ensureTarget("learning", "що ти отримаєш");
    ensureTarget("vip", "vip наставництво");

    document.querySelectorAll("a").forEach((anchor) => {
      if (!(anchor instanceof HTMLAnchorElement)) return;
      const destination = resolveDestination(anchor);
      if (!destination) return;

      anchor.setAttribute("href", destination);
      anchor.removeAttribute("target");
      anchor.removeAttribute("rel");
      anchor.setAttribute("data-floral-internal", "true");
    });

    document.querySelectorAll("form").forEach((form) => {
      form.setAttribute("data-floral-course-form", "true");
    });
  };

  document.addEventListener(
    "click",
    (event) => {
      const source = event.target;
      if (!(source instanceof Element)) return;
      const anchor = source.closest("a");
      if (!(anchor instanceof HTMLAnchorElement)) return;

      const destination = resolveDestination(anchor);
      if (!destination) return;

      const target = document.querySelector(destination);
      if (!target) return;

      event.preventDefault();
      event.stopPropagation();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", destination);
    },
    true,
  );

  document.addEventListener(
    "submit",
    (event) => {
      const form = event.target;
      if (!(form instanceof HTMLFormElement)) return;
      if (!form.matches('[data-floral-course-form="true"]')) return;

      const target = document.getElementById("programs");
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", "#programs");
    },
    true,
  );

  apply();
  document.addEventListener("DOMContentLoaded", apply);
  window.addEventListener("load", apply);

  new MutationObserver(() => requestAnimationFrame(apply)).observe(document.documentElement, {
    subtree: true,
    childList: true,
    characterData: true,
  });

  [100, 300, 700, 1400, 2600, 5000].forEach((delay) => setTimeout(apply, delay));
})();
