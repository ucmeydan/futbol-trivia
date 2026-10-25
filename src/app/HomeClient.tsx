'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

const APP_STORE_URL = 'https://apps.apple.com/tr/app/futbol-trivia/id6813849387?l=tr';

function AppStorePopup({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-6 duration-400"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Kapat butonu */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors text-lg leading-none"
          aria-label="Kapat"
        >✕</button>

        {/* İkon + Başlık */}
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 flex items-center justify-center bg-slate-950 border-2 border-slate-800 rounded-2xl shadow-lg shrink-0">
            <svg className="w-8 h-8 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17M14 14.66V17M18 4H6v7a6 6 0 0 0 12 0V4Z" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-semibold text-red-500 uppercase tracking-widest mb-0.5">Yeni</p>
            <h2 className="text-lg font-bold text-white leading-tight">Futbol Trivia artık<br />App Store'da!</h2>
          </div>
        </div>

        <p className="text-slate-400 text-sm leading-relaxed mb-5">
          Tüm oyunları cebinde taşı. İndir, oyna — hepsi ücretsiz.
        </p>

        {/* App Store badge */}
        <a
          href={APP_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 w-full bg-white hover:bg-slate-100 active:scale-95 transition-all duration-150 rounded-2xl px-5 py-3.5 shadow-lg"
          onClick={onClose}
        >
          {/* Apple logo */}
          <svg className="w-7 h-7 shrink-0 text-black" viewBox="0 0 814 1000" fill="currentColor">
            <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.5 135.4-317.3 269-317.3 70.1 0 128.4 46.4 172.5 46.4 42.8 0 109.5-49 192.3-49 30.5 0 111.4 2.6 166.3 56.5zm-174.4-209.5c31.8-37.5 54.1-89.9 54.1-142.3 0-7.1-.6-14.3-1.9-20.1-51.6 1.9-112.3 34.4-149.3 77.3-28.2 32.7-51.9 85.6-51.9 138.6 0 8.3 1.3 16.6 1.9 19.2 3.2.6 8.4 1.3 13.6 1.3 46.4 0 102.5-31.2 133.5-73.9z"/>
          </svg>
          <div>
            <p className="text-black text-[10px] font-medium leading-none mb-0.5">App Store'dan İndir</p>
            <p className="text-black text-base font-bold leading-none">App Store</p>
          </div>
          <svg className="w-4 h-4 text-black/50 ml-auto shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>
    </div>
  );
}

const GAMES = [
  {
    href: '/listeyi-tamamla',
    title: 'Listeyi Tamamla',
    description: 'Günlük soruda kaç doğru cevap bulabilirsin? Tahmin yazmaya başladıktan sonra 90 saniyelik süren başlayacak.',
    detail: 'Her doğru cevap sana +5 saniye kazandırır.',
    detailHighlight: '+5 saniye',
    decorNumber: '90',
    accentColor: 'green',
    icon: (
      <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center opacity-90 shrink-0 relative" aria-hidden="true">
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
    accentColor: 'amber',
    icon: (
      <div className="w-14 h-14 md:w-16 md:h-16 flex flex-col gap-1 md:gap-1.5 p-2 md:p-3 bg-slate-950/50 rounded-xl border border-slate-800 opacity-90 shrink-0" aria-hidden="true">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-1 md:gap-1.5 items-center">
            <div className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-sm ${i < 2 ? 'bg-amber-400' : 'bg-slate-700'}`} />
            <div className={`h-1.5 md:h-2 flex-grow rounded ${i < 2 ? 'bg-white/80' : 'bg-slate-800'}`} />
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
    accentColor: 'sky',
    icon: (
      <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center bg-slate-950/50 rounded-xl border border-slate-800 opacity-90 shrink-0" aria-hidden="true">
        <svg className="w-7 h-7 text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 6h18M3 12h12M3 18h6" strokeLinecap="round" />
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
    accentColor: 'red',
    icon: (
      <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center bg-slate-950/50 rounded-xl border border-slate-800 opacity-90 shrink-0" aria-hidden="true">
        <svg className="w-7 h-7 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="9" cy="7" r="3" strokeLinecap="round" />
          <path d="M3 20c0-4 2.7-6 6-6s6 2 6 6" strokeLinecap="round" />
          <circle cx="17" cy="7" r="3" strokeLinecap="round" />
          <path d="M14 20c0-2.5 1.2-4 3-5" strokeLinecap="round" />
        </svg>
      </div>
    ),
  },
  {
    href: '/kadro-bul',
    title: 'Kadro Bul',
    description: 'Gerçek bir maçın 11 futbolcusunu bul! Her oyuncu için Wordle gibi harf harf tahmin yap — doğru harf yeşil, yanlış yerde sarı.',
    detail: 'Her oyuncu için 6 tahmin hakkın var. Forma numaraları ve diziliş ipucu olarak gösterilir.',
    detailHighlight: null,
    decorNumber: '11',
    accentColor: 'orange',
    icon: (
      <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center bg-slate-950/50 rounded-xl border border-slate-800 opacity-90 shrink-0" aria-hidden="true">
        <svg viewBox="0 0 56 58" width="36" height="38" fill="none">
          <defs>
            <linearGradient id="home-jersey" x1="0" x2="1" y1="0" y2="0">
              <stop offset="50%" stopColor="#F7A014" />
              <stop offset="50%" stopColor="#E8211B" />
            </linearGradient>
          </defs>
          <path d="M22,5 L11,9 L2,24 L2,35 L12,31 L13,52 L43,52 L44,31 L54,35 L54,24 L45,9 L34,5 Q28,15 22,5Z" fill="url(#home-jersey)" stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
        </svg>
      </div>
    ),
  },
];

const accentMap: Record<string, string> = {
  green:  'hover:border-green-500/50 hover:shadow-[0_0_40px_-10px_rgba(34,197,94,0.2)] group-hover:text-green-400',
  amber:  'hover:border-amber-400/50 hover:shadow-[0_0_40px_-10px_rgba(251,191,36,0.2)] group-hover:text-amber-400',
  sky:    'hover:border-sky-500/50 hover:shadow-[0_0_40px_-10px_rgba(14,165,233,0.2)] group-hover:text-sky-400',
  red:    'hover:border-red-500/50 hover:shadow-[0_0_40px_-10px_rgba(239,68,68,0.2)] group-hover:text-red-500',
  orange: 'hover:border-orange-500/50 hover:shadow-[0_0_40px_-10px_rgba(249,115,22,0.2)] group-hover:text-orange-400',
};

const ctaColorMap: Record<string, string> = {
  green:  'text-green-500',
  amber:  'text-amber-400',
  sky:    'text-sky-400',
  red:    'text-red-500',
  orange: 'text-orange-400',
};

export default function HomeClient() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    try {
      const d = new Date();
      const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      if (localStorage.getItem('appstore_popup_dismissed') !== today) {
        setShowPopup(true);
      }
    } catch {}
  }, []);

  const handleClose = () => {
    setShowPopup(false);
    try {
      const d = new Date();
      const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      localStorage.setItem('appstore_popup_dismissed', today);
    } catch {}
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white font-sans flex flex-col items-center relative overflow-hidden">
      {showPopup && <AppStorePopup onClose={handleClose} />}

      {/* Arka plan ışık efekti */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-96 bg-red-600/8 blur-[140px] pointer-events-none" aria-hidden="true" />
      <div className="absolute top-48 left-1/4 w-64 h-64 bg-red-600/5 blur-[100px] pointer-events-none rounded-full" aria-hidden="true" />

      {/* Hero */}
      <div className="text-center mt-12 md:mt-20 mb-14 animate-in fade-in slide-in-from-bottom-4 duration-1000 relative z-10 w-full px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-center gap-5 mb-5">
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tighter bg-gradient-to-b from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">
            Futbol Trivia
          </h1>
          <div
            className="flex w-14 h-14 md:w-16 md:h-16 mx-auto md:mx-0 border-2 border-slate-800 rounded-2xl items-center justify-center bg-slate-900 rotate-12 shadow-xl shadow-black/40 shrink-0"
            aria-hidden="true"
          >
            <svg className="w-8 h-8 md:w-10 md:h-10 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17M14 14.66V17M18 4H6v7a6 6 0 0 0 12 0V4Z" />
            </svg>
          </div>
        </div>

        <p className="text-slate-500 text-sm md:text-base font-medium tracking-wide mb-7">
          Türkiye'nin en güncel futbol bilgi yarışması platformu
        </p>

        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-red-600/10 border border-red-500/20 mb-7 shadow-inner">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" aria-hidden="true" />
          <span className="text-sm md:text-base font-bold text-red-500 tracking-wide">Süper Lig Özel</span>
        </div>

        <p className="text-slate-400 text-base md:text-lg font-light italic max-w-lg mx-auto leading-relaxed">
          Her gün yenilenen sorularla futbol bilgini test et.
        </p>
      </div>

      {/* Oyun kartları */}
      <section aria-label="Oyunlar" className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl relative z-10 px-4">
        {GAMES.map((game) => {
          const hoverClass = accentMap[game.accentColor];
          const ctaColor = ctaColorMap[game.accentColor];
          const hoverTitleColor = ctaColor.replace('text-', 'group-hover:text-');
          return (
            <Link
              key={game.href}
              href={game.href}
              prefetch={false}
              className={`group relative overflow-hidden bg-slate-900/50 border border-slate-800/80 p-6 md:p-8 rounded-3xl transition-all duration-500 ${hoverClass}`}
            >
              <div className="relative z-10">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h2 className={`text-2xl md:text-3xl font-bold transition-colors duration-300 pt-1 text-white ${hoverTitleColor}`}>
                    {game.title}
                  </h2>
                  {game.icon}
                </div>

                <div className="space-y-2">
                  <p className="text-white/80 text-xs font-semibold tracking-wide">Nasıl oynanır?</p>
                  <p className="text-slate-400 text-sm leading-relaxed">{game.description}</p>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {game.detailHighlight
                      ? game.detail.split(game.detailHighlight).map((part, i, arr) =>
                          i < arr.length - 1 ? (
                            <span key={i}>{part}<span className="text-green-400 font-bold">{game.detailHighlight}</span></span>
                          ) : part
                        )
                      : game.detail}
                  </p>
                </div>

                <div className={`flex items-center text-xs font-bold tracking-wide mt-7 ${ctaColor}`} aria-hidden="true">
                  Hemen oyna
                  <span className="ml-2 transition-transform duration-300 group-hover:translate-x-2">→</span>
                </div>
              </div>

              <div
                className="absolute -right-4 -bottom-4 font-bebas text-[7rem] md:text-[8rem] font-black text-white/[0.03] pointer-events-none select-none leading-none"
                aria-hidden="true"
              >
                {game.decorNumber}
              </div>
            </Link>
          );
        })}
      </section>

      {/* SEO içerik bloğu */}
      <section aria-label="Platform hakkında" className="w-full max-w-5xl relative z-10 px-4 mt-20">
        <div className="border-t border-slate-900 pt-12 pb-4">
          <h2 className="text-slate-600 text-xs tracking-wide mb-8">FutbolTrivia hakkında</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-sm text-slate-600 leading-relaxed font-light mb-10">
            <div>
              <h3 className="text-slate-500 font-normal mb-3">Süper Lig odaklı içerik</h3>
              <p>
                FutbolTrivia, Süper Lig tarihine ve Türkiye'den geçmiş futbolculara odaklanan
                günlük bilgi yarışması platformudur. Milli takım kadroları, Avrupa kupalarındaki
                Türk kulüpleri, tarihin unutulmaz transferleri ve kariyer yolculukları soru
                havuzumuzun temelini oluşturur.
              </p>
            </div>
            <div>
              <h3 className="text-slate-500 font-normal mb-3">Her gün yenilenen beş oyun</h3>
              <p>
                Listeyi Tamamla, Top 10, Kariyer Yolu, Takım Arkadaşı ve Kadro Bul olmak üzere
                beş farklı oyun modülü her gün güncellenir. Her modül farklı bir futbol bilgisi
                boyutunu test eder: zamana karşı yarışma, istatistik listeleri, kariyer geçmişi,
                takım arkadaşlıkları ve 11 kişilik kadro tahminleri. Kayıt gerektirmez, ücretsizdir.
              </p>
            </div>
            <div>
              <h3 className="text-slate-500 font-normal mb-3">Kişisel istatistikler</h3>
              <p>
                Oyun başına tahmin dağılımın, kazanma yüzdesi ve günlük serilerin tarayıcında
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
              </p>
            </div>
            <div>
              <h3 className="text-slate-500 font-normal mb-3">Nasıl oynanır?</h3>
              <p>
                Ana sayfadaki beş oyundan birini seç ve oynamaya başla. Listeyi Tamamla'da
                90 saniyeyle yarışırsın, Top 10'da 3 yanlış hakkın vardır, Kariyer Yolu'nda
                kariyer tablosunu adım adım açarsın, Takım Arkadaşı'nda 7 tahmin hakkınla
                gizlenen futbolcuyu bulmaya çalışırsın. Kadro Bul'da ise gerçek bir maçın
                11 futbolcusunu Wordle mantığıyla tahmin edersin — her oyuncu için 6 hakkın var.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full mt-auto pt-16 pb-12 relative z-10 border-t border-slate-900/50">
        <div className="max-w-5xl mx-auto px-6">
          <nav
            aria-label="Alt navigasyon"
            className="flex flex-col md:flex-row items-center justify-center gap-y-4 md:gap-x-12 mb-10 text-sm font-medium text-slate-500"
          >
            <Link href="/hakkimizda" prefetch={false} className="hover:text-white transition-colors px-2">Hakkımızda</Link>
            <span className="hidden md:block text-slate-800" aria-hidden="true">•</span>
            <Link href="/sss" prefetch={false} className="hover:text-white transition-colors px-2">SSS</Link>
            <span className="hidden md:block text-slate-800" aria-hidden="true">•</span>
            <Link href="/iletisim" prefetch={false} className="hover:text-white transition-colors px-2">İletişim</Link>
            <span className="hidden md:block text-slate-800" aria-hidden="true">•</span>
            <Link href="/gizlilik" prefetch={false} className="hover:text-white transition-colors px-2">Gizlilik Politikası</Link>
            <span className="hidden md:block text-slate-800" aria-hidden="true">•</span>
            <Link href="/kullanim-sartlari" prefetch={false} className="hover:text-white transition-colors px-2">Kullanım Koşulları</Link>
          </nav>
          <p className="text-center text-slate-700 text-[10px] tracking-wide font-mono">
            © 2026 Futbol Trivia · Tüm hakları saklıdır.
          </p>
        </div>
      </footer>
    </main>
  );
}
