import { Bebas_Neue, Inter } from "next/font/google";
import "./globals.css";

// SEO VE META BİLGİLERİ GÜNCELLEMESİ
export const metadata = {
  // Tarayıcı sekmesinde ve Google arama sonuçlarında görünecek ana başlık
  title: "Futbol Trivia | Günlük Süper Lig Bilgi Yarışması",
  
  // Google arama sonuçlarındaki o küçük açıklama metni
  description: "Her gün yenilenen sorularla futbol bilgini test et! Türkiye liglerine özel Top 10 ve Listeyi Tamamla oyunlarını hemen oyna.",
  
  // Sosyal medya ve WhatsApp paylaşımları için (OpenGraph)
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
    // lang="en" kısmını "tr" olarak güncelledim, Google için önemlidir
    <html lang="tr">
      <body className={`${inter.className} ${bebasNeue.variable} bg-slate-950 text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}
