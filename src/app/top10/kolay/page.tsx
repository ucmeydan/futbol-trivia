import type { Metadata } from 'next';
import Top10Client from '../Top10Client';

export const metadata: Metadata = {
  title: 'Top 10 — Kolay | FutbolTrivia',
  description: 'Süper Lig istatistik listelerini tamamla. Kolay seviye — güncel Süper Lig bilgisiyle oyna.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://futboltrivia.com.tr/top10/kolay' },
};

export default function Top10KolayPage() {
  return (
    <>
      <Top10Client difficulty="kolay" />

      <section className="max-w-2xl mx-auto px-6 py-12 text-slate-400 text-sm leading-relaxed space-y-4 border-t border-slate-900 mt-8">
        <h2 className="text-slate-500 text-xs font-bold tracking-[0.2em] uppercase mb-6">Top 10 Kolay — Nasıl Oynanır?</h2>

        <p>
          Top 10 Kolay seviyesinde güncel Süper Lig bilgin ön plana çıkar. Sorular büyük ölçüde son birkaç sezonu
          kapsayan istatistikler üzerine kurulur: sezonun gol krallığı yarışı, şampiyonluk yaşayan takımlar,
          en fazla kez milli formayı giyen oyuncular veya bu sezon en çok asist yapan isimler gibi konular seni karşılar.
        </p>

        <p>
          Oyun başladığında sana bir soru ve on boş alan gösterilir. Arama kutusuna tahminini yazmaya başladığında
          otomatik tamamlama devreye girer ve sana uygun isimler önerilir. Doğru cevabı seçtiğinde ilgili alan dolar,
          yanlış tahminde ise bir hata hakkın gider. Toplam 3 hata hakkın vardır.
        </p>

        <p>
          İpucu modunu açarsan her cevabın kaç harften oluştuğunu görebilirsin. Bu özellik özellikle listenin son
          birkaç boşluğunu doldururken işe yarar. Kolay seviyede sorular güncel Süper Lig sezonunu, Türkiye Kupası'nı
          ve milli takım istatistiklerini kapsar.
        </p>

        <p>
          Her gün saat 00:00'da yeni bir soru yayınlanır. Günlük soruyu tamamladıktan sonra arşiv navigasyonu
          ile önceki günlerin sorularına ulaşabilirsin. İstatistik sayfasında toplam oynadığın gün sayısını,
          kazandığın oyunları ve en uzun galibiyet serini takip edebilirsin.
        </p>

        <p>
          Kolay seviyede başarılı olmak için Süper Lig'in güncel kadro yapısını, bu sezonun öne çıkan isimlerini
          ve son birkaç yılın şampiyon takımlarını bilmek yeterlidir. Günlük sonucunu paylaş butonuyla skoru
          sosyal medyada paylaşarak arkadaşlarınla kıyaslayabilirsin.
        </p>

        <p>
          Top 10 Kolay, hem Süper Lig'i yakından takip eden taraftarlar için hem de futbolu genel olarak seven
          herkes için uygundur. Soruları kaçırmamak için her gün siteye uğramayı unutma.
        </p>
      </section>
    </>
  );
}
