(() => {
  const norm = (value) =>
    (value || "")
      .replace(/\u00a0/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  const isPortfolioLink = (anchor) => {
    if (!(anchor instanceof HTMLAnchorElement)) return false;

    const text = norm(anchor.textContent).toLowerCase();
    if (text === "програми" || text === "portfolio") return true;

    const rawHref = anchor.getAttribute("href") || "";
    if (!rawHref) return false;

    try {
      const url = new URL(rawHref, document.baseURI);
      return /\/portfolio\/?$/i.test(url.pathname);
    } catch {
      return /(^|\/)portfolio\/?$/i.test(rawHref);
    }
  };

  const findProgramsTarget = () => {
    const anchors = [...document.querySelectorAll("a")];
    return anchors.find((anchor) =>
      norm(anchor.textContent)
        .toLowerCase()
        .includes("флорист від нуля до результату"),
    );
  };

  const apply = () => {
    const target = findProgramsTarget();
    if (!target) return;

    if (!document.getElementById("programs")) {
      target.id = "programs";
      target.style.scrollMarginTop = "32px";
    }

    document.querySelectorAll("a").forEach((anchor) => {
      if (!isPortfolioLink(anchor)) return;
      anchor.setAttribute("href", "#programs");
      anchor.removeAttribute("target");
      anchor.removeAttribute("rel");
    });
  };

  document.addEventListener(
    "click",
    (event) => {
      const element = event.target;
      if (!(element instanceof Element)) return;

      const anchor = element.closest("a");
      if (!isPortfolioLink(anchor)) return;

      const target = findProgramsTarget();
      if (!target) return;

      event.preventDefault();
      event.stopPropagation();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", "#programs");
    },
    true,
  );

  apply();
  document.addEventListener("DOMContentLoaded", apply, { once: true });
  window.addEventListener("load", apply, { once: true });

  new MutationObserver(() => requestAnimationFrame(apply)).observe(
    document.documentElement,
    { subtree: true, childList: true, characterData: true },
  );

  [100, 300, 700, 1400, 2600].forEach((delay) => setTimeout(apply, delay));
})();
