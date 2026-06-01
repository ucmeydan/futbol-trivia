import type { Metadata } from 'next';
import DifficultySelector from '../components/DifficultySelector';

export const metadata: Metadata = {
  title: 'Takım Arkadaşı | FutbolTrivia',
  description:
    'Yolu Türkiye\'den geçmiş futbolcuları eski takım arkadaşlarından bul. 7 tahmin hakkı, her gün yeni oyuncu. Ücretsiz ve kayıtsız.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://futboltrivia.com.tr/takim-arkadasi' },
  openGraph: {
    title: 'Takım Arkadaşı | FutbolTrivia',
    description: 'Eski takım arkadaşlarından yola çıkarak gizlenen futbolcuyu bul. Her gün yeni soru.',
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

      {/* Statik SEO içeriği — Googlebot JavaScript olmadan görür */}
      <section className="max-w-md mx-auto px-4 py-10 border-t border-slate-900 mt-4">
        <h1 className="text-slate-500 text-sm font-semibold mb-4">Takım Arkadaşı Nedir?</h1>
        <div className="space-y-3 text-slate-600 text-xs leading-relaxed">
          <p>
            Takım Arkadaşı, yolu Türkiye&apos;den geçmiş futbolcuları kulüp veya milli takım
            kariyerindeki eski takım arkadaşlarından tahmin ettiğin günlük bir bilgi yarışması
            oyunudur. Her gün farklı bir futbolcu gizlenir ve beş ipucu ekrana sırayla gelir.
          </p>
          <p>
            Her yanlış tahminde yeni bir takım arkadaşı açılır. Tüm beş ipucu görünür hale
            geldikten sonra iki ek tahmin hakkın daha bulunur — toplamda 7 tahmin hakkınla doğru
            ismi bulmaya çalışırsın. Oyun bittiğinde her takım arkadaşının hangi takımda ve hangi
            sezonda birlikte oynadıkları da gösterilir.
          </p>
          <p>
            Süper Lig&apos;in farklı dönemlerinden oyuncular, Avrupa kulüplerinde Türk
            futbolcularla aynı takımda oynamış yabancı isimler ve milli takım tarihinin önemli
            figürleri sorularda karşına çıkabilir. İstatistik sayfasında 1&apos;den 7&apos;ye
            kadar kaçıncı tahminde bulduğunu gösteren dağılım grafiğini takip edebilirsin.
          </p>
          <p>
            Sorular her gece 00:00&apos;da yenilenir. Geçmiş günlerin sorularını arşiv
            navigasyonuyla tekrar oynayabilirsin. Kayıt gerekmez, tamamen ücretsizdir.
          </p>
        </div>
      </section>
    </>
  );
}
