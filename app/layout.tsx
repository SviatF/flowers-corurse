import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Florist — від нуля до власного бізнесу",
  description:
    "Преміальні програми навчання флористиці: професія, запуск квіткового бізнесу та VIP-наставництво.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="uk">
      <body>{children}</body>
    </html>
  );
}
