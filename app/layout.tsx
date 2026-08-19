import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Гроші на квітах — курси флористики",
  description:
    "Курси флористики: професійна база, запуск квіткового бізнесу та VIP-наставництво.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="uk">
      <body>{children}</body>
    </html>
  );
}
