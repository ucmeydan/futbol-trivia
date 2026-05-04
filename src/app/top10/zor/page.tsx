import type { Metadata } from 'next';
import Top10Client from '../Top10Client';

export const metadata: Metadata = {
  title: 'Top 10 — Zor | FutbolTrivia',
  description: 'Süper Lig istatistik listelerini tamamla. Zor seviye — Türk futbol tarihinin derinliklerine in.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://futboltrivia.com.tr/top10/zor' },
};

export default function Top10ZorPage() {
  return (
    <>
      <Top10Client difficulty="zor" />

      <section className="max-w-2xl mx-auto px-6 py-12 text-slate-400 text-sm leading-relaxed space-y-4 border-t border-slate-900 mt-8">
        <h2 className="text-slate-500 text-xs font-bold tracking-[0.2em] uppercase mb-6">Top 10 Zor — Nasıl Oynanır?</h2>

        <p>
          Top 10 Zor seviyesi, Türk futbolunun tarihsel derinliğine hakim olanlar için tasarlanmıştır. Sorular
          Süper Lig'in kuruluşundan günümüze uzanan geniş bir dönemi kapsar; 1990'ların gol krallığı yarışından
          Türkiye Kupası'nın en verimli dönemlerine, tarihi derbilerin istatistiklerine kadar onlarca konu masaya yatırılır.
        </p>

        <p>
          Zor seviyede cevapların büyük bölümü yalnızca belirli bir dönemi yakından takip etmiş Süper Lig meraklılarına
          tanıdık gelecektir. Kısa süre Türkiye'de oynayan yabancı futbolcular, onlarca yıl öncesinin teknik direktörleri
          veya ligde yalnızca birkaç sezon kalan kulüpler de listeye girebilir.
        </p>

        <p>
          Oyun mekaği kolay seviyeyle aynıdır: 10 boş alanı doldurmaya çalışırsın, 3 hata hakkın vardır. Ancak
          otomatik tamamlama önerileri çok daha geniş bir havuzdan gelir; bu yüzden doğru ismi bulmak için biraz
          daha fazla düşünmen gerekebilir.
        </p>

        <p>
          İpucu modu açıkken her cevabın harf sayısını görebilirsin. Zor seviyede bu ipucu özellikle eski dönem
          oyuncularının isimlerini hatırlamaya çalışırken işe yarar. Arşiv navigasyonuyla geçmiş günlerin zor
          sorularına da ulaşabilir, daha önce bitiremediğin listeleri tamamlamayı deneyebilirsin.
        </p>

        <p>
          Top 10 Zor seviyesinde başarılı olmak için Transfermarkt, Mackolik ve TFF resmi istatistikleri gibi
          kaynaklara aşina olmak büyük avantaj sağlar. Sorular bu veri tabanlarına dayandığından geçmiş sezon
          rakamlarını takip edenler öne çıkacaktır.
        </p>

        <p>
          Her gün yeni bir soru yayınlanır. Zor soruları art arda doğru yanıtlamak, futbol bilginin ne kadar
          derin olduğunun gerçek bir göstergesidir. Günlük sonucunu paylaşarak arkadaşlarına meydan okuyabilirsin.
        </p>
      </section>
    </>
  );
}
