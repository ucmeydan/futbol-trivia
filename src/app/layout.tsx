import { Bebas_Neue, Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";

export const metadata = {
  title: "Futbol Trivia | Günlük Süper Lig Bilgi Yarışması",
  description: "Her gün yenilenen sorularla futbol bilgini test et! Türkiye liglerine özel Top 10 ve Listeyi Tamamla oyunlarını hemen oyna.",
  openGraph: {
    title: "Futbol Trivia | Günlük Süper Lig Bilgi Yarışması",
    description: "Her gün yenilenen sorularla futbol bilgini test et! Türkiye liglerine özel Top 10 ve Listeyi Tamamla oyunlarını hemen oyna.",
    url: "https://futboltrivia.com.tr", 
    siteName: "Futbol Trivia",
    locale: "tr_TR",
    type: "website",
  },
};

const bebasNeue = Bebas_Neue({ 
  weight: '400',
  subsets: ["latin"],
  variable: '--font-bebas' 
});

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <head>
        {/* GOOGLE ADSENSE KODU BAŞLANGIÇ */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9343989966072677"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        {/* GOOGLE ADSENSE KODU BİTİŞ */}
      </head>
      <body className={`${inter.className} ${bebasNeue.variable} bg-slate-950 text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}
