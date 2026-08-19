(() => {
  const WORDS = [
    { source: "dan", replacement: "ГРОШІ", marker: "money" },
    { source: "mall", replacement: "НА КВІТАХ", marker: "flowers" },
  ];

  const norm = (value) =>
    (value || "")
      .replace(/\u00a0/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  const compact = (value) => norm(value).replace(/\s+/g, "").toLowerCase();

  const isHeroRect = (rect) => {
    if (!rect || rect.width < Math.max(180, window.innerWidth * 0.18)) return false;
    if (rect.height < 70) return false;
    if (rect.bottom < -20 || rect.top > window.innerHeight * 1.15) return false;
    const centerX = rect.left + rect.width / 2;
    return Math.abs(centerX - window.innerWidth / 2) < window.innerWidth * 0.36;
  };

  function replaceLargeTextElement(word) {
    const matches = [];

    document.querySelectorAll("body *").forEach((element) => {
      if (["SCRIPT", "STYLE", "NOSCRIPT"].includes(element.tagName)) return;
      if (compact(element.textContent) !== word.source) return;

      const rect = element.getBoundingClientRect();
      if (!isHeroRect(rect)) return;

      const style = getComputedStyle(element);
      const fontSize = parseFloat(style.fontSize) || 0;
      matches.push({ element, rect, fontSize });
    });

    // Prefer the smallest exact wrapper around the visible hero word.
    matches.sort((a, b) => {
      const areaA = a.rect.width * a.rect.height;
      const areaB = b.rect.width * b.rect.height;
      return areaA - areaB || b.fontSize - a.fontSize;
    });

    const match = matches[0];
    if (!match) return false;

    const { element } = match;
    if (element.getAttribute("data-floral-hero-word") === word.marker) return true;

    element.textContent = word.replacement;
    element.setAttribute("data-floral-hero-word", word.marker);
    element.setAttribute("aria-label", word.replacement);
    return true;
  }

  function buildSvgWord(svg, label) {
    const viewBox = svg.viewBox && svg.viewBox.baseVal;
    const width = viewBox && viewBox.width ? viewBox.width : 1200;
    const height = viewBox && viewBox.height ? viewBox.height : 420;
    const x = viewBox && Number.isFinite(viewBox.x) ? viewBox.x : 0;
    const y = viewBox && Number.isFinite(viewBox.y) ? viewBox.y : 0;
    const fontSize = height * 0.9;

    svg.innerHTML = "";
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", String(x + width / 2));
    text.setAttribute("y", String(y + height / 2));
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("dominant-baseline", "central");
    text.setAttribute("fill", "#ffffff");
    text.setAttribute("font-family", 'Arial Black, Arial, Inter, sans-serif');
    text.setAttribute("font-weight", "900");
    text.setAttribute("font-size", String(fontSize));
    text.setAttribute("letter-spacing", "-0.055em");
    text.setAttribute("lengthAdjust", "spacingAndGlyphs");
    text.setAttribute("textLength", String(width * 0.94));
    text.textContent = label;
    svg.appendChild(text);
  }

  function replaceSvgWordmarks() {
    const candidates = [...document.querySelectorAll("svg")]
      .map((svg) => ({ svg, rect: svg.getBoundingClientRect() }))
      .filter(({ svg, rect }) => {
        if (!isHeroRect(rect)) return false;
        if (rect.width / Math.max(rect.height, 1) < 1.15) return false;
        if (svg.querySelector("image, foreignObject")) return false;
        return svg.querySelectorAll("path, polygon, polyline, rect").length > 0;
      })
      .sort((a, b) => a.rect.top - b.rect.top || b.rect.width - a.rect.width);

    const chosen = [];
    for (const candidate of candidates) {
      if (
        chosen.every(
          (item) =>
            Math.abs(
              item.rect.top + item.rect.height / 2 -
                (candidate.rect.top + candidate.rect.height / 2),
            ) > 80,
        )
      ) {
        chosen.push(candidate);
      }
      if (chosen.length === 2) break;
    }

    chosen.sort((a, b) => a.rect.top - b.rect.top);
    chosen.forEach((candidate, index) => {
      const word = WORDS[index];
      if (!word) return;
      if (candidate.svg.getAttribute("data-floral-hero-word") === word.marker) return;
      buildSvgWord(candidate.svg, word.replacement);
      candidate.svg.setAttribute("data-floral-hero-word", word.marker);
      candidate.svg.setAttribute("aria-label", word.replacement);
    });

    return chosen.length >= 2;
  }

  function svgDataUri(label) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 420"><text x="600" y="210" text-anchor="middle" dominant-baseline="central" fill="#fff" font-family="Arial Black,Arial,sans-serif" font-size="360" font-weight="900" letter-spacing="-18" lengthAdjust="spacingAndGlyphs" textLength="1120">${label}</text></svg>`;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }

  function replaceImageWordmarks() {
    const candidates = [...document.querySelectorAll("img")]
      .map((img) => ({ img, rect: img.getBoundingClientRect() }))
      .filter(({ img, rect }) => {
        if (!isHeroRect(rect)) return false;
        if (rect.width / Math.max(rect.height, 1) < 1.15) return false;
        const src = img.currentSrc || img.src || "";
        if (/hero-florist|hIvMq00Eiq5eJzxlzt69EooL6Cg|hero-current/i.test(src)) return false;
        return true;
      })
      .sort((a, b) => a.rect.top - b.rect.top || b.rect.width - a.rect.width)
      .slice(0, 2);

    if (candidates.length < 2) return false;

    candidates.forEach((candidate, index) => {
      const word = WORDS[index];
      candidate.img.removeAttribute("srcset");
      candidate.img.removeAttribute("sizes");
      candidate.img.src = svgDataUri(word.replacement);
      candidate.img.alt = word.replacement;
      candidate.img.setAttribute("data-floral-hero-word", word.marker);
      candidate.img.style.setProperty("object-fit", "contain", "important");
    });

    return true;
  }

  let applying = false;

  function applyHeroTitle() {
    if (applying) return;
    applying = true;

    try {
      const textResults = WORDS.map(replaceLargeTextElement);
      if (textResults.every(Boolean)) return;

      if (replaceSvgWordmarks()) return;
      replaceImageWordmarks();
    } finally {
      applying = false;
    }
  }

  const schedule = () => requestAnimationFrame(applyHeroTitle);

  applyHeroTitle();
  document.addEventListener("DOMContentLoaded", applyHeroTitle);
  window.addEventListener("load", applyHeroTitle);
  window.addEventListener("resize", schedule);

  new MutationObserver(schedule).observe(document.documentElement, {
    subtree: true,
    childList: true,
    characterData: true,
    attributes: true,
    attributeFilter: ["style", "class", "src", "srcset"],
  });

  [0, 25, 50, 100, 200, 400, 700, 1000, 1500, 2500, 4000, 6000].forEach(
    (delay) => setTimeout(applyHeroTitle, delay),
  );

  const timer = setInterval(applyHeroTitle, 400);
  setTimeout(() => clearInterval(timer), 12000);
})();
