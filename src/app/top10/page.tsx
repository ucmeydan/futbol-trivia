import type { Metadata } from 'next';
import DifficultySelector from '../components/DifficultySelector';

export const metadata: Metadata = {
  title: 'Top 10 | FutbolTrivia',
  description:
    'Süper Lig ve Türk futboluna ait istatistik listelerini tamamla. Belirli bir kategorideki 10 ismi bul, 3 yanlış hakkın var. Her gün yeni soru.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://futboltrivia.com.tr/top10' },
  openGraph: {
    title: 'Top 10 | FutbolTrivia',
    description:
      'Süper Lig istatistik listelerini tamamla. Her gün yeni soru, 3 yanlış hakkın var.',
    url: 'https://futboltrivia.com.tr/top10',
    siteName: 'FutbolTrivia',
    locale: 'tr_TR',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Top 10',
  url: 'https://futboltrivia.com.tr/top10',
  description:
    'Süper Lig ve Türk futboluna ait istatistik listelerini tamamlayan günlük bilgi yarışması oyunu.',
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
      { '@type': 'ListItem', position: 2, name: 'Top 10', item: 'https://futboltrivia.com.tr/top10' },
    ],
  },
};

export default function Top10Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <DifficultySelector gameSlug="top10" gameTitle="Top 10" />

      <section className="max-w-2xl mx-auto px-6 py-12 text-slate-400 text-sm leading-relaxed space-y-4">
        <h2 className="text-slate-500 text-xs font-bold tracking-[0.2em] uppercase mb-6">Top 10 hakkında</h2>

        <p>
          Top 10, Süper Lig ve Türk futbol tarihine ait istatistik listelerini tamamlamaya dayanan günlük bir bilgi yarışmasıdır.
          Her gün yeni bir soru yayınlanır ve senden belirli bir kategorideki 10 ismi bulman beklenir; en çok gol atan
          oyunculardan en çok maça çıkan teknik direktörlere, derbilerde en fazla galibiyet alan isimlere kadar onlarca farklı konu ele alınır.
        </p>

        <p>
          Oyunun iki zorluk seviyesi vardır. Kolay seviyede güncel Süper Lig bilgisi yeterli olurken, Zor seviyede
          Türk futbolunun tarihi derinliklerine inmek gerekir. Her iki seviyede de soruların kaynağı; Transfermarkt,
          Mackolik ve resmi lig istatistikleri gibi güvenilir veri tabanlarıdır.
        </p>

        <p>
          Oyunu "İpucu açık" veya "İpucu kapalı" olmak üzere iki farklı modda oynayabilirsin. İpucu açık olan oyunda cevapların harf sayılarını görebilirsin.
        </p>

        <p>
          Oyunu oynamak için herhangi bir hesap oluşturmana gerek yoktur. Tahminlerini yazmaya başladığında
          otomatik tamamlama devreye girer ve sana uygun isimler önerilir. 3 yanlış tahmin hakkın vardır;
          bunları doldurmadan önce 10 ismin tamamını bulmayı başarırsan o günkü soruyu kazanmış sayılırsın.
        </p>

        <p>
          İstatistik sayfasında toplam oyun sayını, kazandığın oyunları ve galibiyet serini takip edebilirsin.
          Günlük sonuçlarını sosyal medyada paylaşarak arkadaşlarınla kıyaslama yapabilirsin.
          Arşiv navigasyonu sayesinde geçmiş günlerin sorularına da ulaşabilirsin.
        </p>

        <p>
          Sorular her gün 00:00'da güncellenir. Süper Lig sezonunun tamamı, Türkiye Kupası, milli takım ve Avrupa
          kupalarındaki Türk kulüpleri de kapsam dahilindedir.
        </p>
      </section>
    </>
  );
}