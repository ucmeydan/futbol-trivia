import type { Metadata } from 'next';
import DifficultySelector from '../components/DifficultySelector';

export const metadata: Metadata = {
  title: 'Takım Arkadaşı | FutbolTrivia',
  description:
    'Yolu Türkiye\'den geçmiş futbolcuları eski takım arkadaşlarından bul. 5 ipucu, 5 tahmin hakkı. Her gün yeni oyuncu, ücretsiz ve kayıtsız.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://futboltrivia.com.tr/takim-arkadasi' },
  openGraph: {
    title: 'Takım Arkadaşı | FutbolTrivia',
    description:
      'Eski takım arkadaşlarından yola çıkarak gizlenen futbolcuyu bul. Her gün yeni soru.',
    url: 'https://futboltrivia.com.tr/takim-arkadasi',
    siteName: 'FutbolTrivia',
    locale: 'tr_TR',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Takım Arkadaşı',
  url: 'https://futboltrivia.com.tr/takim-arkadasi',
  description:
    'Yolu Türkiye\'den geçmiş futbolcuları kulüp veya milli takım kariyerindeki eski takım arkadaşlarından bulan günlük bilgi yarışması oyunu.',
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
      { '@type': 'ListItem', position: 2, name: 'Takım Arkadaşı', item: 'https://futboltrivia.com.tr/takim-arkadasi' },
    ],
  },
};

export default function TakimArkadasiPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <DifficultySelector gameSlug="takim-arkadasi" gameTitle="Takım Arkadaşı" />

      <section className="max-w-2xl mx-auto px-6 py-12 text-slate-400 text-sm leading-relaxed space-y-4">
        <h2 className="text-slate-500 text-xs font-bold tracking-[0.2em] uppercase mb-6">Takım Arkadaşı hakkında</h2>

        <p>
          Takım Arkadaşı, gizlenen futbolcuyu eski takım arkadaşlarından yola çıkarak bulmaya dayanan günlük bir bilgi yarışmasıdır.
          Her gün bir futbolcu belirlenir ve bu futbolcunun kariyeri boyunca birlikte oynadığı isimler sana ipucu olarak verilir.
        </p>

        <p>
          Oyunda 5 ipucu ve 7 tahmin hakkın bulunur. Her yanlış tahminde bir sonraki ipucu açılır. İpuçları genellikle zordan
          kolaya doğru ilerler. İlk çıkan oyuncular, genellikle hedef oyuncuyla kısa süre oynamış veya az bilinen bir takımda
          oynamış olurken, sonlarda çıkan oyuncular ise genellikle hedef oyuncunun en bilinen takımlarındaki takım arkadaşlarından oluşur.
        </p>

        <p>
          Kolay seviyede Süper Lig'de uzun süre oynamış ve Türk futbolseverler tarafından tanınan isimler yer alırken,
          Zor seviyede kariyerinin bir bölümünü Türkiye'de geçirmiş daha az bilinen futbolcular da karşına çıkabilir.
        </p>

        <p>
          Tahmin ekranında otomatik tamamlama mevcuttur; ismin bir kısmını yazdığında sistem sana uygun önerileri listeler.
          Eğer o an aklına herhangi bir oyuncu gelmiyorsa Pas Geç seçeneğini kullanabilirsin.
        </p>

        <p>
          Her gün yeni bir futbolcu eklenir. Arşiv sayesinde geçmiş soruları da oynayabilir, istatistik ekranında
          toplam oyun sayını ve en iyi serisini takip edebilirsin.
        </p>
      </section>
    </>
  );
}