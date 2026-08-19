(() => {
  const HERO_IMAGE_SELECTOR =
    '[data-framer-background-image-wrapper="true"] > img[width="2000"][height="1333"]';
  const TITLE_ID = 'floral-safe-hero-title';

  const norm = (value) =>
    (value || '')
      .replace(/\u00a0/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

  const visible = (element) => {
    const style = getComputedStyle(element);
    return (
      style.display !== 'none' &&
      style.visibility !== 'hidden' &&
      Number(style.opacity || 1) > 0.01
    );
  };

  function isFlowerElement(element, flowerImg) {
    if (!element || !flowerImg) return false;
    if (element === flowerImg) return true;
    if (element.contains(flowerImg)) return true;
    if (flowerImg.contains(element)) return true;

    if (element instanceof HTMLImageElement) {
      const src = element.currentSrc || element.src || '';
      if (/hero-florist|hero-current|hIvMq00Eiq5eJzxlzt69EooL6Cg/i.test(src)) {
        return true;
      }
    }

    return false;
  }

  function candidateFromPoint(x, y, flowerImg) {
    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;
    const candidates = [];

    for (const hit of document.elementsFromPoint(x, y)) {
      let element = hit;

      while (
        element &&
        element !== document.body &&
        element !== document.documentElement
      ) {
        if (!isFlowerElement(element, flowerImg) && visible(element)) {
          const rect = element.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const text = norm(element.textContent).toLowerCase();

          const geometryOk =
            rect.width >= viewportW * 0.22 &&
            rect.width <= viewportW * 0.82 &&
            rect.height >= viewportH * 0.09 &&
            rect.height <= viewportH * 0.42 &&
            Math.abs(centerX - viewportW / 2) <= viewportW * 0.24 &&
            y >= rect.top - 4 &&
            y <= rect.bottom + 4;

          const textOk =
            !text ||
            text === 'dan' ||
            text === 'mall' ||
            text === 'd a n' ||
            text === 'm a l l';

          if (geometryOk && textOk) {
            const visual =
              element.tagName === 'SVG' ||
              element.tagName === 'IMG' ||
              element.tagName === 'CANVAS' ||
              element.querySelector('svg,img,canvas,path,polygon') ||
              getComputedStyle(element).backgroundImage !== 'none' ||
              getComputedStyle(element).maskImage !== 'none' ||
              getComputedStyle(element).webkitMaskImage !== 'none';

            if (visual) {
              candidates.push({
                element,
                rect,
                area: rect.width * rect.height,
              });
            }
          }
        }

        element = element.parentElement;
      }
    }

    candidates.sort((a, b) => a.area - b.area);
    return candidates[0] || null;
  }

  function findWordmarks(flowerImg) {
    const w = window.innerWidth;
    const h = window.innerHeight;

    const topProbes = [0.17, 0.21, 0.25, 0.29];
    const bottomProbes = [0.36, 0.41, 0.46, 0.51];

    let top = null;
    let bottom = null;

    for (const ratio of topProbes) {
      top = candidateFromPoint(w / 2, h * ratio, flowerImg);
      if (top) break;
    }

    for (const ratio of bottomProbes) {
      bottom = candidateFromPoint(w / 2, h * ratio, flowerImg);
      if (bottom && (!top || bottom.element !== top.element)) break;
    }

    if (!top || !bottom) return null;
    if (top.element === bottom.element) return null;

    return { top, bottom };
  }

  function ensureOverlay() {
    let overlay = document.getElementById(TITLE_ID);
    if (overlay) return overlay;

    overlay = document.createElement('div');
    overlay.id = TITLE_ID;
    overlay.setAttribute('aria-label', 'ГРОШІ НА КВІТАХ');
    overlay.innerHTML = `
      <div data-line="top">ГРОШІ</div>
      <div data-line="bottom">НА КВІТАХ</div>
    `;

    Object.assign(overlay.style, {
      position: 'absolute',
      left: '0',
      top: '0',
      width: '100%',
      height: '0',
      zIndex: '2147482000',
      pointerEvents: 'none',
    });

    document.body.appendChild(overlay);
    return overlay;
  }

  function styleLine(line) {
    Object.assign(line.style, {
      position: 'absolute',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      whiteSpace: 'nowrap',
      overflow: 'visible',
      color: '#ffffff',
      fontFamily: 'Impact, "Arial Black", Arial, sans-serif',
      fontWeight: '900',
      lineHeight: '0.8',
      letterSpacing: '-0.055em',
      textTransform: 'uppercase',
      margin: '0',
      padding: '0',
      transformOrigin: 'center center',
    });
  }

  function fitLine(line, rect) {
    line.style.left = `${rect.left + window.scrollX}px`;
    line.style.top = `${rect.top + window.scrollY}px`;
    line.style.width = `${rect.width}px`;
    line.style.height = `${rect.height}px`;

    let low = 24;
    let high = Math.max(40, rect.height * 1.45);

    for (let i = 0; i < 12; i += 1) {
      const mid = (low + high) / 2;
      line.style.fontSize = `${mid}px`;

      if (
        line.scrollWidth <= rect.width * 0.98 &&
        line.scrollHeight <= rect.height * 1.03
      ) {
        low = mid;
      } else {
        high = mid;
      }
    }

    line.style.fontSize = `${low}px`;
  }

  let applying = false;

  function apply() {
    if (applying) return;
    applying = true;

    try {
      const flowerImg = document.querySelector(HERO_IMAGE_SELECTOR);
      if (!(flowerImg instanceof HTMLImageElement)) return;

      // Always restore the intended flower image if another runtime touched it.
      flowerImg.removeAttribute('srcset');
      flowerImg.removeAttribute('sizes');
      if (!/\/hero-florist\?v=20260819-2$/.test(flowerImg.getAttribute('src') || '')) {
        flowerImg.setAttribute('src', '/hero-florist?v=20260819-2');
      }
      flowerImg.style.setProperty('opacity', '1', 'important');
      flowerImg.style.setProperty('visibility', 'visible', 'important');
      flowerImg.style.setProperty('display', 'block', 'important');

      const wordmarks = findWordmarks(flowerImg);
      if (!wordmarks) return;

      const { top, bottom } = wordmarks;

      // Hide only the two detected wordmark visuals. Never touch the flower image/wrapper.
      top.element.style.setProperty('opacity', '0', 'important');
      bottom.element.style.setProperty('opacity', '0', 'important');
      top.element.setAttribute('data-floral-hidden-wordmark', 'dan');
      bottom.element.setAttribute('data-floral-hidden-wordmark', 'mall');

      const overlay = ensureOverlay();
      const topLine = overlay.querySelector('[data-line="top"]');
      const bottomLine = overlay.querySelector('[data-line="bottom"]');
      if (!(topLine instanceof HTMLElement) || !(bottomLine instanceof HTMLElement)) return;

      styleLine(topLine);
      styleLine(bottomLine);
      fitLine(topLine, top.element.getBoundingClientRect());
      fitLine(bottomLine, bottom.element.getBoundingClientRect());
    } finally {
      applying = false;
    }
  }

  const schedule = () => requestAnimationFrame(apply);

  apply();
  document.addEventListener('DOMContentLoaded', apply);
  window.addEventListener('load', apply);
  window.addEventListener('resize', schedule);

  new MutationObserver(schedule).observe(document.documentElement, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: ['style', 'class', 'src', 'srcset'],
  });

  [0, 50, 100, 200, 400, 700, 1000, 1500, 2500, 4000].forEach((delay) =>
    setTimeout(apply, delay),
  );
})();
