import { Bebas_Neue, Inter } from "next/font/google";
import "./globals.css";

// 6. MADDE: SOSYAL MEDYA VE META BİLGİLERİ
// Bu kısım sitenin Google'da ve WhatsApp paylaşımlarında nasıl görüneceğini belirler.
export const metadata = {
  title: "TR-TRIVIA | Günlük Futbol Bilmecesi",
  description: "Galatasaray tarihinin en iyi 10'larını bulabilecek misin? Günlük futbol trivia oyunu.",
  openGraph: {
    title: "TR-TRIVIA | Futbol Top 10",
    description: "Onluk listeyi tamamla, futbol bilgini kanıtla!",
    url: "https://tr-trivia.com", // İleride siteni yayınladığında burayı güncellersin
    siteName: "TR-TRIVIA",
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
    <html lang="en">
      <body className={`${inter.className} ${bebasNeue.variable} bg-slate-950 text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}