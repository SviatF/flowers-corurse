(() => {
  const TARGET = "hIvMq00Eiq5eJzxlzt69EooL6Cg.jpg";
  const PARTS = [
    "/assets/florist-hero.b64.1",
    "/assets/florist-hero.b64.2",
    "/assets/florist-hero.b64.3",
  ];

  let replacementUrl = null;
  let loading = null;
  let applying = false;

  async function getReplacementUrl() {
    if (replacementUrl) return replacementUrl;
    if (!loading) {
      loading = Promise.all(
        PARTS.map((url) =>
          fetch(url, { cache: "force-cache" }).then((r) => {
            if (!r.ok) throw new Error(`Failed to load ${url}`);
            return r.text();
          }),
        ),
      ).then((parts) => {
        const b64 = parts.join("").replace(/\s+/g, "");
        const binary = atob(b64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        replacementUrl = URL.createObjectURL(
          new Blob([bytes], { type: "image/webp" }),
        );
        return replacementUrl;
      });
    }
    return loading;
  }

  function isTarget(value) {
    return typeof value === "string" && value.includes(TARGET);
  }

  async function replaceHeroPortrait() {
    if (applying) return;
    applying = true;

    try {
      const url = await getReplacementUrl();

      // Framer may render the portrait as a normal img/picture.
      document.querySelectorAll("img").forEach((img) => {
        const src = img.getAttribute("src") || "";
        const srcset = img.getAttribute("srcset") || "";
        const original = img.dataset.originalDanPortrait || "";

        if (!isTarget(src) && !isTarget(srcset) && !isTarget(original)) return;

        if (!img.dataset.originalDanPortrait) {
          img.dataset.originalDanPortrait = src || srcset;
        }

        img.setAttribute("src", url);
        img.removeAttribute("srcset");
        img.setAttribute("alt", "Флористка з букетом білих троянд");
        img.style.setProperty("object-fit", "cover", "important");
        img.style.setProperty("object-position", "center center", "important");

        const picture = img.closest("picture");
        if (picture) {
          picture.querySelectorAll("source").forEach((source) => {
            source.removeAttribute("srcset");
            source.removeAttribute("src");
          });
        }
      });

      // The large hero portrait on Dan Mall is also rendered by Framer as a
      // CSS background layer. Check computed styles so this works even when
      // the URL comes from Framer's generated stylesheet rather than inline CSS.
      document.querySelectorAll("body *").forEach((el) => {
        if (!(el instanceof HTMLElement)) return;

        const inlineBackground = el.style.backgroundImage || "";
        let computedBackground = "";
        try {
          computedBackground = getComputedStyle(el).backgroundImage || "";
        } catch (_) {}

        const original = el.dataset.originalDanPortraitBackground || "";
        const matches =
          isTarget(inlineBackground) ||
          isTarget(computedBackground) ||
          isTarget(original);

        if (!matches) return;

        if (!el.dataset.originalDanPortraitBackground) {
          el.dataset.originalDanPortraitBackground =
            inlineBackground || computedBackground || TARGET;
        }

        el.style.setProperty("background-image", `url("${url}")`, "important");
        el.style.setProperty("background-size", "cover", "important");
        el.style.setProperty("background-position", "center center", "important");
        el.style.setProperty("background-repeat", "no-repeat", "important");
      });
    } catch (error) {
      console.error("[floral-image-overrides]", error);
    } finally {
      applying = false;
    }
  }

  const scheduleReplacement = () => requestAnimationFrame(replaceHeroPortrait);

  replaceHeroPortrait();

  const observer = new MutationObserver(scheduleReplacement);
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["src", "srcset", "style", "class"],
  });

  [50, 150, 350, 700, 1200, 2000, 3500, 6000].forEach((delay) =>
    setTimeout(replaceHeroPortrait, delay),
  );

  window.addEventListener("load", replaceHeroPortrait, { once: true });
})();
