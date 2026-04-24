import type { Metadata } from 'next';
import Link from 'next/link';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Kullanım Koşulları | FutbolTrivia',
  description:
    'FutbolTrivia kullanım koşulları. Siteyi kullanmadan önce lütfen bu koşulları okuyunuz.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://futboltrivia.com.tr/kullanim-sartlari' },
  openGraph: {
    title: 'Kullanım Koşulları | FutbolTrivia',
    description: 'FutbolTrivia kullanım koşulları.',
    url: 'https://futboltrivia.com.tr/kullanim-sartlari',
    siteName: 'FutbolTrivia',
    locale: 'tr_TR',
    type: 'website',
  },
};

function SectionTitle({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2
      id={id}
      className="flex items-start gap-3 text-white font-normal text-lg mb-4 leading-snug"
    >
      <span className="mt-1 shrink-0 w-0.5 h-5 bg-red-600 rounded-full" aria-hidden="true" />
      {children}
    </h2>
  );
}

export default function KullanimSartlariPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-red-900/40">
      <div className="max-w-2xl mx-auto px-6 py-10 flex flex-col animate-in fade-in duration-700">

        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-2 text-xs text-slate-600 tracking-wide">
            <li><Link href="/" className="hover:text-red-500 transition-colors">Ana sayfa</Link></li>
            <li aria-hidden="true">›</li>
            <li className="text-slate-400">Kullanım Koşulları</li>
          </ol>
        </nav>

        <header className="mb-10">
          <h1 className="text-2xl font-light text-white mb-3 tracking-tight">Kullanım Koşulları</h1>
          <p className="text-xs text-slate-600 tracking-widest uppercase">Son güncelleme: 25 Nisan 2026 · Sürüm 1.0</p>
        </header>

        <p className="text-sm leading-relaxed mb-10 text-slate-400">
          Bu kullanım koşulları, <strong className="text-slate-200">futboltrivia.com.tr</strong> adresinde yayımlanan
          FutbolTrivia platformunun kullanımına ilişkin kuralları ve sorumlulukları düzenlemektedir.
          Siteyi kullanmaya devam ederek bu koşulları kabul etmiş sayılırsınız.
        </p>

        <div className="space-y-10 text-sm leading-relaxed">

          <section aria-labelledby="kapsam">
            <SectionTitle id="kapsam">1. Hizmetin Kapsamı</SectionTitle>
            <p className="text-slate-400">
              FutbolTrivia, Süper Lig ve Türk futbol tarihine odaklanan ücretsiz bir günlük bilgi yarışması
              platformudur. Takım Arkadaşı, Kariyer Yolu, Top 10 ve Listeyi Tamamla olmak üzere dört farklı
              oyun modu sunulmaktadır. Platform, herhangi bir kayıt zorunluluğu olmaksızın tamamen ücretsiz
              olarak kullanılabilir.
            </p>
          </section>

          <section aria-labelledby="kullanim">
            <SectionTitle id="kullanim">2. Kabul Edilebilir Kullanım</SectionTitle>
            <p className="text-slate-400 mb-3">
              Siteyi kullanırken aşağıdaki kurallara uymayı kabul edersiniz:
            </p>
            <ul className="space-y-2 text-slate-400 list-none pl-4 border-l border-slate-800">
              <li>Siteyi yalnızca bireysel ve kişisel amaçlarla kullanabilirsiniz.</li>
              <li>Site içeriğini izinsiz olarak kopyalayamaz, çoğaltamaz veya ticari amaçla kullanamazsınız.</li>
              <li>Otomatik araçlar (bot, scraper vb.) kullanarak siteye erişim sağlayamazsınız.</li>
              <li>Diğer kullanıcıların deneyimini olumsuz etkileyecek davranışlarda bulunamazsınız.</li>
              <li>Siteye zarar verecek ya da güvenliğini tehdit edecek girişimlerde bulunamazsınız.</li>
            </ul>
          </section>

          <section aria-labelledby="fikrimulkiyet">
            <SectionTitle id="fikrimulkiyet">3. Fikri Mülkiyet</SectionTitle>
            <p className="text-slate-400">
              Sitede yer alan tüm içerikler — sorular, oyun mekanikleri, tasarım ve yazılı metinler —
              FutbolTrivia'ya aittir ve Türk fikir ve sanat eserleri mevzuatı kapsamında koruma altındadır.
              Futbolcuların isimleri, kariyer bilgileri ve istatistikler kamuya açık verilerdir; bu verilerin
              derlenmesi ve sunumu özgün bir editoryal çalışmayı temsil etmektedir.
            </p>
          </section>

          <section aria-labelledby="sorumluluk">
            <SectionTitle id="sorumluluk">4. Sorumluluk Sınırları</SectionTitle>
            <p className="text-slate-400 mb-3">
              FutbolTrivia, aşağıdaki konularda herhangi bir garanti vermemektedir:
            </p>
            <ul className="space-y-2 text-slate-400 list-none pl-4 border-l border-slate-800">
              <li>Soru ve istatistik verilerinin eksiksiz veya hatasız olduğu garanti edilemez; hata tespit edildiğinde düzeltme yapılır.</li>
              <li>Hizmetin kesintisiz veya hatasız çalışacağı garanti edilemez.</li>
              <li>Kullanıcının cihazında saklanan istatistik verilerinin (localStorage) korunacağı garanti edilemez.</li>
            </ul>
            <p className="text-slate-400 mt-3">
              FutbolTrivia, bu koşulların ihlali ya da hizmetin kullanımından doğabilecek doğrudan veya
              dolaylı zararlardan sorumlu tutulamaz.
            </p>
          </section>

          <section aria-labelledby="degisiklik">
            <SectionTitle id="degisiklik">5. Hizmet Değişiklikleri</SectionTitle>
            <p className="text-slate-400">
              FutbolTrivia, önceden bildirim yapmaksızın hizmet kapsamını, oyun kurallarını veya içeriklerini
              değiştirme, genişletme ya da sınırlandırma hakkını saklı tutar. Önemli değişikliklerde
              kullanıcılar site üzerinden bilgilendirilir.
            </p>
          </section>

          <section aria-labelledby="ucuncu-taraf">
            <SectionTitle id="ucuncu-taraf">6. Üçüncü Taraf Hizmetler</SectionTitle>
            <p className="text-slate-400">
              Site, Google AdSense reklam hizmetini kullanmaktadır. Google'ın veri işleme pratikleri
              FutbolTrivia'nın kontrolü dışındadır ve Google'ın kendi gizlilik politikası kapsamındadır.
              Çerez tercihlerinizi cookie banner üzerinden yönetebilirsiniz.
            </p>
          </section>

          <section aria-labelledby="yururluk">
            <SectionTitle id="yururluk">7. Yürürlük ve Uygulanacak Hukuk</SectionTitle>
            <p className="text-slate-400">
              Bu kullanım koşulları Türk hukuku kapsamında değerlendirilir. Koşullardan doğabilecek
              uyuşmazlıklarda Türkiye Cumhuriyeti mahkemeleri yetkilidir. FutbolTrivia, bu koşulları
              herhangi bir zamanda güncelleyebilir; güncel sürüm her zaman bu sayfada yayımlanır.
            </p>
          </section>

          <section aria-labelledby="iletisim">
            <SectionTitle id="iletisim">8. İletişim</SectionTitle>
            <p className="text-slate-400">
              Kullanım koşullarına ilişkin sorularınız için{' '}
              <a
                href="mailto:futboltriviatr@gmail.com"
                className="text-red-500 hover:text-red-400 transition-colors"
              >
                futboltriviatr@gmail.com
              </a>{' '}
              adresine ulaşabilirsiniz.
            </p>
          </section>

        </div>

        <footer className="mt-16 pt-8 border-t border-slate-800/60">
          <nav aria-label="İlgili sayfalar" className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-600">
            <Link href="/gizlilik" className="hover:text-red-500 transition-colors">Gizlilik Politikası</Link>
            <Link href="/sss" className="hover:text-red-500 transition-colors">Sık Sorulan Sorular</Link>
            <Link href="/iletisim" className="hover:text-red-500 transition-colors">İletişim</Link>
            <Link href="/" className="hover:text-red-500 transition-colors">Ana Sayfa</Link>
          </nav>
        </footer>

      </div>
    </div>
  );
}
