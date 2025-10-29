import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PokéDex Pro - 포켓몬 도감",
  description: "모든 포켓몬 정보를 한눈에! 현대적이고 아름다운 포켓몬 도감",
  keywords: ["포켓몬", "pokemon", "pokedex", "도감"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
