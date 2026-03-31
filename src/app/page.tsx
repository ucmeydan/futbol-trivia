'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white font-sans flex flex-col items-center selection:bg-red-500/30 relative overflow-hidden">
      
      {/* Arka Plan Dekoratif Işıklar */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-96 bg-red-600/10 blur-[120px] pointer-events-none"></div>

      {/* Hero Section */}
      <div className="text-center mt-12 md:mt-20 mb-16 animate-in fade-in slide-in-from-bottom-4 duration-1000 relative z-10 w-full px-4">
        
        {/* Futbol Trivia Başlığı ve Kupa Logosu */}
        <div className="flex flex-col md:flex-row md:items-center justify-center gap-6 mb-4">
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tighter bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent">
            Futbol Trivia
          </h1>

          <div className="flex w-14 h-14 md:w-16 md:h-16 mx-auto md:mx-0 border-2 border-slate-800 rounded-2xl items-center justify-center bg-slate-900 rotate-12 shadow-xl shrink-0">
             <svg className="w-8 h-8 md:w-10 md:h-10 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
               <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17M14 14.66V17M18 4H6v7a6 6 0 0 0 12 0V4Z" />
             </svg>
          </div>
        </div>

        <h2 className="text-slate-500 text-sm md:text-base font-medium tracking-wide mb-8">
          Türkiye'nin en güncel futbol bilgi yarışması platformu
        </h2>

        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-red-600/10 border border-red-500/20 mb-8 shadow-inner">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></div>
          <span className="text-base md:text-lg font-bold text-red-500 tracking-wide font-sans">
            Süper Lig Özel
          </span>
        </div>

        <p className="text-slate-400 text-lg md:text-xl font-light italic max-w-lg mx-auto leading-relaxed">
          Her gün yenilenen sorularla futbol bilgini test et. 
        </p>
      </div>

      {/* Oyun Kartları Konteynırı */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl relative z-10 px-4">
        
        {/* Oyun 1: Listeyi Tamamla */}
        <Link href="/listeyi-tamamla" className="group relative overflow-hidden bg-slate-900/40 border border-slate-800 p-6 md:p-8 rounded-3xl hover:border-red-500/50 transition-all duration-500 hover:shadow-[0_0_40px_-10px_rgba(239,68,68,0.2)]">
          <div className="relative z-10">
            <div className="absolute top-0 right-0 w-16 h-16 md:w-20 md:h-20 flex items-center justify-center opacity-90 transition-opacity duration-500 shrink-0">
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path className="text-slate-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2.5" />
                <path className="text-green-500" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray="80, 100" strokeLinecap="round" />
              </svg>
              <div className="font-bebas text-3xl md:text-4xl text-white relative z-10 tracking-tighter">90</div>
            </div>

            <h3 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-red-500 transition-colors pt-1 pr-16 font-sans">
              Listeyi Tamamla
            </h3>
            
            <div className="space-y-3 max-w-full font-sans">
              <p className="text-white/90 text-sm font-semibold italic">Nasıl oynanır?</p>
              <p className="text-slate-400 text-sm leading-relaxed">
                Günlük soruda kaç doğru cevap bulabilirsin? Tahmin yapmaya başladıktan sonra 90 saniyelik süren başlayacak.
              </p>
              <p className="text-slate-400 text-sm leading-relaxed">
                Her doğru cevap sana <span className="text-red-500 font-bold">+5 saniye</span> kazandırır.
              </p>
            </div>

            <div className="flex items-center text-xs font-semibold text-red-500 tracking-wider mt-8 font-sans">
              HEMEN OYNA <span className="ml-2 transition-transform group-hover:translate-x-2">→</span>
            </div>
          </div>
          <div className="absolute -right-6 -bottom-6 text-[8rem] font-black text-slate-800/5 transition-all duration-1000 font-mono pointer-events-none">90</div>
        </Link>

        {/* Oyun 2: Top 10 */}
        <Link href="/top10" className="group relative overflow-hidden bg-slate-900/40 border border-slate-800 p-6 md:p-8 rounded-3xl hover:border-red-500/50 transition-all duration-500 hover:shadow-[0_0_40px_-10px_rgba(239,68,68,0.2)]">
          <div className="relative z-10">
            <div className="absolute top-0 right-0 w-14 h-14 md:w-16 md:h-16 flex flex-col gap-1 md:gap-1.5 p-2 md:p-3 bg-slate-950/50 rounded-xl border border-slate-800 opacity-90 transition-all duration-500 group-hover:translate-x-1 shrink-0">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex gap-1 md:gap-1.5 items-center font-sans">
                  <div className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-sm ${i < 2 ? 'bg-green-500' : 'bg-slate-700'}`}></div>
                  <div className={`h-1.5 md:h-2 flex-grow rounded ${i < 2 ? 'bg-white/80' : 'bg-slate-800'}`}></div>
                </div>
              ))}
            </div>

            <h3 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-red-500 transition-colors pt-1 pr-16 font-sans">
              Top 10
            </h3>
            
            <div className="space-y-3 max-w-full font-sans">
              <p className="text-white/90 text-sm font-semibold italic">Nasıl oynanır?</p>
              <p className="text-slate-400 text-sm leading-relaxed">
                Hafızanı zorla! Belirli bir istatistik kategorisine ait 10 ismi tahmin etmeye çalış.
              </p>
              <p className="text-slate-400 text-sm leading-relaxed">
                Süreli olmayan bu modda 3 defa yanlış tahmin yaparsan oyun sona erer. 
              </p>
            </div>

            <div className="flex items-center text-xs font-semibold text-red-500 tracking-wider mt-8 font-sans">
              HEMEN OYNA <span className="ml-2 transition-transform group-hover:translate-x-2">→</span>
            </div>
          </div>
          <div className="absolute -right-6 -bottom-6 text-[8rem] font-black text-slate-800/5 transition-all duration-1000 font-mono pointer-events-none">10</div>
        </Link>

        {/* Oyun 3: Kariyer Yolu */}
        <Link href="/kariyer-yolu" className="group relative overflow-hidden bg-slate-900/40 border border-slate-800 p-6 md:p-8 rounded-3xl hover:border-red-500/50 transition-all duration-500 hover:shadow-[0_0_40px_-10px_rgba(239,68,68,0.2)]">
          <div className="relative z-10">
            {/* YENİ LOGO: Patika simgesi yerine Tabela/Yol İşareti */}
            <div className="absolute top-0 right-0 w-14 h-14 md:w-16 md:h-16 flex items-center justify-center bg-slate-950/50 rounded-xl border border-slate-800 opacity-90 transition-all duration-500 group-hover:scale-110 shrink-0">
               <svg className="w-8 h-8 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2v20" />
                  <path d="M17 6l5 4-5 4H5V6h12z" strokeLinecap="round" strokeLinejoin="round"/>
               </svg>
            </div>

            <h3 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-red-500 transition-colors pt-1 pr-16 font-sans">
              Kariyer Yolu
            </h3>
            
            <div className="space-y-3 max-w-full font-sans">
              <p className="text-white/90 text-sm font-semibold italic">Nasıl oynanır?</p>
              <p className="text-slate-400 text-sm leading-relaxed">
                Yolu Türkiye'den geçmiş oyuncuları daha önce oynadıkları takımlardan bulmaya çalış. 
              </p>
              <p className="text-slate-400 text-sm leading-relaxed">
                Her tahminde yeni bir takım açılacak. Bakalım doğru oyuncuyu kaçıncı denemede bulabileceksin.
              </p>
            </div>

            <div className="flex items-center text-xs font-semibold text-red-500 tracking-wider mt-8 font-sans">
              HEMEN OYNA <span className="ml-2 transition-transform group-hover:translate-x-2">→</span>
            </div>
          </div>
          <div className="absolute -right-6 -bottom-6 text-[8rem] font-black text-slate-800/5 transition-all duration-1000 font-mono pointer-events-none">?</div>
        </Link>

      </div>

      {/* FOOTER ALANI */}
      <footer className="w-full mt-auto pt-20 pb-12 relative z-10 border-t border-slate-900/50 font-sans">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-center gap-y-4 md:gap-x-12 mb-10 text-sm font-medium text-slate-500">
            <Link href="/hakkimizda" className="hover:text-red-600 transition-colors px-2"> Hakkımızda </Link>
            <span className="hidden md:block text-slate-800">•</span>
            <Link href="/iletisim" className="hover:text-red-600 transition-colors px-2"> İletişim </Link>
            <span className="hidden md:block text-slate-800">•</span>
            <Link href="/gizlilik-politikasi" className="hover:text-red-600 transition-colors px-2"> Gizlilik politikası </Link>
          </div>
          <div className="text-center space-y-3">
            <p className="text-slate-700 text-[10px] tracking-[0.3em] uppercase font-mono"> © 2026 Futbol Trivia • Tüm hakları saklıdır. </p>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        .font-bebas { font-family: 'Bebas Neue', sans-serif; }
      `}</style>
    </main>
  );
}
