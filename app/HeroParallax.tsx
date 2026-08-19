"use client";

import { useEffect } from "react";

export default function HeroParallax() {
  useEffect(() => {
    const hero = document.querySelector<HTMLElement>(".pts-hero");
    if (!hero) return;

    let frame = 0;

    const update = () => {
      frame = 0;

      const rect = hero.getBoundingClientRect();
      const viewport = window.innerHeight || 1;
      const travel = Math.max(hero.offsetHeight - viewport, 1);
      const scrolled = Math.min(travel, Math.max(0, -rect.top));
      const progress = scrolled / travel;

      hero.style.setProperty("--hero-progress", progress.toFixed(4));
    };

    const requestUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
