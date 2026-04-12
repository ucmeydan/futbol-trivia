'use client';

import Link from 'next/link';

export default function IletisimClient() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-red-900/40">
      <div className="max-w-2xl mx-auto px-6 py-10 flex flex-col animate-in fade-in duration-700">

        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-2 text-xs text-slate-600 tracking-wide">
            <li>
              <Link href="/" className="hover:text-red-500 transition-colors">Ana sayfa</Link>
            </li>
            <li aria-hidden="true" className="text-slate-800">›</li>
            <li className="text-slate-500" aria-current="page">İletişim</li>
          </ol>
        </nav>

        <header className="mb-12">
          <p className="text-xs text-red-600 tracking-[0.2em] uppercase font-medium mb-3">İletişim</p>
          <h1 className="text-4xl font-light text-white tracking-tight mb-4">Bize ulaşın</h1>
          <p className="text-slate-500 text-sm">Sorularınız, önerileriniz ve geri bildirimleriniz için buradayız</p>
        </header>

        <div className="space-y-10 text-base leading-relaxed font-light">

          <section aria-labelledby="iletisim-giris">
            <h2 id="iletisim-giris" className="flex items-start gap-3 text-white font-normal text-lg mb-4 leading-snug">
              <span className="mt-1 shrink-0 w-0.5 h-5 bg-red-600 rounded-full" aria-hidden="true" />
              Merhaba!
            </h2>
            <p className="mb-3">
              FutbolTrivia topluluğunun bir parçası olduğunuz için teşekkürler. Platform hakkındaki her türlü görüş ve öneriniz bizim için değerlidir.
            </p>
            <p>
              Soru önerileri, veri düzeltme talepleri, yeni oyun fikirleri veya teknik konular — hangi konu olursa olsun, aşağıdaki e-posta adresinden bize ulaşabilirsiniz.
            </p>
          </section>

          <section aria-labelledby="ne-yazabilirsiniz">
            <h2 id="ne-yazabilirsiniz" className="flex items-start gap-3 text-white font-normal text-lg mb-4 leading-snug">
              <span className="mt-1 shrink-0 w-0.5 h-5 bg-red-600 rounded-full" aria-hidden="true" />
              Hangi konularda yazabilirsiniz?
            </h2>
            <div className="space-y-2 pl-4 border-l border-slate-800">
              <div className="flex gap-2">
                <span className="text-red-700 mt-1 shrink-0">–</span>
                <p>Yeni soru veya oyuncu önerileri</p>
              </div>
              <div className="flex gap-2">
                <span className="text-red-700 mt-1 shrink-0">–</span>
                <p>Hatalı veya eksik veri bildirimi</p>
              </div>
              <div className="flex gap-2">
                <span className="text-red-700 mt-1 shrink-0">–</span>
                <p>Yeni oyun modu veya özellik fikirleri</p>
              </div>
              <div className="flex gap-2">
                <span className="text-red-700 mt-1 shrink-0">–</span>
                <p>Teknik sorunlar ve hata bildirimleri</p>
              </div>
              <div className="flex gap-2">
                <span className="text-red-700 mt-1 shrink-0">–</span>
                <p>İş birliği ve iletişim teklifleri</p>
              </div>
            </div>
          </section>

          <section aria-labelledby="eposta">
            <h2 id="eposta" className="flex items-start gap-3 text-white font-normal text-lg mb-4 leading-snug">
              <span className="mt-1 shrink-0 w-0.5 h-5 bg-red-600 rounded-full" aria-hidden="true" />
              E-posta
            </h2>
            <p className="mb-4">Mesajlarınızı aşağıdaki adrese iletebilirsiniz:</p>
            <a href="mailto:futboltriviatr@gmail.com" className="inline-flex items-center gap-2 text-red-500 hover:text-red-400 transition-colors">
              <span className="text-xl font-light">futboltriviatr@gmail.com</span>
              <svg width="14" height="14" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            </a>
          </section>

          <section aria-labelledby="topluluk">
            <h2 id="topluluk" className="flex items-start gap-3 text-white font-normal text-lg mb-4 leading-snug">
              <span className="mt-1 shrink-0 w-0.5 h-5 bg-red-600 rounded-full" aria-hidden="true" />
              Topluluğa katkı
            </h2>
            <p className="mb-3">
              FutbolTrivia, Türk futbol severlerin katkılarıyla büyüyen bir platform olmayı hedefliyor. Eksik gördüğünüz bir oyuncu, yanlış olduğunu düşündüğünüz bir istatistik veya eklenmesini istediğiniz bir kategori varsa bize bildirin.
            </p>
            <p>
              Her geri bildirim, veri tabanımızı ve oyun kalitemizi doğrudan iyileştiriyor.
            </p>
          </section>

        </div>

        <nav aria-label="İlgili sayfalar" className="mt-14 pt-8 border-t border-slate-900">
          <p className="text-xs text-slate-600 tracking-widest uppercase mb-4">Ayrıca bakınız</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/" className="text-sm text-slate-500 hover:text-slate-300 border border-slate-800 hover:border-slate-700 px-4 py-2 rounded-full transition-all">Oyunlar</Link>
            <Link href="/hakkimizda" className="text-sm text-slate-500 hover:text-slate-300 border border-slate-800 hover:border-slate-700 px-4 py-2 rounded-full transition-all">Hakkımızda</Link>
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