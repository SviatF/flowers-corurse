(() => {
  const TARGET = "hIvMq00Eiq5eJzxlzt69EooL6Cg.jpg";
  const PARTS = [
    "/assets/florist-hero.b64.1",
    "/assets/florist-hero.b64.2",
    "/assets/florist-hero.b64.3",
  ];

  let replacementUrl = null;
  let loading = null;

  async function getReplacementUrl() {
    if (replacementUrl) return replacementUrl;
    if (!loading) {
      loading = Promise.all(PARTS.map((url) => fetch(url, { cache: "force-cache" }).then((r) => {
        if (!r.ok) throw new Error(`Failed to load ${url}`);
        return r.text();
      }))).then((parts) => {
        const b64 = parts.join("").replace(/\s+/g, "");
        const binary = atob(b64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        replacementUrl = URL.createObjectURL(new Blob([bytes], { type: "image/webp" }));
        return replacementUrl;
      });
    }
    return loading;
  }

  async function replaceHeroPortrait() {
    const images = [...document.querySelectorAll("img")].filter((img) => {
      const src = img.getAttribute("src") || "";
      const srcset = img.getAttribute("srcset") || "";
      const original = img.dataset.originalDanPortrait || "";
      return src.includes(TARGET) || srcset.includes(TARGET) || original.includes(TARGET);
    });

    if (!images.length) return;
    const url = await getReplacementUrl();

    images.forEach((img) => {
      if (!img.dataset.originalDanPortrait) {
        img.dataset.originalDanPortrait = img.getAttribute("src") || img.getAttribute("srcset") || "";
      }
      img.setAttribute("src", url);
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
  const observer = new MutationObserver(() => requestAnimationFrame(replaceHeroPortrait));
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["src", "srcset"],
  });
  [100, 350, 800, 1500, 3000].forEach((delay) => setTimeout(replaceHeroPortrait, delay));
})();
