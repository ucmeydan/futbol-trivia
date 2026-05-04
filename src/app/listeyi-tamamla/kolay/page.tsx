import type { Metadata } from 'next';
import ListeyiTamamlaClient from '../ListeyiTamamlaClient';

export const metadata: Metadata = {
  title: 'Listeyi Tamamla — Kolay | FutbolTrivia',
  description: '90 saniyede listeyi tamamla. Kolay seviye — güncel Süper Lig bilgisiyle yarış, her doğru cevap +5 saniye.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://futboltrivia.com.tr/listeyi-tamamla/kolay' },
};

export default function ListeyiTamamlaKolayPage() {
  return (
    <>
      <ListeyiTamamlaClient difficulty="kolay" />

      <section className="max-w-2xl mx-auto px-6 py-12 text-slate-400 text-sm leading-relaxed space-y-4 border-t border-slate-900 mt-8">
        <h2 className="text-slate-500 text-xs font-bold tracking-[0.2em] uppercase mb-6">Listeyi Tamamla Kolay — Nasıl Oynanır?</h2>

        <p>
          Listeyi Tamamla Kolay seviyesinde Süper Lig'i düzenli takip eden bir taraftarın büyük bölümünü
          doldurabileceği listeler seni karşılar. Güncel kadro yapıları, bu sezonun öne çıkan isimleri,
          son yıllarda şampiyonluk yaşayan takımlar ve milli takımın tanıdık oyuncuları gibi konular ağırlıktadır.
        </p>

        <p>
          İlk harfi yazdığında 90 saniyelik geri sayım başlar. Her doğru cevap süreye 5 saniye ekler; bu da
          hızlı ve doğru düşünmeyi birlikte gerektiren bir denge kurar. Kolay seviyede listelerin büyük çoğunluğunu
          süre bitmeden tamamlamak mümkündür; yeter ki bildiklerini hızla yazabilesin.
        </p>

        <p>
          Otomatik tamamlama özelliği sayesinde aklındaki ismin tamamını yazmak zorunda değilsin. Birkaç harf
          yeterlidir; sistem sana uygun adayları listeler. Bu özellik özellikle uzun isimlerde ya da yazımı
          tam hatırlanamayan oyuncularda büyük zaman kazandırır.
        </p>

        <p>
          Kolay seviyede soru tipleri çeşitlidir: futbolcu listeleri, Türk kulüpleri, Avrupa takımları, teknik
          direktörler ve ülkeler gibi farklı kategoriler dönüşümlü olarak gelir. Her gün farklı bir kategori
          olduğundan hafızan her yönde sınanır.
        </p>

        <p>
          Arşiv navigasyonuyla önceki günlerin listelerine de ulaşabilirsin. Daha önce tamamlayamadığın bir
          listeye tekrar dönmek ve daha yüksek skor yapmak ayrı bir tatmin kaynağı olabilir. İstatistik ekranında
          en iyi skorunu ve ortalama doğru cevap sayını takip edebilirsin.
        </p>

        <p>
          Her gün yeni liste yayınlanır. Kolay seviyeyle başlayıp zaman baskısına alıştıktan sonra
          Zor seviyeyi de denemeni öneririz. Günlük sonucunu paylaşarak arkadaşlarına meydan okuyabilirsin.
        </p>
      </section>
    </>
  );
}
