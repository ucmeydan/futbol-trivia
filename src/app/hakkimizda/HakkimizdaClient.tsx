'use client';

import Link from 'next/link';
import { ReactNode } from 'react';

function SectionTitle({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2 id={id} className="flex items-start gap-3 text-white font-normal text-lg mb-4 leading-snug">
      <span className="mt-1 shrink-0 w-0.5 h-5 bg-red-600 rounded-full" aria-hidden="true" />
      {children}
    </h2>
  );
}

const GAMES = [
  {
    slug: 'takim-arkadasi',
    title: 'Takım Arkadaşı',
    description: 'Gizlenen futbolcunun kulüp veya milli takım kariyerindeki eski takım arkadaşları sana ipucu olarak gösteriliyor.',
    detail: 'Her yanlış tahminde yeni bir takım arkadaşı açılır. Toplam 5 tahmin hakkın var — ne kadarını kullanacaksın?',
  },
  {
    slug: 'kariyer-yolu',
    title: 'Kariyer Yolu',
    description: "Yolu Türkiye'den geçmiş oyuncuları daha önce oynadıkları takımlardan bulmaya çalış.",
    detail: 'Her tahminde yeni bir takım açılır. Doğru oyuncuyu kaçıncı denemede bulabileceğini gör.',
  },
  {
    slug: 'top-10',
    title: 'Top 10',
    description: 'Belirli bir istatistik kategorisine ait 10 ismi tahmin etmeye çalış. Hafızanı zorla!',
    detail: 'Süreli olmayan bu modda 3 defa yanlış tahmin yaparsan oyun sona erer. Tüm 10 ismi bulabilir misin?',
  },
  {
    slug: 'listeyi-tamamla',
    title: 'Listeyi Tamamla',
    description: 'Günlük soruda kaç doğru cevap bulabilirsin? Tahmin yapmaya başladıktan sonra 90 saniyelik süre başlayacak.',
    detail: 'Her doğru cevap sana +5 saniye kazandırır. Süreyi iyi kullan — her saniye değerli.',
  },
];

export default function HakkimizdaClient() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-red-900/40">
      <div className="max-w-2xl mx-auto px-6 py-10 flex flex-col animate-in fade-in duration-700">

        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-2 text-xs text-slate-600 tracking-wide">
            <li>
              <Link href="/" className="hover:text-red-500 transition-colors">Ana sayfa</Link>
            </li>
            <li aria-hidden="true" className="text-slate-800">›</li>
            <li className="text-slate-500" aria-current="page">Hakkımızda</li>
          </ol>
        </nav>

        <header className="mb-12">
          <p className="text-xs text-red-600 tracking-[0.2em] uppercase font-medium mb-3">Platform</p>
          <h1 className="text-4xl font-light text-white tracking-tight mb-4">Hakkımızda</h1>
          <p className="text-slate-500 text-sm">Türkiye'nin futbol bilgi yarışması platformu</p>
        </header>

        <div className="space-y-10 text-base leading-relaxed font-light">

          <section aria-labelledby="biz-kimiz">
            <h2 id="biz-kimiz" className="flex items-start gap-3 text-white font-normal text-lg mb-4 leading-snug">
              <span className="mt-1 shrink-0 w-0.5 h-5 bg-red-600 rounded-full" aria-hidden="true" />
              Biz kimiz?
            </h2>
            <p className="mb-3">
              FutbolTrivia, futbolun yalnızca maç skorlarından ibaret olmadığına inanan bir ekip tarafından kurulmuştur. Sitemiz; Süper Lig tarihini, Türk futbolunun unutulmaz isimlerini ve milli takımın yolculuğunu kapsayan günlük bilgi oyunları sunar.
            </p>
            <p>
              Amacımız tek cümlede özetlenebilir: futbol bilgisini pasif tüketimden çıkarıp aktif, rekabetçi ve ölçülebilir bir deneyime dönüştürmek. Her gün güncellenen oyunlar, kişisel istatistikler ve zorluk eğrisi bu amacın somut yansımalarıdır.
            </p>
          </section>

          <section aria-labelledby="neden">
            <h2 id="neden" className="flex items-start gap-3 text-white font-normal text-lg mb-4 leading-snug">
              <span className="mt-1 shrink-0 w-0.5 h-5 bg-red-600 rounded-full" aria-hidden="true" />
              Neden FutbolTrivia?
            </h2>
            <p className="mb-3">
              Türkçe içerik üreten futbol platformlarının büyük çoğunluğu haber ve analiz odaklıdır. Kullanıcının bilgisini sınadığı, kendi istatistiklerini takip ettiği ve her gün yeni bir zorlukla karşılaştığı etkileşimli bir alan eksikliği FutbolTrivia'nın çıkış noktasını oluşturmuştur.
            </p>
            <p>
              Wordle'ın günlük bulmaca formatından ilham alan oyun yapımız, her ziyareti öncekinden farklı kılar. Seriyi kaybetmemek için geri dönen oyuncular; yeni soruları keşfetmek için gelen meraklılar — her ikisi için de bir şeyler var.
            </p>
          </section>

          <section aria-labelledby="oyunlar">
            <h2 id="oyunlar" className="flex items-start gap-3 text-white font-normal text-lg mb-4 leading-snug">
              <span className="mt-1 shrink-0 w-0.5 h-5 bg-red-600 rounded-full" aria-hidden="true" />
              Oyunlarımız
            </h2>
            <p className="mb-5">Dört farklı oyun modülümüz, her biri ayrı bir futbol bilgisi boyutunu test eder:</p>
            <div className="space-y-5">
              {GAMES.map((game) => (
                <div key={game.slug} className="pl-4 border-l border-slate-800 hover:border-red-900 transition-colors">
                  <h3 className="text-white font-normal mb-1">{game.title}</h3>
                  <p className="text-slate-400 mb-1">{game.description}</p>
                  <p className="text-slate-600 text-sm">{game.detail}</p>
                </div>
              ))}
            </div>
          </section>

          <section aria-labelledby="veri">
            <h2 id="veri" className="flex items-start gap-3 text-white font-normal text-lg mb-4 leading-snug">
              <span className="mt-1 shrink-0 w-0.5 h-5 bg-red-600 rounded-full" aria-hidden="true" />
              Veri tabanımız ve kapsam
            </h2>
            <p className="mb-3">
              Sorular ve oyuncu profilleri, Süper Lig'in kuruluşundan günümüze uzanan geniş bir futbol veri tabanına dayanmaktadır. Türk kulüplerinin kadro tarihleri, milli takım maçları ve Türkiye'den dünyaya açılan oyuncuların kariyer istatistikleri bu veri tabanının temelini oluşturur.
            </p>
            <p className="mb-3">
              Her veri noktası editöryal süzgeçten geçirilir; yanlış veya eksik bilgileri iletişim sayfamız üzerinden bildirmenizi teşvik ediyoruz. Topluluk katkısı veri kalitemizin temel taşlarından biridir.
            </p>
            <p>Oyunlar her gün yenilenir. Dünün sorusunu cevaplamak isteyenler için arşiv erişimi gelecek güncellemelerimiz arasındadır.</p>
          </section>

          <section aria-labelledby="turk-futbolu">
            <h2 id="turk-futbolu" className="flex items-start gap-3 text-white font-normal text-lg mb-4 leading-snug">
              <span className="mt-1 shrink-0 w-0.5 h-5 bg-red-600 rounded-full" aria-hidden="true" />
              Türk futboluna bakışımız
            </h2>
            <p className="mb-3">
              Süper Lig, Türkiye'nin en köklü spor kurumlarından birini barındırmaktadır. Galatasaray'ın 2000 UEFA Kupası zaferinden Beşiktaş ve Fenerbahçe'nin Avrupa sahnesindeki çıkışlarına, Trabzonspor'un 2022 şampiyonluğundan genç yeteneklerin dünya devlerine transferine kadar pek çok önemli hikâye dünya futbol gündemine girmiştir.
            </p>
            <p className="mb-3">
              FutbolTrivia bu hikâyeleri merkeze alır. Türkiye'de yetişmiş oyuncuları, Süper Lig'i şekillendirmiş yabancı isimleri ve millî takımın tarihsel seyrini kapsayan bir perspektifle içerik üretiyoruz.
            </p>
            <p>
              Futbol bilgisi sahadan ibaret değildir. Sivas'ta kazanılan bir kupa, Kadıköy'de yaşanan tarihi bir derbi ya da eleme turundaki unutulmaz bir gol de o bilginin parçasıdır.
            </p>
          </section>

          <section aria-labelledby="gelecek">
            <h2 id="gelecek" className="flex items-start gap-3 text-white font-normal text-lg mb-4 leading-snug">
              <span className="mt-1 shrink-0 w-0.5 h-5 bg-red-600 rounded-full" aria-hidden="true" />
              Yol haritamız
            </h2>
            <p className="mb-3">
              FutbolTrivia sürekli gelişen bir platform olmayı hedefliyor. Mevcut dört oyun modülünü derinleştirmenin yanı sıra önümüzdeki dönemde kullanıcı liderlik tabloları, arkadaşlarla karşılaştırma modu ve haftalık tematik yarışmalar gibi sosyal özellikler eklemeyi planlıyoruz.
            </p>
            <p>
              Önerileriniz ve geri bildirimleriniz bu yol haritasını doğrudan şekillendiriyor. Hangi oyun modülünü görmek istediğinizi ya da hangi veri kategorisinin eksik olduğunu{' '}
              <Link href="/iletisim" className="text-red-500 hover:text-red-400 underline underline-offset-2 transition-colors">iletişim sayfası</Link>
              {' '}üzerinden bizimle paylaşabilirsiniz.
            </p>
          </section>

          <section aria-labelledby="iletisim">
            <h2 id="iletisim" className="flex items-start gap-3 text-white font-normal text-lg mb-4 leading-snug">
              <span className="mt-1 shrink-0 w-0.5 h-5 bg-red-600 rounded-full" aria-hidden="true" />
              İletişim
            </h2>
            <p className="mb-3">Görüş, öneri veya iş birliği teklifleriniz için bize ulaşabilirsiniz:</p>
            <a href="mailto:iletisim@futboltrivia.com.tr" className="inline-flex items-center gap-2 text-red-500 hover:text-red-400 transition-colors text-sm">
              <span>futboltriviatr@gmail.com</span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            </a>
          </section>

        </div>

        <nav aria-label="İlgili sayfalar" className="mt-14 pt-8 border-t border-slate-900">
          <p className="text-xs text-slate-600 tracking-widest uppercase mb-4">Ayrıca bakınız</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/" className="text-sm text-slate-500 hover:text-slate-300 border border-slate-800 hover:border-slate-700 px-4 py-2 rounded-full transition-all">Oyunlar</Link>
            <Link href="/iletisim" className="text-sm text-slate-500 hover:text-slate-300 border border-slate-800 hover:border-slate-700 px-4 py-2 rounded-full transition-all">İletişim</Link>
            <Link href="/gizlilik" className="text-sm text-slate-500 hover:text-slate-300 border border-slate-800 hover:border-slate-700 px-4 py-2 rounded-full transition-all">Gizlilik politikası</Link>
          </div>
        </nav>

        <footer className="mt-10 pb-10">
          <p className="text-[10px] text-slate-800 tracking-widest uppercase">© 2026 FutbolTrivia</p>
        </footer>

      </div>
    </div>
  );
}