(() => {
  const REPLACEMENT = "/assets/florist-hero.webp";
  const HERO_SELECTOR =
    '[data-framer-background-image-wrapper="true"] > img[alt="Dan Mall"][width="2000"][height="1333"]';
  let applying = false;

  function replaceHeroImage(img) {
    const wrapper = img.parentElement;
    if (!(wrapper instanceof HTMLElement)) return;

    // Put our image on the existing hero wrapper itself. This survives Framer
    // changing src/srcset/currentSrc on its internal <img> element.
    wrapper.style.setProperty(
      "background-image",
      `url("${REPLACEMENT}")`,
      "important",
    );
    wrapper.style.setProperty("background-size", "cover", "important");
    wrapper.style.setProperty("background-position", "center center", "important");
    wrapper.style.setProperty("background-repeat", "no-repeat", "important");

    // The original Dan portrait is never allowed to become visible again.
    img.style.setProperty("opacity", "0", "important");
    img.style.setProperty("visibility", "hidden", "important");

    // Also replace its network source so Framer no longer needs the old image.
    img.removeAttribute("srcset");
    img.removeAttribute("sizes");
    img.setAttribute("src", REPLACEMENT);
    img.setAttribute("alt", "Флористка з букетом білих троянд");
  }

  function applyHeroOverride() {
    if (applying) return;
    applying = true;

    try {
      document.querySelectorAll(HERO_SELECTOR).forEach((node) => {
        if (node instanceof HTMLImageElement) replaceHeroImage(node);
      });

      // Framer may change the alt attribute during hydration. Fallback to the
      // unique 2000x1333 image in a Framer background wrapper near the top.
      document
        .querySelectorAll(
          '[data-framer-background-image-wrapper="true"] > img[width="2000"][height="1333"]',
        )
        .forEach((node) => {
          if (!(node instanceof HTMLImageElement)) return;
          const rect = node.getBoundingClientRect();
          if (rect.top < window.innerHeight * 1.25) replaceHeroImage(node);
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

  [0, 25, 50, 100, 200, 400, 700, 1000, 1500, 2500, 4000, 6000, 9000].forEach(
    (delay) => setTimeout(applyHeroOverride, delay),
  );

  const interval = setInterval(applyHeroOverride, 200);
  setTimeout(() => clearInterval(interval), 15000);
  window.addEventListener("load", applyHeroOverride, { once: true });
})();
