(() => {
  const TARGET = "hIvMq00Eiq5eJzxlzt69EooL6Cg.jpg";
  const REPLACEMENT = "/assets/florist-hero.webp";
  let applying = false;

  function hasTarget(value) {
    return typeof value === "string" && value.includes(TARGET);
  }

  function replaceTargetInValue(value) {
    if (!hasTarget(value)) return value;
    return value.replace(
      /https:\/\/framerusercontent\.com\/images\/hIvMq00Eiq5eJzxlzt69EooL6Cg\.jpg(?:\?[^\s\"'<>)]*)?/gi,
      REPLACEMENT,
    );
  }

  function applyHeroOverride() {
    if (applying) return;
    applying = true;

    try {
      // Replace every direct DOM attribute Framer may regenerate.
      document.querySelectorAll("*").forEach((el) => {
        if (!(el instanceof HTMLElement || el instanceof SVGElement)) return;

        for (const attr of Array.from(el.attributes || [])) {
          if (!hasTarget(attr.value)) continue;
          const next = replaceTargetInValue(attr.value);
          if (next !== attr.value) el.setAttribute(attr.name, next);
        }

        // Catch the generated Framer background layer even when the URL comes
        // from a stylesheet rather than an inline style attribute.
        if (el instanceof HTMLElement) {
          let bg = "";
          try {
            bg = getComputedStyle(el).backgroundImage || "";
          } catch (_) {}

          if (hasTarget(bg)) {
            el.style.setProperty(
              "background-image",
              `url(\"${REPLACEMENT}\")`,
              "important",
            );
            el.style.setProperty("background-size", "cover", "important");
            el.style.setProperty("background-position", "center center", "important");
            el.style.setProperty("background-repeat", "no-repeat", "important");
          }
        }
      });

      // Framer can recreate <source> nodes during hydration. Force any picture
      // containing the old portrait to use the local hero only.
      document.querySelectorAll("picture").forEach((picture) => {
        const img = picture.querySelector("img");
        if (!img) return;

        const src = img.getAttribute("src") || "";
        const srcset = img.getAttribute("srcset") || "";
        const pictureHtml = picture.innerHTML || "";
        if (!hasTarget(src) && !hasTarget(srcset) && !hasTarget(pictureHtml)) return;

        picture.querySelectorAll("source").forEach((source) => {
          source.removeAttribute("srcset");
          source.removeAttribute("src");
        });
        img.setAttribute("src", REPLACEMENT);
        img.removeAttribute("srcset");
        img.setAttribute("alt", "Флористка з букетом білих троянд");
        img.style.setProperty("object-fit", "cover", "important");
        img.style.setProperty("object-position", "center center", "important");
      });
    } finally {
      applying = false;
    }
  }

  const schedule = () => requestAnimationFrame(applyHeroOverride);

  // Run immediately and keep watching while Framer hydrates/re-renders.
  applyHeroOverride();

  const observer = new MutationObserver(schedule);
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["src", "srcset", "style", "class"],
  });

  [0, 50, 100, 200, 400, 700, 1000, 1500, 2500, 4000, 6000, 9000].forEach(
    (delay) => setTimeout(applyHeroOverride, delay),
  );

  const interval = setInterval(applyHeroOverride, 250);
  setTimeout(() => clearInterval(interval), 12000);
  window.addEventListener("load", applyHeroOverride, { once: true });
})();
