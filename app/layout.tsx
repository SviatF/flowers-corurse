import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: 'Dan Mall Helps Designers Make More Money & Get Their Flowers',
  description: 'I help designers make more money and get their flowers through better pricing, leadership, and a career you love. 28 years of lessons. Join 70k+ readers.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
