import { Bebas_Neue, Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import CookieBanner from "./CookieBanner";

export const metadata: Metadata = {
  metadataBase: new URL('https://futboltrivia.com.tr'),
  title: {
    default: "FutbolTrivia | Günlük Süper Lig Bilgi Yarışması",
    template: "%s | FutbolTrivia",
  },
  description:
    "Her gün yenilenen sorularla futbol bilgini test et! Süper Lig ve Türk futboluna özel Takım Arkadaşı, Kariyer Yolu, Top 10 ve Listeyi Tamamla oyunlarını hemen oyna.",
  keywords: [
    "futbol trivia",
    "süper lig bilgi yarışması",
    "futbol oyunu",
    "türk futbolu",
    "günlük futbol sorusu",
    "kariyer yolu oyunu",
    "takım arkadaşı oyunu",
  ],
  authors: [{ name: "FutbolTrivia" }],
  creator: "FutbolTrivia",
  publisher: "FutbolTrivia",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
    },
  },
  alternates: {
    canonical: "https://futboltrivia.com.tr",
  },
  openGraph: {
    title: "FutbolTrivia | Günlük Süper Lig Bilgi Yarışması",
    description:
      "Her gün yenilenen sorularla futbol bilgini test et! Süper Lig ve Türk futboluna özel oyunları hemen oyna.",
    url: "https://futboltrivia.com.tr",
    siteName: "FutbolTrivia",
    locale: "tr_TR",
    type: "website",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "FutbolTrivia — Günlük Süper Lig Bilgi Yarışması",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FutbolTrivia | Günlük Süper Lig Bilgi Yarışması",
    description: "Her gün yenilenen sorularla futbol bilgini test et!",
    images: ["/api/og"],
    creator: "@futboltrivia",
  },
  verification: {
    google: "vZSx_Bp8LSRxUi16Ar2_TJHf8twf8nj6sg6CjYEnvQU",
  },
};

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9343989966072677"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body
        className={`${inter.className} ${bebasNeue.variable} bg-slate-950 text-white antialiased`}
      >
        {children}
        <CookieBanner />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}