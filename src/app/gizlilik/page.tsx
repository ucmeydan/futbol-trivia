import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Gizlilik Politikası | FutbolTrivia',
  description:
    "FutbolTrivia'nın gizlilik politikası: veri toplama, çerez kullanımı, Google AdSense reklamları ve kullanıcı hakları hakkında kapsamlı bilgi.",
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://futboltrivia.com.tr/gizlilik' },
  openGraph: {
    title: 'Gizlilik Politikası | FutbolTrivia',
    description: 'FutbolTrivia gizlilik politikası ve kullanıcı veri hakları.',
    url: 'https://futboltrivia.com.tr/gizlilik',
    siteName: 'FutbolTrivia',
    locale: 'tr_TR',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Gizlilik Politikası',
  url: 'https://futboltrivia.com.tr/gizlilik',
  description: 'FutbolTrivia gizlilik politikası ve kullanıcı veri hakları.',
  inLanguage: 'tr',
  isPartOf: {
    '@type': 'WebSite',
    name: 'FutbolTrivia',
    url: 'https://futboltrivia.com.tr',
  },
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Ana Sayfa', item: 'https://futboltrivia.com.tr' },
      { '@type': 'ListItem', position: 2, name: 'Gizlilik Politikası', item: 'https://futboltrivia.com.tr/gizlilik' },
    ],
  },
};

function SectionTitle({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="flex items-start gap-3 text-white font-normal text-lg mb-4 leading-snug">
      <span className="mt-1 shrink-0 w-0.5 h-5 bg-red-600 rounded-full" aria-hidden="true" />
      {children}
    </h2>
  );
}

export default function GizlilikPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-red-900/40">
        <div className="max-w-2xl mx-auto px-6 py-10 flex flex-col">

          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-2 text-xs text-slate-600 tracking-wide">
              <li><Link href="/" className="hover:text-red-500 transition-colors">Ana sayfa</Link></li>
              <li aria-hidden="true" className="text-slate-800">›</li>
              <li className="text-slate-500" aria-current="page">Gizlilik politikası</li>
            </ol>
          </nav>

          <header className="mb-12">
            <p className="text-xs text-red-600 tracking-[0.2em] uppercase font-medium mb-3">Yasal</p>
            <h1 className="text-4xl font-light text-white tracking-tight mb-4">Gizlilik Politikası</h1>
            <p className="text-slate-500 text-sm">Son güncelleme: 25 Mart 2026 &nbsp;·&nbsp; Sürüm 1.1</p>
          </header>

          <section className="mb-10">
            <p className="leading-relaxed font-light">
              FutbolTrivia olarak kullanıcı gizliliğine saygı duyuyoruz. Bu sayfa,{' '}
              <strong className="text-slate-200 font-normal">futboltrivia.com.tr</strong>{' '}
              adresinde hangi verilerin toplandığını, nasıl kullanıldığını ve haklarınızın neler
              olduğunu açıklamaktadır. Sitemizi kullanmaya devam ederek bu politikayı kabul etmiş
              sayılırsınız.
            </p>
          </section>

          <div className="space-y-10 text-base leading-relaxed font-light">

            <section aria-labelledby="veri-toplama">
              <SectionTitle id="veri-toplama">Toplanan veriler</SectionTitle>
              <p className="mb-3">
                FutbolTrivia herhangi bir kişisel kimlik bilgisi toplamaz ve sunuculara göndermez.
                Oyun istatistikleri (toplam oyun sayısı, günlük seri, tahmin dağılımı), günlük
                katılım durumları ve kullanıcı tercihleri yalnızca tarayıcınızdaki{' '}
                <code className="text-red-400 text-sm bg-slate-900 px-1.5 py-0.5 rounded">localStorage</code>{' '}
                alanında saklanır.
              </p>
              <p>
                Bu veriler cihazınızdan dışarıya aktarılmaz, üçüncü taraflarla paylaşılmaz.
                Tarayıcı verilerini temizlediğinizde istatistikleriniz sıfırlanır.
              </p>
            </section>

            <section aria-labelledby="cerezler">
              <SectionTitle id="cerezler">Çerezler (cookies)</SectionTitle>
              <p className="mb-3">
                Sitemiz birinci taraf çerez kullanmamaktadır. Ancak Google AdSense aracılığıyla
                sunulan reklamlar üçüncü taraf çerezler kullanabilir. Bu çerezler aşağıdaki
                amaçlarla kullanılabilir:
              </p>
              <ul className="space-y-2 pl-4 border-l border-slate-800">
                <li className="flex gap-2">
                  <span className="text-red-700 mt-1 shrink-0">–</span>
                  İlgi alanlarınıza uygun reklamların gösterilmesi (kişiselleştirilmiş reklam)
                </li>
                <li className="flex gap-2">
                  <span className="text-red-700 mt-1 shrink-0">–</span>
                  Reklam tıklama ve gösterim sayımı (istatistiksel amaçlı)
                </li>
                <li className="flex gap-2">
                  <span className="text-red-700 mt-1 shrink-0">–</span>
                  Dolandırıcılığın önlenmesi ve reklam kalitesinin iyileştirilmesi
                </li>
              </ul>
              <p className="mt-3 text-slate-500 text-sm">
                Tarayıcı ayarlarınızdan çerezleri devre dışı bırakabilirsiniz. Bu işlem siteyi
                kullanımınızı etkilemez, ancak reklamlar kişiselleştirilmeyebilir.
              </p>
            </section>

            <section aria-labelledby="reklamlar">
              <SectionTitle id="reklamlar">Google AdSense ve reklamlar</SectionTitle>
              <p className="mb-3">
                FutbolTrivia, içeriğin ücretsiz sunulabilmesi için Google AdSense reklam platformunu
                kullanmaktadır. Google LLC, Amerika Birleşik Devletleri merkezli bir şirket olup
                IAB Avrupa'nın Şeffaflık ve Rıza Çerçevesi'ne (TCF) uymaktadır.
              </p>
              <p className="mb-3">
                Google'ın reklam çerezlerini nasıl kullandığı hakkında ayrıntılı bilgiye{' '}
                <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-red-500 hover:text-red-400 underline underline-offset-2 transition-colors">
                  Google Reklam Politikası
                </a>{' '}
                sayfasından ulaşabilirsiniz.
              </p>
              <p>
                Kişiselleştirilmiş reklamları devre dışı bırakmak için{' '}
                <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-red-500 hover:text-red-400 underline underline-offset-2 transition-colors">
                  Google Reklam Ayarları
                </a>{' '}
                sayfasını ziyaret edebilirsiniz.
              </p>
            </section>

            <section aria-labelledby="ucuncu-taraf">
              <SectionTitle id="ucuncu-taraf">Üçüncü taraf bağlantılar</SectionTitle>
              <p>
                FutbolTrivia yalnızca kendi içeriğine yönelik gizlilik sorumluluğunu üstlenir.
                Sitede yer alan harici bağlantılar kendi gizlilik koşullarına tabidir. Bu
                bağlantıları kullanmadan önce ilgili sitelerin politikalarını incelemenizi öneririz.
              </p>
            </section>

            <section aria-labelledby="cocuklar">
              <SectionTitle id="cocuklar">Çocukların gizliliği</SectionTitle>
              <p>
                FutbolTrivia, 13 yaşın altındaki çocuklardan bilerek veri toplamaz. Sitenin
                herhangi bir bölümünde 13 yaş altı bir kullanıcıya ait veri bulunduğunu
                düşünüyorsanız lütfen bizimle iletişime geçin; söz konusu verileri derhal
                kaldıracağız.
              </p>
            </section>

            <section aria-labelledby="degisiklikler">
              <SectionTitle id="degisiklikler">Politika değişiklikleri</SectionTitle>
              <p>
                Bu gizlilik politikası zaman zaman güncellenebilir. Önemli değişikliklerde sayfa
                üstündeki "Son güncelleme" tarihi revize edilir. Siteyi düzenli olarak ziyaret
                ederek güncel politikayı incelemenizi tavsiye ederiz.
              </p>
            </section>

            <section aria-labelledby="iletisim-gizlilik">
              <SectionTitle id="iletisim-gizlilik">İletişim</SectionTitle>
              <p className="mb-3">
                Gizlilik politikamız hakkında sorularınız, veri silme talepleriniz veya herhangi
                bir geri bildiriminiz için aşağıdaki e-posta adresi üzerinden bizimle iletişime
                geçebilirsiniz:
              </p>
              <a href="mailto:futboltriviatr@gmail.com" className="inline-flex items-center gap-2 text-red-500 hover:text-red-400 transition-colors text-sm">
                <span>futboltriviatr@gmail.com</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </a>
            </section>

          </div>

          <nav aria-label="İlgili sayfalar" className="mt-14 pt-8 border-t border-slate-900">
            <p className="text-xs text-slate-600 tracking-widest uppercase mb-4">Ayrıca bakınız</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/hakkimizda" className="text-sm text-slate-500 hover:text-slate-300 border border-slate-800 hover:border-slate-700 px-4 py-2 rounded-full transition-all">Hakkımızda</Link>
              <Link href="/iletisim" className="text-sm text-slate-500 hover:text-slate-300 border border-slate-800 hover:border-slate-700 px-4 py-2 rounded-full transition-all">İletişim</Link>
              <Link href="/" className="text-sm text-slate-500 hover:text-slate-300 border border-slate-800 hover:border-slate-700 px-4 py-2 rounded-full transition-all">Ana sayfa</Link>
            </div>
          </nav>

          <footer className="mt-10 pb-10">
            <p className="text-[10px] text-slate-800 tracking-widest uppercase">
              © 2026 FutbolTrivia · Son güncelleme: 25 Mart 2026 · Sürüm 1.1
            </p>
          </footer>

        </div>
      </div>
    </>
  );
}
