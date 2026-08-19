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

      hero.style.setProperty("--portrait-y", `${Math.round(progress * -viewport * 0.022)}px`);
      hero.style.setProperty("--title-y", `${Math.round(progress * -viewport * 0.055)}px`);
      hero.style.setProperty("--pink-y", `${Math.round(progress * -viewport * 0.035)}px`);
      hero.style.setProperty("--magnolia-y", `${Math.round(progress * -viewport * 0.05)}px`);
      hero.style.setProperty("--subtitle-y", `${Math.round(progress * -viewport * 0.024)}px`);
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
