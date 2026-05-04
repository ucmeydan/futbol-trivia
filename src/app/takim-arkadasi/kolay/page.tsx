import type { Metadata } from 'next';
import TakimArkadasiClient from '../TakimArkadasiClient';

export const metadata: Metadata = {
  title: 'Takım Arkadaşı — Kolay | FutbolTrivia',
  description: 'Eski takım arkadaşlarından gizlenen futbolcuyu bul. Kolay seviye — tanıdık isimler, net ipuçları.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://futboltrivia.com.tr/takim-arkadasi/kolay' },
};

export default function TakimArkadasiKolayPage() {
  return (
    <>
      <TakimArkadasiClient difficulty="kolay" />

      <section className="max-w-2xl mx-auto px-6 py-12 text-slate-400 text-sm leading-relaxed space-y-4 border-t border-slate-900 mt-8">
        <h2 className="text-slate-500 text-xs font-bold tracking-[0.2em] uppercase mb-6">Takım Arkadaşı Kolay — Nasıl Oynanır?</h2>

        <p>
          Takım Arkadaşı Kolay seviyesinde Süper Lig taraftarlarının büyük çoğunluğunun tanıyacağı futbolcular
          yer alır. Galatasaray, Fenerbahçe, Beşiktaş ve Trabzonspor gibi büyük kulüplerde uzun yıllar oynamış;
          milli takımın değişmez isimleri haline gelmiş ya da Türkiye'de kariyer zirvesini yaşamış oyuncular
          bu seviyenin temel profilini oluşturur.
        </p>

        <p>
          Her soruda gizlenen futbolcuyla kariyer boyunca birlikte oynamış 5 takım arkadaşı sana ipucu olarak
          sunulur. İpuçları zordan kolaya doğru sıralanır: ilk açılan takım arkadaşı genellikle hedef oyuncuyu
          en az hatırlatandır. Son açılan ipucu ise çoğu zaman herkesin bildiği bir isimdir.
        </p>

        <p>
          Toplam 5 tahmin hakkın vardır. Her yanlış tahminde bir sonraki ipucu otomatik olarak açılır. Arama
          kutusuna ismi yazmaya başladığında sistem sana uygun önerileri listeler; tam ismi bilmesen bile
          birkaç harfle doğru oyuncuyu bulabilirsin.
        </p>

        <p>
          Kolay seviyede ipuçları büyük çoğunlukla Süper Lig geçmişine dair olduğundan yalnızca Türkiye
          ligini takip edenler bile sorularda başarılı olabilir. Milli takım maçlarında izlediğin isimler,
          derbi kadroları ve sezon sonu şampiyonluk kadroları bu seviyenin ana referans noktalarıdır.
        </p>

        <p>
          Her gün saat 00:00'da yeni bir oyuncu belirlenir. Günlük soruyu kaçırdıysan arşiv navigasyonu ile
          önceki günlerin oyuncularına geri dönebilirsin. İstatistik ekranında kaçıncı ipucunda bildiğinin
          ortalamasını ve toplam oyun sayını takip edebilirsin.
        </p>

        <p>
          Sonuçlarını paylaş butonuyla skoru sosyal medyada yayınlayarak hangi ipucunda doğru bulduğunu
          arkadaşlarınla kıyaslayabilirsin. Birinci ipucunda bilmek her zaman ayrı bir gurur kaynağıdır.
        </p>
      </section>
    </>
  );
}
