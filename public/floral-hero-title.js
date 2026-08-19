(() => {
  const replacements = {
    dan: "ГРОШІ",
    mall: "НА КВІТАХ",
  };

  const norm = (value) =>
    (value || "")
      .replace(/\u00a0/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  let applying = false;

  function findHeroWord(word) {
    const candidates = [];
    const walker = document.createTreeWalker(
      document.body || document.documentElement,
      NodeFilter.SHOW_TEXT,
    );

    let node;
    while ((node = walker.nextNode())) {
      if (norm(node.nodeValue).toLowerCase() !== word) continue;

      const parent = node.parentElement;
      if (!parent) continue;
      if (["SCRIPT", "STYLE", "NOSCRIPT"].includes(parent.tagName)) continue;

      const rect = parent.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight * 1.25) continue;

      const fontSize = parseFloat(getComputedStyle(parent).fontSize) || 0;
      if (fontSize < 48) continue;

      candidates.push({ node, parent, fontSize, top: rect.top });
    }

    candidates.sort((a, b) => b.fontSize - a.fontSize || a.top - b.top);
    return candidates[0] || null;
  }

  function applyHeroTitle() {
    if (applying) return;
    applying = true;

    try {
      const dan = findHeroWord("dan");
      const mall = findHeroWord("mall");

      if (dan) {
        dan.node.nodeValue = replacements.dan;
        dan.parent.setAttribute("data-floral-hero-word", "money");
      }

      if (mall) {
        mall.node.nodeValue = replacements.mall;
        mall.parent.setAttribute("data-floral-hero-word", "flowers");
      }
    } finally {
      applying = false;
    }
  }

  const schedule = () => requestAnimationFrame(applyHeroTitle);

  applyHeroTitle();
  document.addEventListener("DOMContentLoaded", applyHeroTitle, { once: true });
  window.addEventListener("load", applyHeroTitle, { once: true });

  new MutationObserver(schedule).observe(document.documentElement, {
    subtree: true,
    childList: true,
    characterData: true,
  });

  [50, 150, 350, 700, 1200, 2200].forEach((delay) =>
    setTimeout(applyHeroTitle, delay),
  );
})();
