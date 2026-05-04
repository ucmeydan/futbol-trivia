import type { Metadata } from 'next';
import ListeyiTamamlaClient from '../ListeyiTamamlaClient';

export const metadata: Metadata = {
  title: 'Listeyi Tamamla — Zor | FutbolTrivia',
  description: '90 saniyede listeyi tamamla. Zor seviye — Türk futbol tarihinin derinliklerine in, süre baskısıyla yarış.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://futboltrivia.com.tr/listeyi-tamamla/zor' },
};

export default function ListeyiTamamlaZorPage() {
  return (
    <>
      <ListeyiTamamlaClient difficulty="zor" />

      <section className="max-w-2xl mx-auto px-6 py-12 text-slate-400 text-sm leading-relaxed space-y-4 border-t border-slate-900 mt-8">
        <h2 className="text-slate-500 text-xs font-bold tracking-[0.2em] uppercase mb-6">Listeyi Tamamla Zor — Nasıl Oynanır?</h2>

        <p>
          Listeyi Tamamla Zor seviyesi, Türk futbolunun tarihsel birikimini derinlemesine bilen oyuncular
          için tasarlanmıştır. Sorular yalnızca güncel Süper Lig bilgisiyle çözülemez; 1980'lerden günümüze
          uzanan geniş bir dönemi, unutulmuş kulüpleri, eski dönemlerin efsane isimlerini ve Türkiye'de
          kısa süreli oynamış yabancı futbolcuları kapsar.
        </p>

        <p>
          Geri sayım yine 90 saniyeyle başlar ve her doğru cevap 5 saniye ekler. Ancak zor seviyede listelerin
          tamamını doldurmak çok daha nadir gerçekleşir. Süre bitmeden 7 veya 8 doğru bulmak bile ciddi bir
          futbol bilgisinin göstergesidir. Hedef listeyi bitirmek değil, süre dolmadan mümkün olduğunca çok
          doğru bulmaktır.
        </p>

        <p>
          Zor seviyede soru tipleri daha spesifik kategorileri kapsar: belirli bir teknik direktörün çalıştırdığı
          oyuncular, Avrupa kupalarında Türk kulüplerine karşı oynayan takımlar veya tarihin belli bir
          dönemindeki Süper Lig sezonlarına ait istatistikler gibi konular bu seviyenin özgün alanlarıdır.
        </p>

        <p>
          Otomatik tamamlama özelliği zor seviyede de aktiftir. Ancak öneri listesindeki isimler daha az
          tanıdık olduğundan doğru oyuncuyu bulmak ek çaba gerektirebilir. Birkaç farklı yazım denemesi
          yapmak bazen doğru önerinin çıkmasını sağlar.
        </p>

        <p>
          Arşiv navigasyonuyla önceki günlerin zor listelerine ulaşabilir ve süre baskısı olmadan hangi
          soruları bilebileceğini test edebilirsin. Bu sayede hem eğlenirsin hem de Türk futbol tarihine
          dair bilgini zenginleştirirsin.
        </p>

        <p>
          Zor seviyede yüksek skor yapmak gerçek bir başarıdır. Her gün yeni liste yayınlanır. Sonuçlarını
          paylaş ve Türk futbol tarihini en iyi bilenlerin arasında yerini al.
        </p>
      </section>
    </>
  );
}
