(() => {
  const TARGET = "hIvMq00Eiq5eJzxlzt69EooL6Cg.jpg";
  const REPLACEMENT = "/assets/florist-hero.webp";

  function replaceHeroPortrait() {
    document.querySelectorAll("img").forEach((img) => {
      const src = img.getAttribute("src") || "";
      const srcset = img.getAttribute("srcset") || "";
      const originalSrc = img.dataset.originalDanPortrait || "";

      if (
        !src.includes(TARGET) &&
        !srcset.includes(TARGET) &&
        !originalSrc.includes(TARGET)
      ) return;

      if (!img.dataset.originalDanPortrait) {
        img.dataset.originalDanPortrait = src || srcset;
      }

      img.setAttribute("src", REPLACEMENT);
      img.removeAttribute("srcset");
      img.setAttribute("alt", "Флористка з букетом білих троянд");
      img.style.objectFit = "cover";
      img.style.objectPosition = "center center";

      const picture = img.closest("picture");
      if (picture) {
        picture.querySelectorAll("source").forEach((source) => {
          source.removeAttribute("srcset");
          source.removeAttribute("src");
        });
      }
    });
  }

  replaceHeroPortrait();

  const observer = new MutationObserver(() => {
    requestAnimationFrame(replaceHeroPortrait);
  });
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["src", "srcset"],
  });

  [100, 350, 800, 1500, 3000].forEach((delay) => {
    setTimeout(replaceHeroPortrait, delay);
  });
})();
