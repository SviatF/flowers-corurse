(() => {
  const REPLACEMENT = "/hero-florist";
  const HERO_SELECTOR =
    '[data-framer-background-image-wrapper="true"] > img[alt="Dan Mall"][width="2000"][height="1333"]';
  let applying = false;

  function replaceHeroImage(img) {
    const wrapper = img.parentElement;
    if (!(wrapper instanceof HTMLElement)) return;

    wrapper.style.setProperty("background-image", `url("${REPLACEMENT}")`, "important");
    wrapper.style.setProperty("background-size", "cover", "important");
    wrapper.style.setProperty("background-position", "center center", "important");
    wrapper.style.setProperty("background-repeat", "no-repeat", "important");

    img.style.setProperty("opacity", "0", "important");
    img.style.setProperty("visibility", "hidden", "important");
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
      document.querySelectorAll('[data-framer-background-image-wrapper="true"] > img[width="2000"][height="1333"]').forEach((node) => {
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
  observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ["src", "srcset", "sizes", "style", "class", "alt"] });
  [0,25,50,100,200,400,700,1000,1500,2500,4000,6000,9000].forEach((delay) => setTimeout(applyHeroOverride, delay));
  const interval = setInterval(applyHeroOverride, 200);
  setTimeout(() => clearInterval(interval), 15000);
  window.addEventListener("load", applyHeroOverride, { once: true });
})();
