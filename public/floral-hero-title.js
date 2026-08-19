(() => {
  const replacements = new Map([
    ["dan", "ГРОШІ"],
    ["mall", "НА КВІТАХ"],
  ]);

  const norm = (value) =>
    (value || "")
      .replace(/\u00a0/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  let applying = false;

  function replaceExactTextNodes() {
    const walker = document.createTreeWalker(
      document.body || document.documentElement,
      NodeFilter.SHOW_TEXT,
    );

    let node;
    while ((node = walker.nextNode())) {
      const parent = node.parentElement;
      if (!parent) continue;
      if (["SCRIPT", "STYLE", "NOSCRIPT"].includes(parent.tagName)) continue;

      const key = norm(node.nodeValue).toLowerCase();
      const replacement = replacements.get(key);
      if (!replacement) continue;

      // Replace only standalone Dan/Mall text nodes. Sentences and testimonials are untouched.
      node.nodeValue = replacement;
      parent.setAttribute("data-floral-hero-title-replaced", key);
    }
  }

  function replaceExactLeafElements() {
    document.querySelectorAll("body *").forEach((element) => {
      if (["SCRIPT", "STYLE", "NOSCRIPT"].includes(element.tagName)) return;
      if (element.children.length > 0) return;

      const key = norm(element.textContent).toLowerCase();
      const replacement = replacements.get(key);
      if (!replacement) return;

      if (element.textContent !== replacement) element.textContent = replacement;
      element.setAttribute("data-floral-hero-title-replaced", key);
    });
  }

  function applyHeroTitle() {
    if (applying) return;
    applying = true;
    try {
      replaceExactTextNodes();
      replaceExactLeafElements();
    } finally {
      applying = false;
    }
  }

  const schedule = () => requestAnimationFrame(applyHeroTitle);

  applyHeroTitle();
  document.addEventListener("DOMContentLoaded", applyHeroTitle);
  window.addEventListener("load", applyHeroTitle);

  new MutationObserver(schedule).observe(document.documentElement, {
    subtree: true,
    childList: true,
    characterData: true,
  });

  [0, 25, 50, 100, 200, 400, 700, 1000, 1500, 2500, 4000, 6000].forEach(
    (delay) => setTimeout(applyHeroTitle, delay),
  );

  const timer = setInterval(applyHeroTitle, 500);
  setTimeout(() => clearInterval(timer), 10000);
})();
