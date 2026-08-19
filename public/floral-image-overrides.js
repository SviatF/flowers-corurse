(() => {
  const REPLACEMENT = "/hero-florist?v=20260819-1";
  const HERO_SELECTOR =
    '[data-framer-background-image-wrapper="true"] > img[width="2000"][height="1333"]';
  let applying = false;

  function replaceHeroImage(img) {
    img.removeAttribute("srcset");
    img.removeAttribute("sizes");

    if (img.getAttribute("src") !== REPLACEMENT) {
      img.setAttribute("src", REPLACEMENT);
    }

    img.setAttribute("alt", "Флористка з букетом білих троянд");
    img.style.setProperty("opacity", "1", "important");
    img.style.setProperty("visibility", "visible", "important");
    img.style.setProperty("display", "block", "important");
    img.style.setProperty("width", "100%", "important");
    img.style.setProperty("height", "100%", "important");
    img.style.setProperty("object-fit", "cover", "important");
    img.style.setProperty("object-position", "center center", "important");

    const wrapper = img.parentElement;
    if (wrapper instanceof HTMLElement) {
      wrapper.style.removeProperty("background-image");
    }
  }

  function applyHeroOverride() {
    if (applying) return;
    applying = true;
    try {
      document.querySelectorAll(HERO_SELECTOR).forEach((node) => {
        if (!(node instanceof HTMLImageElement)) return;
        const rect = node.getBoundingClientRect();
        if (rect.top < window.innerHeight * 1.5) replaceHeroImage(node);
      });
    } finally {
      applying = false;
    }
  }

  const schedule = () => requestAnimationFrame(applyHeroOverride);
  applyHeroOverride();

  const observer = new MutationObserver(schedule);
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["src", "srcset", "sizes", "style", "class", "alt"],
  });

  [0, 25, 50, 100, 200, 400, 700, 1000, 1500, 2500, 4000, 6000].forEach(
    (delay) => setTimeout(applyHeroOverride, delay),
  );
  window.addEventListener("load", applyHeroOverride, { once: true });
})();
