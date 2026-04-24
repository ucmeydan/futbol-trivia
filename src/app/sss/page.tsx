import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Sık Sorulan Sorular | FutbolTrivia',
  description:
    'FutbolTrivia hakkında sık sorulan sorular. Oyunların nasıl oynandığı, verilerinin nerede saklandığı ve daha fazlası.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://futboltrivia.com.tr/sss' },
  openGraph: {
    title: 'Sık Sorulan Sorular | FutbolTrivia',
    description: 'FutbolTrivia hakkında merak ettiklerinin cevapları.',
    url: 'https://futboltrivia.com.tr/sss',
    siteName: 'FutbolTrivia',
    locale: 'tr_TR',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'FutbolTrivia nedir?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'FutbolTrivia, Süper Lig ve Türk futbol tarihine odaklanan ücretsiz bir günlük bilgi yarışması platformudur. Takım Arkadaşı, Kariyer Yolu, Top 10 ve Listeyi Tamamla olmak üzere dört farklı oyun modu sunulur. Her oyunda kolay ve zor seçenekleri mevcuttur. Her oyunda günde ikişer yeni soru yayınlanır.',
      },
    },
    {
      '@type': 'Question',
      name: 'Oynamak ücretsiz mi?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Evet, tüm oyunlar tamamen ücretsizdir. Hesap açmana da gerek yoktur; siteye girip oynamaya başlayabilirsin.',
      },
    },
    {
      '@type': 'Question',
      name: 'Sorular ne zaman güncellenir?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sorular her gece 00:00\'da güncellenir.',
      },
    },
    {
      '@type': 'Question',
      name: 'Geçmiş günlerin sorularını oynayabilir miyim?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Evet. Her oyunda yer alan arşiv navigasyonu sayesinde önceki günlerin sorularına ulaşabilirsin.',
      },
    },
    {
      '@type': 'Question',
      name: 'Takım Arkadaşı nasıl oynanır?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Her gün gizli bir futbolcu belirlenir. Bu futbolcunun eski takım arkadaşları ipucu olarak verilir. 7 tahmin hakkın ve 5 ipucun bulunur. İpuçları zordan kolaya doğru ilerler.',
      },
    },
    {
      '@type': 'Question',
      name: 'Kariyer Yolu nasıl oynanır?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Gizli futbolcunun kariyer tablosu takım takım açılır. Her yanlış tahminde bir sonraki takım görünür. Pas Geç seçeneğiyle tahmin yapmadan da bir sonraki takımı görebilirsin.',
      },
    },
    {
      '@type': 'Question',
      name: 'Top 10 nasıl oynanır?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Belirli bir kategorideki 10 ismi bulman beklenir. 3 yanlış tahmin hakkın vardır. İpucu açık modda her cevabın harf sayısını görebilirsin.',
      },
    },
    {
      '@type': 'Question',
      name: 'Listeyi Tamamla nasıl oynanır?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '90 saniye içinde bir listeyi tamamlamaya çalışırsın. Sayaç ilk tahminle başlar. Her doğru cevap süreye 5 saniye ekler. Yanlış cevaplarda sürede herhangi bir değişiklik olmaz. Süre bittiğinde oyun sona erer.',
      },
    },
    {
      '@type': 'Question',
      name: 'Kolay ve Zor seviyeler arasındaki fark nedir?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Kolay seviyede güncel Süper Lig bilgisi genellikle yeterlidir. Zor seviyede Türk futbol tarihinin daha eski dönemlerine, alt liglere ve daha az tanınan isimlere inmek gerekebilir.',
      },
    },
    {
      '@type': 'Question',
      name: 'Verilerim nerede saklanıyor?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'İstatistiklerin ve oyun geçmişin yalnızca kendi cihazının tarayıcısında (localStorage) saklanır. Herhangi bir sunucuya gönderilmez.',
      },
    },
    {
      '@type': 'Question',
      name: 'Tarayıcımı değiştirirsem istatistiklerim gider mi?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Evet. Veriler cihaza özgü olduğu için farklı bir tarayıcı veya cihazda istatistiklerin sıfırlanmış olur.',
      },
    },
    {
      '@type': 'Question',
      name: 'Sitede reklam var mı?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Siteyi sürdürülebilir kılmak için Google AdSense reklamları kullanılmaktadır. Çerez tercihlerini cookie banner\'dan yönetebilirsin.',
      },
    },
    {
      '@type': 'Question',
      name: 'Soru verileri hatalıysa ne yapabilirim?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'futboltriviatr@gmail.com adresine yazarak hata bildiriminde bulunabilirsin. Tüm bildirimler incelenerek gerekli düzeltmeler yapılır.',
      },
    },
    {
      '@type': 'Question',
      name: 'Yeni soru önerebilir miyim?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Evet. İletişim sayfasından veya doğrudan e-posta yoluyla soru önerebilirsin.',
      },
    },
  ],
};

const sections = [
  {
    title: 'Genel',
    items: [
      {
        q: 'FutbolTrivia nedir?',
        a: 'FutbolTrivia, Süper Lig ve Türk futbol tarihine odaklanan ücretsiz bir günlük bilgi yarışması platformudur. Takım Arkadaşı, Kariyer Yolu, Top 10 ve Listeyi Tamamla olmak üzere dört farklı oyun modu sunulur. Her oyunda kolay ve zor seçenekleri mevcuttur. Her oyunda günde ikişer yeni soru yayınlanır.',
      },
      {
        q: 'Oynamak ücretsiz mi?',
        a: 'Evet, tüm oyunlar tamamen ücretsizdir. Hesap açmana da gerek yoktur; siteye girip oynamaya başlayabilirsin.',
      },
      {
        q: 'Sorular ne zaman güncellenir?',
        a: 'Sorular her gece 00:00\'da güncellenir.',
      },
      {
        q: 'Geçmiş günlerin sorularını oynayabilir miyim?',
        a: 'Evet. Her oyunda yer alan arşiv navigasyonu sayesinde önceki günlerin sorularına ulaşabilirsin.',
      },
    ],
  },
  {
    title: 'Oyunlar',
    items: [
      {
        q: 'Takım Arkadaşı nasıl oynanır?',
        a: 'Her gün gizli bir futbolcu belirlenir. Bu futbolcunun eski takım arkadaşları ipucu olarak verilir. 7 tahmin hakkın ve 5 ipucun bulunur. İpuçları zordan kolaya doğru ilerler.',
      },
      {
        q: 'Kariyer Yolu nasıl oynanır?',
        a: 'Gizli futbolcunun kariyer tablosu takım takım açılır. Her yanlış tahminde bir sonraki takım görünür. Pas Geç seçeneğiyle tahmin yapmadan da bir sonraki takımı görebilirsin.',
      },
      {
        q: 'Top 10 nasıl oynanır?',
        a: 'Belirli bir kategorideki 10 ismi bulman beklenir. 3 yanlış tahmin hakkın vardır. "İpucu açık" modda her cevabın harf sayısını görebilirsin.',
      },
      {
        q: 'Listeyi Tamamla nasıl oynanır?',
        a: '90 saniye içinde bir listeyi tamamlamaya çalışırsın. Sayaç ilk tahminle başlar. Her doğru cevap süreye 5 saniye ekler. Yanlış cevaplarda sürede herhangi bir değişiklik olmaz. Süre bittiğinde oyun sona erer.',
      },
      {
        q: 'Kolay ve Zor seviyeler arasındaki fark nedir?',
        a: 'Kolay seviyede güncel Süper Lig bilgisi genellikle yeterlidir. Zor seviyede Türk futbol tarihinin daha eski dönemlerine, alt liglere ve daha az tanınan isimlere inmek gerekebilir.',
      },
    ],
  },
  {
    title: 'Teknik',
    items: [
      {
        q: 'Verilerim nerede saklanıyor?',
        a: 'İstatistiklerin ve oyun geçmişin yalnızca kendi cihazının tarayıcısında (localStorage) saklanır. Herhangi bir sunucuya gönderilmez.',
      },
      {
        q: 'Tarayıcımı değiştirirsem istatistiklerim gider mi?',
        a: 'Evet. Veriler cihaza özgü olduğu için farklı bir tarayıcı veya cihazda istatistiklerin sıfırlanmış olur.',
      },
      {
        q: 'Sitede reklam var mı?',
        a: 'Siteyi sürdürülebilir kılmak için Google AdSense reklamları kullanılmaktadır. Çerez tercihlerini cookie banner\'dan yönetebilirsin.',
      },
    ],
  },
  {
    title: 'İletişim',
    items: [
      {
        q: 'Soru verileri hatalıysa ne yapabilirim?',
        a: 'futboltriviatr@gmail.com adresine yazarak hata bildiriminde bulunabilirsin. Tüm bildirimler incelenerek gerekli düzeltmeler yapılır.',
      },
      {
        q: 'Yeni soru önerebilir miyim?',
        a: 'Evet. İletişim sayfasından veya doğrudan e-posta yoluyla soru önerebilirsin.',
      },
    ],
  },
];

export default function SSSPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <main className="min-h-screen bg-slate-950 text-white px-4 py-12">
        <div className="max-w-2xl mx-auto">

          <div className="mb-2">
            <Link href="/" className="text-slate-500 text-xs font-bold hover:text-white transition-colors tracking-wide">
              ← Ana Sayfa
            </Link>
          </div>

          <h1 className="font-bebas text-4xl text-white tracking-wide mt-6 mb-2">Sık Sorulan Sorular</h1>
          <p className="text-slate-500 text-sm mb-12">FutbolTrivia hakkında merak ettiklerinin cevapları.</p>

          <div className="space-y-12">
            {sections.map((section) => (
              <div key={section.title}>
                <h2 className="text-slate-500 text-xs font-bold tracking-[0.2em] uppercase mb-6 border-b border-slate-800 pb-3">
                  {section.title}
                </h2>
                <div className="space-y-6">
                  {section.items.map((item) => (
                    <div key={item.q}>
                      <h3 className="text-slate-100 font-semibold text-sm mb-2">{item.q}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed">{item.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 pt-8 border-t border-slate-800 text-center">
            <p className="text-slate-500 text-sm">
              Başka sorun mu var?{' '}
              <Link href="/iletisim" className="text-red-500 hover:text-red-400 font-semibold transition-colors">
                Bize ulaş
              </Link>
            </p>
          </div>

        </div>
      </main>
    </>
  );
}
