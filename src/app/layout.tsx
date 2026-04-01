import { Bebas_Neue, Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata = {
  metadataBase: new URL('https://futboltrivia.com.tr'), // Görsel yollarını otomatik tamamlamak için kritik
  title: "Futbol Trivia | Günlük Süper Lig Bilgi Yarışması",
  description: "Her gün yenilenen sorularla futbol bilgini test et! Türkiye liglerine özel Top 10, Kariyer Yolu ve Listeyi Tamamla oyunlarını hemen oyna.",
  openGraph: {
    title: "Futbol Trivia | Günlük Süper Lig Bilgi Yarışması",
    description: "Her gün yenilenen sorularla futbol bilgini test et! Türkiye liglerine özel oyunları hemen oyna.",
    url: "https://futboltrivia.com.tr", 
    siteName: "Futbol Trivia",
    locale: "tr_TR",
    type: "website",
    images: [
      {
        url: '/og-image.png', // Public klasöründeki görsel
        width: 1200,
        height: 630,
        alt: 'Futbol Trivia Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image', // Twitter'da görselin büyük ve dikkat çekici görünmesini sağlar
    title: 'Futbol Trivia | Günlük Süper Lig Bilgi Yarışması',
    description: 'Her gün yenilenen sorularla futbol bilgini test et!',
    images: ['/og-image.png'], // metadataBase sayesinde tam URL'e dönüşür
    creator: '@futboltrivia', // Varsa Twitter kullanıcı adın
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
        {/* GOOGLE ADSENSE KODU */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9343989966072677"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className={`${inter.className} ${bebasNeue.variable} bg-slate-950 text-white antialiased`}>
        {children}
        <Analytics />       
        <SpeedInsights />    
      </body>
    </html>
  );
}
