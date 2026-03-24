'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white font-sans flex flex-col items-center justify-center p-6 selection:bg-red-500/30 relative overflow-hidden font-sans">
      
      {/* Arka Plan Dekoratif Işıklar */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-96 bg-red-600/10 blur-[120px] pointer-events-none font-sans"></div>

      {/* Hero Section */}
      <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-1000 relative z-10 font-sans">
        
        {/* Futbol Trivia Başlığı ve Kupa Logosu */}
        <div className="flex flex-col md:flex-row md:items-center justify-center gap-6 mb-8 font-sans">
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tighter bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent font-sans">
            Futbol Trivia
          </h1>

          {/* Sağ Logo: Kupa Sembolü */}
          <div className="flex w-14 h-14 md:w-16 md:h-16 mx-auto md:mx-0 border-2 border-slate-800 rounded-2xl items-center justify-center bg-slate-900 rotate-12 shadow-xl shrink-0 font-sans">
             <svg className="w-8 h-8 md:w-10 md:h-10 text-red-500 font-sans" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
               <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17M14 14.66V17M18 4H6v7a6 6 0 0 0 12 0V4Z" />
             </svg>
          </div>
        </div>

        {/* Süper Lig Özel Logosu */}
        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-red-600/10 border border-red-500/20 mb-8 shadow-inner font-sans">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse font-sans"></div>
          <span className="text-base md:text-lg font-bold text-red-500 tracking-wide font-sans">
            Süper Lig Özel
          </span>
        </div>

        <p className="text-slate-400 text-lg md:text-xl font-medium tracking-wide italic max-w-lg mx-auto leading-relaxed font-sans">
          Her gün yenilenen sorularla futbol bilgini test et. 
        </p>
      </div>

      {/* Oyun Kartları Konteynırı */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl relative z-10 font-sans">
        
        {/* Oyun 1: Listeyi Tamamla */}
        <Link href="/listeyi-tamamla" className="group relative overflow-hidden bg-slate-900/40 border border-slate-800 p-6 md:p-8 rounded-3xl hover:border-red-500/50 transition-all duration-500 hover:shadow-[0_0_40px_-10px_rgba(239,68,68,0.2)] font-sans">
          <div className="relative z-10 font-sans">
            
            {/* LOGO: 90 Sayaç */}
            <div className="absolute top-0 right-0 w-16 h-16 md:w-20 md:h-20 flex items-center justify-center opacity-90 transition-opacity duration-500 shrink-0 font-sans">
              <svg className="absolute inset-0 w-full h-full -rotate-90 font-sans" viewBox="0 0 36 36">
                <path className="text-slate-800 font-sans" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2.5" />
                <path className="text-green-500 font-sans" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray="80, 100" strokeLinecap="round" />
              </svg>
              <div className="font-bebas text-3xl md:text-4xl text-white relative z-10 tracking-tighter font-sans">90</div>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-red-500 transition-colors pt-1 pr-16 font-sans">
              Listeyi Tamamla
            </h2>
            
            <div className="space-y-3 max-w-full md:max-w-[85%] font-sans">
              <p className="text-white/90 text-sm font-semibold italic font-sans">Nasıl oynanır?</p>
              <p className="text-slate-400 text-sm leading-relaxed font-sans">
                Günlük soruda kaç doğru cevap bulabilirsin? Tahmin yapmaya başladıktan sonra 90 saniyelik süren başlayacak.
              </p>
              <p className="text-slate-400 text-sm leading-relaxed font-sans">
                Her doğru cevap sana <span className="text-red-500 font-bold font-sans">+5 saniye</span> kazandırır.
              </p>
            </div>

            <div className="flex items-center text-xs font-semibold text-red-500 tracking-wider mt-8 font-sans">
              HEMEN OYNA <span className="ml-2 transition-transform group-hover:translate-x-2 font-sans">→</span>
            </div>
          </div>
          <div className="absolute -right-6 -bottom-6 text-[8rem] md:text-[11rem] font-black text-slate-800/5 md:text-slate-800/10 group-hover:text-red-500/5 transition-all duration-1000 font-mono pointer-events-none font-sans">90</div>
        </Link>

        {/* Oyun 2: Top 10 */}
        <Link href="/top10" className="group relative overflow-hidden bg-slate-900/40 border border-slate-800 p-6 md:p-8 rounded-3xl hover:border-red-500/50 transition-all duration-500 hover:shadow-[0_0_40px_-10px_rgba(239,68,68,0.2)] font-sans">
          <div className="relative z-10 font-sans">
            
            <div className="absolute top-0 right-0 w-14 h-14 md:w-16 md:h-16 flex flex-col gap-1 md:gap-1.5 p-2 md:p-3 bg-slate-950/50 rounded-xl border border-slate-800 opacity-90 transition-all duration-500 group-hover:translate-x-1 shrink-0 font-sans">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex gap-1 md:gap-1.5 items-center font-sans">
                  <div className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-sm ${i < 2 ? 'bg-green-500' : 'bg-slate-700'} font-sans`}></div>
                  <div className={`h-1.5 md:h-2 flex-grow rounded ${i < 2 ? 'bg-white/80' : 'bg-slate-800'} font-sans`}></div>
                </div>
              ))}
            </div>

            <h2 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-red-500 transition-colors pt-1 pr-16 font-sans">
              Top 10
            </h2>
            
            <div className="space-y-3 max-w-full md:max-w-[85%] font-sans">
              <p className="text-white/90 text-sm font-semibold italic font-sans font-sans font-sans">Nasıl oynanır?</p>
              <p className="text-slate-400 text-sm leading-relaxed font-sans font-sans font-sans">
                Hafızanı zorla! Belirli bir istatistik kategorisine ait 10 ismi tahmin etmeye çalış.
              </p>
              <p className="text-slate-400 text-sm leading-relaxed font-sans font-sans font-sans">
                Süreli olmayan bu modda 3 defa yanlış tahmin yaparsan oyun sona erer. 
              </p>
            </div>

            <div className="flex items-center text-xs font-semibold text-red-500 tracking-wider mt-8 font-sans font-sans">
              HEMEN OYNA <span className="ml-2 transition-transform group-hover:translate-x-2 font-sans font-sans">→</span>
            </div>
          </div>
          <div className="absolute -right-6 -bottom-6 text-[8rem] md:text-[11rem] font-black text-slate-800/5 md:text-slate-800/10 group-hover:text-red-500/5 transition-all duration-1000 font-mono pointer-events-none font-sans">10</div>
        </Link>

      </div>

      {/* GÜNCELLENEN KISIM: Yeni Oyunlar Çok Yakında... */}
      <div className="mt-16 text-center animate-pulse relative z-10 font-sans">
        <p className="text-slate-600 text-sm md:text-base font-medium tracking-normal font-sans">
          Yeni oyunlar çok yakında...
        </p>
        <div className="mt-4 flex justify-center gap-2 font-sans">
          <div className="w-1 h-1 bg-slate-800 rounded-full font-sans"></div>
          <div className="w-1 h-1 bg-slate-800 rounded-full font-sans"></div>
          <div className="w-1 h-1 bg-slate-800 rounded-full font-sans"></div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 mb-8 text-slate-700 text-[10px] tracking-[0.25em] uppercase font-mono relative z-10 font-sans">
        © 2026 Futbol Trivia • Tüm hakları saklıdır.
      </footer>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        .font-bebas { font-family: 'Bebas Neue', sans-serif; }
      `}</style>
    </main>
  );
}
