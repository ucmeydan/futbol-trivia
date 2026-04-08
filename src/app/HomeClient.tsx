'use client';

import Link from 'next/link';

const GAMES = [
  {
    href: '/listeyi-tamamla',
    title: 'Listeyi Tamamla',
    description: 'Günlük soruda kaç doğru cevap bulabilirsin? Tahmin yapmaya başladıktan sonra 90 saniyelik süren başlayacak.',
    detail: 'Her doğru cevap sana +5 saniye kazandırır.',
    detailHighlight: '+5 saniye',
    decorNumber: '90',
    icon: (
      <div className="absolute top-0 right-0 w-16 h-16 md:w-20 md:h-20 flex items-center justify-center opacity-90 shrink-0">
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
          <path className="text-slate-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <path className="text-green-500" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray="80, 100" strokeLinecap="round" />
        </svg>
        <div className="font-bebas text-3xl md:text-4xl text-white relative z-10 tracking-tighter">90</div>
      </div>
    ),
  },
  {
    href: '/top10',
    title: 'Top 10',
    description: 'Hafızanı zorla! Belirli bir istatistik kategorisine ait 10 ismi tahmin etmeye çalış.',
    detail: 'Süreli olmayan bu modda 3 defa yanlış tahmin yaparsan oyun sona erer.',
    detailHighlight: null,
    decorNumber: '10',
    icon: (
      <div className="absolute top-0 right-0 w-14 h-14 md:w-16 md:h-16 flex flex-col gap-1 md:gap-1.5 p-2 md:p-3 bg-slate-950/50 rounded-xl border border-slate-800 opacity-90 shrink-0">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-1 md:gap-1.5 items-center">
            <div className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-sm ${i < 2 ? 'bg-green-500' : 'bg-slate-700'}`}></div>
            <div className={`h-1.5 md:h-2 flex-grow rounded ${i < 2 ? 'bg-white/80' : 'bg-slate-800'}`}></div>
          </div>
        ))}
      </div>
    ),
  },
  {
    href: '/kariyer-yolu',
    title: 'Kariyer Yolu',
    description: "Yolu Türkiye'den geçmiş oyuncuları daha önce oynadıkları takımlardan bulmaya çalış.",
    detail: 'Her tahminde yeni bir sezon açılacak. Bakalım doğru oyuncuyu kaçıncı denemede bulabileceksin.',
    detailHighlight: null,
    decorNumber: '?',
    icon: (
      <div className="absolute top-0 right-0 w-14 h-14 md:w-16 md:h-16 flex items-center justify-center bg-slate-950/50 rounded-xl border border-slate-800 opacity-90 shrink-0">
        <svg className="w-8 h-8 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2v20" />
          <path d="M17 6l5 4-5 4H5V6h12z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    ),
  },
  {
    href: '/takim-arkadasi',
    title: 'Takım Arkadaşı',
    description: "Yolu Türkiye'den geçmiş oyuncuları, kulüp ya da milli takım kariyerindeki takım arkadaşlarından bulmaya çalış.",
    detail: 'Her yanlış tahminde yeni bir takım arkadaşı açılacak. Toplam 7 tahmin hakkın var.',
    detailHighlight: null,
    decorNumber: '7',
    icon: (
      <div className="absolute top-0 right-0 w-14 h-14 md:w-16 md:h-16 flex items-center justify-center bg-slate-950/50 rounded-xl border border-slate-800 opacity-90 shrink-0">
        <svg className="w-8 h-8 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M16.5 2L19 4.5 16.5 7h-2.5V11L11 14l-3-1v-4H5.5L8 6.5 5.5 4H10V2H16.5z" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M7.5 22L5 19.5 7.5 17h2.5v-4l3-3 3 1v4h2.5L16 17.5 18.5 20h-4.5v2H7.5z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    ),
  },
];

export default function HomeClient() {
  return (
    <main className="min-h-screen bg-slate-950 text-white font-sans flex flex-col items-center selection:bg-red-500/30 relative overflow-hidden">

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-96 bg-red-600/10 blur-[120px] pointer-events-none" aria-hidden="true" />

      {/* Hero */}
      <div className="text-center mt-12 md:mt-20 mb-16 animate-in fade-in slide-in-from-bottom-4 duration-1000 relative z-10 w-full px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-center gap-6 mb-4">
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tighter bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent">
            Futbol Trivia
          </h1>
          <div className="flex w-14 h-14 md:w-16 md:h-16 mx-auto md:mx-0 border-2 border-slate-800 rounded-2xl items-center justify-center bg-slate-900 rotate-12 shadow-xl shrink-0" aria-hidden="true">
            <svg className="w-8 h-8 md:w-10 md:h-10 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17M14 14.66V17M18 4H6v7a6 6 0 0 0 12 0V4Z" />
            </svg>
          </div>
        </div>

        <p className="text-slate-500 text-sm md:text-base font-medium tracking-wide mb-8">
          Türkiye'nin en güncel futbol bilgi yarışması platformu
        </p>

        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-red-600/10 border border-red-500/20 mb-8 shadow-inner">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" aria-hidden="true" />
          <span className="text-base md:text-lg font-bold text-red-500 tracking-wide">Süper Lig Özel</span>
        </div>

        <p className="text-slate-400 text-lg md:text-xl font-light italic max-w-lg mx-auto leading-relaxed">
          Her gün yenilenen sorularla futbol bilgini test et.
        </p>
      </div>

      {/* Oyun kartları */}
      <section aria-label="Oyunlar" className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-7xl relative z-10 px-4">
        {GAMES.map((game) => (
          <Link
            key={game.href}
            href={game.href}
            className="group relative overflow-hidden bg-slate-900/40 border border-slate-800 p-6 md:p-8 rounded-3xl hover:border-red-500/50 transition-all duration-500 hover:shadow-[0_0_40px_-10px_rgba(239,68,68,0.2)]"
          >
            <div className="relative z-10">
              {game.icon}
              <h2 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-red-500 transition-colors pt-1 pr-16">
                {game.title}
              </h2>
              <div className="space-y-3 max-w-full">
                <p className="text-white/90 text-sm font-semibold italic">Nasıl oynanır?</p>
                <p className="text-slate-400 text-sm leading-relaxed">{game.description}</p>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {game.detailHighlight
                    ? game.detail.split(game.detailHighlight).map((part, i, arr) =>
                        i < arr.length - 1 ? (
                          <span key={i}>{part}<span className="text-red-500 font-bold">{game.detailHighlight}</span></span>
                        ) : part
                      )
                    : game.detail}
                </p>
              </div>
              <div className="flex items-center text-xs font-semibold text-red-500 tracking-wider mt-8" aria-hidden="true">
                HEMEN OYNA <span className="ml-2 transition-transform group-hover:translate-x-2">→</span>
              </div>
            </div>
            <div className="absolute -right-6 -bottom-6 text-[8rem] font-black text-slate-800/5 pointer-events-none font-mono" aria-hidden="true">
              {game.decorNumber}
            </div>
          </Link>
        ))}
      </section>

      {/* SEO içerik bloğu */}
      <section aria-label="Platform hakkında" className="w-full max-w-7xl relative z-10 px-4 mt-20">
        <div className="border-t border-slate-900 pt-12 pb-4">
          <h2 className="text-slate-600 text-xs tracking-[0.2em] uppercase mb-8">FutbolTrivia hakkında</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-sm text-slate-600 leading-relaxed font-light mb-10">
            <div>
              <h3 className="text-slate-500 font-normal mb-3">Süper Lig odaklı içerik</h3>
              <p>
                FutbolTrivia, Süper Lig tarihine ve Türkiye'den geçmiş futbolculara odaklanan
                günlük bilgi yarışması platformudur. Milli takım kadroları, Avrupa kupalarındaki
                Türk kulüpleri, tarihin unutulmaz transferleri ve kariyer yolculukları soru
                havuzumuzun temelini oluşturur. Her soru, Türk futbolunun farklı bir katmanını
                keşfetmene olanak tanır.
              </p>
            </div>
            <div>
              <h3 className="text-slate-500 font-normal mb-3">Her gün yenilenen dört oyun</h3>
              <p>
                Listeyi Tamamla, Top 10, Kariyer Yolu ve Takım Arkadaşı olmak üzere dört farklı
                oyun modülü her gün güncellenir. Her modül farklı bir futbol bilgisi boyutunu
                test eder: zamana karşı yarışma, istatistik listeleri, kariyer geçmişi ve
                takım arkadaşlıkları. Kayıt gerektirmez, ücretsizdir.
              </p>
            </div>
            <div>
              <h3 className="text-slate-500 font-normal mb-3">Kişisel istatistikler</h3>
              <p>
                Oyun başına tahmin dağılımın, kazanma yüzden ve günlük serilerin tarayıcında
                saklanır. Her oturumda kendi gelişimini takip edebilir, hangi oyun modülünde
                daha güçlü olduğunu görebilirsin. Arşiv navigasyonuyla geçmiş soruları
                tekrar oynayarak kaçırdığın günleri tamamlayabilirsin.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-sm text-slate-600 leading-relaxed font-light">
            <div>
              <h3 className="text-slate-500 font-normal mb-3">Türk futbolunun tarihi</h3>
              <p>
                Sorularımız yalnızca güncel sezonu değil, Süper Lig'in kuruluşundan bugüne
                uzanan geniş bir dönemi kapsar. 1959'dan itibaren Türk futbolunda iz bırakan
                kulüpler, efsane oyuncular ve tarihin dönüm noktaları soru havuzumuzda yer alır.
                Futbol bilgini farklı dönemlerde test etmek isteyenler için idealdir.
              </p>
            </div>
            <div>
              <h3 className="text-slate-500 font-normal mb-3">Nasıl oynanır?</h3>
              <p>
                Ana sayfadaki dört oyundan birini seç ve oynamaya başla. Her oyunun kendine
                özgü kuralları vardır: Listeyi Tamamla'da 90 saniyeyle yarışırsın,
                Top 10'da 3 yanlış hakkın vardır, Kariyer Yolu'nda kariyer tablosunu
                adım adım açarsın, Takım Arkadaşı'nda ise 7 tahmin hakkınla gizlenen
                futbolcuyu bulmaya çalışırsın.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full mt-auto pt-16 pb-12 relative z-10 border-t border-slate-900/50 font-sans">
        <div className="max-w-5xl mx-auto px-6">
          <nav aria-label="Alt navigasyon" className="flex flex-col md:flex-row items-center justify-center gap-y-4 md:gap-x-12 mb-10 text-sm font-medium text-slate-500">
            <Link href="/hakkimizda" className="hover:text-red-600 transition-colors px-2">Hakkımızda</Link>
            <span className="hidden md:block text-slate-800" aria-hidden="true">•</span>
            <Link href="/iletisim" className="hover:text-red-600 transition-colors px-2">İletişim</Link>
            <span className="hidden md:block text-slate-800" aria-hidden="true">•</span>
            <Link href="/gizlilik" className="hover:text-red-600 transition-colors px-2">Gizlilik politikası</Link>
          </nav>
          <p className="text-center text-slate-700 text-[10px] tracking-[0.3em] uppercase font-mono">
            © 2026 Futbol Trivia · Tüm hakları saklıdır.
          </p>
        </div>
      </footer>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        .font-bebas { font-family: 'Bebas Neue', sans-serif; }
      `}</style>
    </main>
  );
}