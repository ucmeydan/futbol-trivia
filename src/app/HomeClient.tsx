'use client';

import Link from 'next/link';
import { useTheme } from './ThemeProvider';

type IconFn = (isDark: boolean) => React.ReactNode;

const GAMES: {
  href: string;
  title: string;
  description: string;
  detail: string;
  detailHighlight: string | null;
  decorNumber: string;
  accentColor: string;
  icon: IconFn;
}[] = [
  {
    href: '/listeyi-tamamla',
    title: 'Listeyi Tamamla',
    description: 'Günlük soruda kaç doğru cevap bulabilirsin? Tahmin yazmaya başladıktan sonra 90 saniyelik süren başlayacak.',
    detail: 'Her doğru cevap sana +5 saniye kazandırır.',
    detailHighlight: '+5 saniye',
    decorNumber: '90',
    accentColor: 'green',
    icon: (isDark) => (
      <div className="absolute top-0 right-0 w-16 h-16 md:w-20 md:h-20 flex items-center justify-center opacity-90 shrink-0">
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36" aria-hidden="true">
          <path className={isDark ? 'text-slate-800' : 'text-slate-200'} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <path className="text-green-500" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray="80, 100" strokeLinecap="round" />
        </svg>
        <div className={`font-bebas text-3xl md:text-4xl relative z-10 tracking-tighter ${isDark ? 'text-white' : 'text-slate-700'}`} aria-hidden="true">90</div>
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
    icon: (isDark) => (
      <div className={`absolute top-0 right-0 w-14 h-14 md:w-16 md:h-16 flex flex-col gap-1 md:gap-1.5 p-2 md:p-3 rounded-xl border opacity-90 shrink-0 ${isDark ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-100 border-slate-200'}`} aria-hidden="true">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-1 md:gap-1.5 items-center">
            <div className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-sm ${i < 2 ? 'bg-amber-400' : isDark ? 'bg-slate-700' : 'bg-slate-300'}`} />
            <div className={`h-1.5 md:h-2 flex-grow rounded ${i < 2 ? (isDark ? 'bg-white/80' : 'bg-slate-600/80') : isDark ? 'bg-slate-800' : 'bg-slate-200'}`} />
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
    icon: (isDark) => (
      <div className={`absolute top-0 right-0 w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-xl border opacity-90 shrink-0 ${isDark ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-100 border-slate-200'}`} aria-hidden="true">
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
    icon: (isDark) => (
      <div className={`absolute top-0 right-0 w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-xl border opacity-90 shrink-0 ${isDark ? 'bg-slate-950/50 border-slate-800' : 'bg-slate-100 border-slate-200'}`} aria-hidden="true">
        <svg className="w-7 h-7 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="9" cy="7" r="3" strokeLinecap="round" />
          <path d="M3 20c0-4 2.7-6 6-6s6 2 6 6" strokeLinecap="round" />
          <circle cx="17" cy="7" r="3" strokeLinecap="round" />
          <path d="M14 20c0-2.5 1.2-4 3-5" strokeLinecap="round" />
        </svg>
      </div>
    ),
  },
];

const accentMap: Record<string, string> = {
  green: 'hover:border-green-500/50 hover:shadow-[0_0_40px_-10px_rgba(34,197,94,0.2)] group-hover:text-green-400',
  amber: 'hover:border-amber-400/50 hover:shadow-[0_0_40px_-10px_rgba(251,191,36,0.2)] group-hover:text-amber-400',
  sky:   'hover:border-sky-500/50 hover:shadow-[0_0_40px_-10px_rgba(14,165,233,0.2)] group-hover:text-sky-400',
  red:   'hover:border-red-500/50 hover:shadow-[0_0_40px_-10px_rgba(239,68,68,0.2)] group-hover:text-red-500',
};

const ctaColorMap: Record<string, string> = {
  green: 'text-green-500',
  amber: 'text-amber-400',
  sky:   'text-sky-400',
  red:   'text-red-500',
};

export default function HomeClient() {
  const { isDark, toggle: toggleTheme } = useTheme();

  const th = isDark ? {
    page: 'bg-slate-950 text-white',
    titleGradient: 'from-white via-slate-200 to-slate-500',
    badge: 'bg-red-600/10 border-red-500/20',
    badgeText: 'text-red-500',
    tagline: 'text-slate-400',
    subtitle: 'text-slate-500',
    card: 'bg-slate-900/50 border-slate-800/80',
    cardTitle: 'text-white',
    cardLabel: 'text-white/80',
    cardText: 'text-slate-400',
    decorNum: 'text-white/[0.03]',
    seoSection: 'border-slate-900',
    seoHeading: 'text-slate-600',
    seoSubHeading: 'text-slate-500',
    seoText: 'text-slate-600',
    footerBorder: 'border-slate-900/50',
    footerNav: 'text-slate-500 hover:text-white',
    footerDot: 'text-slate-800',
    footerCopy: 'text-slate-700',
    toggle: 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700',
    logoBox: 'border-slate-800 bg-slate-900 shadow-black/40',
  } : {
    page: 'bg-slate-50 text-slate-900',
    titleGradient: 'from-slate-900 via-slate-700 to-slate-500',
    badge: 'bg-red-50 border-red-200',
    badgeText: 'text-red-600',
    tagline: 'text-slate-700',
    subtitle: 'text-slate-500',
    card: 'bg-white border-slate-200 shadow-sm',
    cardTitle: 'text-slate-900',
    cardLabel: 'text-slate-600',
    cardText: 'text-slate-600',
    decorNum: 'text-slate-900/[0.04]',
    seoSection: 'border-slate-200',
    seoHeading: 'text-slate-500',
    seoSubHeading: 'text-slate-600',
    seoText: 'text-slate-600',
    footerBorder: 'border-slate-200',
    footerNav: 'text-slate-400 hover:text-slate-900',
    footerDot: 'text-slate-300',
    footerCopy: 'text-slate-400',
    toggle: 'bg-white border-slate-300 text-slate-600 hover:bg-slate-100 shadow-sm',
    logoBox: 'border-slate-200 bg-white shadow-black/10',
  };

  return (
    <main className={`min-h-screen ${th.page} font-sans flex flex-col items-center relative overflow-hidden transition-colors duration-300`}>

      {/* Arka plan ışık efekti */}
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full h-96 ${isDark ? 'bg-red-600/8' : 'bg-red-600/4'} blur-[140px] pointer-events-none`} aria-hidden="true" />
      <div className={`absolute top-48 left-1/4 w-64 h-64 ${isDark ? 'bg-red-600/5' : 'bg-red-600/3'} blur-[100px] pointer-events-none rounded-full`} aria-hidden="true" />

      {/* Tema toggle butonu */}
      <button
        onClick={toggleTheme}
        className={`absolute top-4 right-4 z-20 w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-200 ${th.toggle}`}
        aria-label={isDark ? 'Açık moda geç' : 'Koyu moda geç'}
      >
        {isDark ? (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
        ) : (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79Z" />
          </svg>
        )}
      </button>

      {/* Hero */}
      <div className="text-center mt-12 md:mt-20 mb-14 animate-in fade-in slide-in-from-bottom-4 duration-1000 relative z-10 w-full px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-center gap-5 mb-5">
          <h1 className={`text-5xl md:text-7xl font-semibold tracking-tighter bg-gradient-to-b ${th.titleGradient} bg-clip-text text-transparent`}>
            Futbol Trivia
          </h1>
          <div
            className={`flex w-14 h-14 md:w-16 md:h-16 mx-auto md:mx-0 border-2 ${th.logoBox} rounded-2xl items-center justify-center rotate-12 shadow-xl shrink-0`}
            aria-hidden="true"
          >
            <svg className="w-8 h-8 md:w-10 md:h-10 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17M14 14.66V17M18 4H6v7a6 6 0 0 0 12 0V4Z" />
            </svg>
          </div>
        </div>

        <p className={`text-sm md:text-base font-medium tracking-wide mb-7 ${th.subtitle}`}>
          Türkiye'nin en güncel futbol bilgi yarışması platformu
        </p>

        <div className={`inline-flex items-center gap-3 px-5 py-2 rounded-full ${th.badge} border mb-7 shadow-inner`}>
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" aria-hidden="true" />
          <span className={`text-sm md:text-base font-bold ${th.badgeText} tracking-wide`}>Süper Lig Özel</span>
        </div>

        <p className={`text-base md:text-lg font-light italic max-w-lg mx-auto leading-relaxed ${th.tagline}`}>
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
              className={`group relative overflow-hidden ${th.card} border p-6 md:p-8 rounded-3xl transition-all duration-500 ${hoverClass}`}
            >
              <div className="relative z-10">
                {game.icon(isDark)}

                <h2 className={`text-2xl md:text-3xl font-bold mb-3 transition-colors duration-300 pt-1 pr-20 ${th.cardTitle} ${hoverTitleColor}`}>
                  {game.title}
                </h2>

                <div className="space-y-2 pr-20">
                  <p className={`text-xs font-semibold uppercase tracking-widest ${th.cardLabel}`}>Nasıl oynanır?</p>
                  <p className={`text-sm leading-relaxed ${th.cardText}`}>{game.description}</p>
                  <p className={`text-sm leading-relaxed ${th.cardText}`}>
                    {game.detailHighlight
                      ? game.detail.split(game.detailHighlight).map((part, i, arr) =>
                          i < arr.length - 1 ? (
                            <span key={i}>{part}<span className="text-green-400 font-bold">{game.detailHighlight}</span></span>
                          ) : part
                        )
                      : game.detail}
                  </p>
                </div>

                <div className={`flex items-center text-xs font-bold tracking-widest mt-7 ${ctaColor}`} aria-hidden="true">
                  HEMEN OYNA
                  <span className="ml-2 transition-transform duration-300 group-hover:translate-x-2">→</span>
                </div>
              </div>

              <div
                className={`absolute -right-4 -bottom-4 font-bebas text-[7rem] md:text-[8rem] font-black ${th.decorNum} pointer-events-none select-none leading-none`}
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
        <div className={`border-t ${th.seoSection} pt-12 pb-4`}>
          <h2 className={`text-xs tracking-[0.2em] uppercase mb-8 ${th.seoHeading}`}>FutbolTrivia hakkında</h2>

          <div className={`grid grid-cols-1 md:grid-cols-3 gap-10 text-sm leading-relaxed font-light mb-10 ${th.seoText}`}>
            <div>
              <h3 className={`font-normal mb-3 ${th.seoSubHeading}`}>Süper Lig odaklı içerik</h3>
              <p>
                FutbolTrivia, Süper Lig tarihine ve Türkiye'den geçmiş futbolculara odaklanan
                günlük bilgi yarışması platformudur. Milli takım kadroları, Avrupa kupalarındaki
                Türk kulüpleri, tarihin unutulmaz transferleri ve kariyer yolculukları soru
                havuzumuzun temelini oluşturur.
              </p>
            </div>
            <div>
              <h3 className={`font-normal mb-3 ${th.seoSubHeading}`}>Her gün yenilenen dört oyun</h3>
              <p>
                Listeyi Tamamla, Top 10, Kariyer Yolu ve Takım Arkadaşı olmak üzere dört farklı
                oyun modülü her gün güncellenir. Her modül farklı bir futbol bilgisi boyutunu
                test eder: zamana karşı yarışma, istatistik listeleri, kariyer geçmişi ve
                takım arkadaşlıkları. Kayıt gerektirmez, ücretsizdir.
              </p>
            </div>
            <div>
              <h3 className={`font-normal mb-3 ${th.seoSubHeading}`}>Kişisel istatistikler</h3>
              <p>
                Oyun başına tahmin dağılımın, kazanma yüzden ve günlük serilerin tarayıcında
                saklanır. Her oturumda kendi gelişimini takip edebilir, hangi oyun modülünde
                daha güçlü olduğunu görebilirsin. Arşiv navigasyonuyla geçmiş soruları
                tekrar oynayarak kaçırdığın günleri tamamlayabilirsin.
              </p>
            </div>
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-2 gap-10 text-sm leading-relaxed font-light ${th.seoText}`}>
            <div>
              <h3 className={`font-normal mb-3 ${th.seoSubHeading}`}>Türk futbolunun tarihi</h3>
              <p>
                Sorularımız yalnızca güncel sezonu değil, Süper Lig'in kuruluşundan bugüne
                uzanan geniş bir dönemi kapsar. 1959'dan itibaren Türk futbolunda iz bırakan
                kulüpler, efsane oyuncular ve tarihin dönüm noktaları soru havuzumuzda yer alır.
              </p>
            </div>
            <div>
              <h3 className={`font-normal mb-3 ${th.seoSubHeading}`}>Nasıl oynanır?</h3>
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
      <footer className={`w-full mt-auto pt-16 pb-12 relative z-10 border-t ${th.footerBorder}`}>
        <div className="max-w-5xl mx-auto px-6">
          <nav
            aria-label="Alt navigasyon"
            className={`flex flex-col md:flex-row items-center justify-center gap-y-4 md:gap-x-12 mb-10 text-sm font-medium ${th.footerNav}`}
          >
            <Link href="/hakkimizda" className="transition-colors px-2">Hakkımızda</Link>
            <span className={`hidden md:block ${th.footerDot}`} aria-hidden="true">•</span>
            <Link href="/iletisim" className="transition-colors px-2">İletişim</Link>
            <span className={`hidden md:block ${th.footerDot}`} aria-hidden="true">•</span>
            <Link href="/gizlilik" className="transition-colors px-2">Gizlilik Politikası</Link>
          </nav>
          <p className={`text-center text-[10px] tracking-[0.3em] uppercase font-mono ${th.footerCopy}`}>
            © 2026 Futbol Trivia · Tüm hakları saklıdır.
          </p>
        </div>
      </footer>
    </main>
  );
}
