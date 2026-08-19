(() => {
  const STYLE_ID = "floral-hero-wordmark-style";

  const compact = (value) =>
    (value || "")
      .toLowerCase()
      .replace(/\u00a0/g, " ")
      .replace(/[^a-z]/g, "");

  const isVisible = (element) => {
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return (
      style.display !== "none" &&
      style.visibility !== "hidden" &&
      Number(style.opacity || 1) > 0.01 &&
      rect.width > 0 &&
      rect.height > 0
    );
  };

  const isSafeTextElement = (element) => {
    if (!(element instanceof HTMLElement)) return false;
    if (["SCRIPT", "STYLE", "NOSCRIPT", "IMG", "SVG", "CANVAS", "VIDEO", "PICTURE"].includes(element.tagName)) {
      return false;
    }
    if (element.closest("#floral-safe-hero-title")) return false;
    if (element.querySelector("img,svg,canvas,video,picture")) return false;
    return true;
  };

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      [data-floral-hero-word] {
        position: relative !important;
        color: transparent !important;
        -webkit-text-fill-color: transparent !important;
        text-shadow: none !important;
      }
      [data-floral-hero-word] *:not(.floral-hero-replacement) {
        color: transparent !important;
        -webkit-text-fill-color: transparent !important;
        text-shadow: none !important;
      }
      [data-floral-hero-word] > .floral-hero-replacement {
        position: absolute !important;
        left: 50% !important;
        top: 50% !important;
        transform: translate(-50%, -50%) !important;
        margin: 0 !important;
        padding: 0 !important;
        white-space: nowrap !important;
        color: #fff !important;
        -webkit-text-fill-color: #fff !important;
        text-shadow: none !important;
        pointer-events: none !important;
        z-index: 2 !important;
      }
    `;
    document.head.appendChild(style);
  }

  function findWordElement(word) {
    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;
    const candidates = [];

    document.querySelectorAll("body *").forEach((element) => {
      if (!isSafeTextElement(element) || !isVisible(element)) return;
      if (compact(element.innerText || element.textContent) !== word) return;

      const rect = element.getBoundingClientRect();
      if (rect.top > viewportH * 0.78 || rect.bottom < 0) return;
      if (rect.width < viewportW * 0.12 || rect.height < viewportH * 0.07) return;

      const ownFont = parseFloat(getComputedStyle(element).fontSize || "0");
      let largestFont = ownFont;
      element.querySelectorAll("*").forEach((child) => {
        if (!(child instanceof HTMLElement)) return;
        const size = parseFloat(getComputedStyle(child).fontSize || "0");
        if (size > largestFont) largestFont = size;
      });

      if (largestFont < 48 && rect.height < 90) return;

      candidates.push({
        element,
        rect,
        area: rect.width * rect.height,
        largestFont,
      });
    });

    candidates.sort((a, b) => {
      if (Math.abs(a.largestFont - b.largestFont) > 4) {
        return b.largestFont - a.largestFont;
      }
      return a.area - b.area;
    });

    return candidates[0] || null;
  }

  function representativeStyle(element) {
    let best = element;
    let bestSize = parseFloat(getComputedStyle(element).fontSize || "0");

    element.querySelectorAll("*").forEach((child) => {
      if (!(child instanceof HTMLElement)) return;
      const text = (child.innerText || child.textContent || "").trim();
      if (!text) return;
      const size = parseFloat(getComputedStyle(child).fontSize || "0");
      if (size > bestSize) {
        best = child;
        bestSize = size;
      }
    });

    return getComputedStyle(best);
  }

  function installReplacement(candidate, label, text) {
    const element = candidate.element;
    element.setAttribute("data-floral-hero-word", label);

    let replacement = element.querySelector(":scope > .floral-hero-replacement");
    if (!(replacement instanceof HTMLSpanElement)) {
      replacement = document.createElement("span");
      replacement.className = "floral-hero-replacement";
      replacement.setAttribute("aria-hidden", "true");
      element.appendChild(replacement);
    }

    replacement.textContent = text;

    const source = representativeStyle(element);
    Object.assign(replacement.style, {
      fontFamily: source.fontFamily,
      fontStyle: source.fontStyle,
      fontWeight: source.fontWeight,
      lineHeight: source.lineHeight === "normal" ? "0.82" : source.lineHeight,
      letterSpacing: source.letterSpacing,
      textTransform: source.textTransform,
    });

    return replacement;
  }

  function fitReplacement(replacement, rect, sourceSize) {
    let low = 24;
    let high = Math.max(sourceSize || 0, rect.height * 1.25, 80);

    for (let i = 0; i < 14; i += 1) {
      const mid = (low + high) / 2;
      replacement.style.fontSize = `${mid}px`;
      const box = replacement.getBoundingClientRect();

      if (box.width <= rect.width * 0.97 && box.height <= rect.height * 1.04) {
        low = mid;
      } else {
        high = mid;
      }
    }

    replacement.style.fontSize = `${low}px`;
  }

  let applying = false;

  function apply() {
    if (applying) return;
    applying = true;

    try {
      ensureStyle();

      const dan = findWordElement("dan");
      const mall = findWordElement("mall");
      if (!dan || !mall || dan.element === mall.element) return;

      const danReplacement = installReplacement(dan, "dan", "ГРОШІ");
      const mallReplacement = installReplacement(mall, "mall", "НА КВІТАХ");

      fitReplacement(danReplacement, dan.element.getBoundingClientRect(), dan.largestFont);
      fitReplacement(mallReplacement, mall.element.getBoundingClientRect(), mall.largestFont);
    } finally {
      applying = false;
    }
  }

  const schedule = () => requestAnimationFrame(apply);

  apply();
  document.addEventListener("DOMContentLoaded", apply);
  window.addEventListener("load", apply);
  window.addEventListener("resize", schedule);

  new MutationObserver(schedule).observe(document.documentElement, {
    subtree: true,
    childList: true,
    characterData: true,
  });

  [0, 50, 100, 200, 400, 700, 1000, 1500, 2500, 4000, 7000].forEach((delay) =>
    setTimeout(apply, delay),
  );
})();
