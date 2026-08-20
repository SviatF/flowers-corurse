import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./mobile-hero.css";

// Deployment sync trigger: 2026-08-20 01:11
export const metadata: Metadata = {
  title: "Floral Education — створи професію та квітковий бізнес",
  description:
    "Три рівні навчання з флористики: професія флориста, запуск квіткового бізнесу та персональне VIP-наставництво.",
  openGraph: {
    title: "Floral Education — Створюй. Рости. Заробляй.",
    description:
      "Перетвори любов до квітів на професію, стиль і власний бізнес.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="uk">
      <body>{children}</body>
    </html>
  );
}
