'use client';

import Link from 'next/link';

export default function Gizlilik() {
  return (
    <div className="max-w-2xl mx-auto p-6 text-slate-300 font-sans min-h-screen animate-in fade-in duration-700">
      <div className="mb-8">
        <Link href="/" className="text-red-600 hover:text-red-500 font-bold text-sm transition-colors tracking-tight">
          ← Anasayfaya dön
        </Link>
      </div>

      <h1 className="text-4xl font-light text-white mb-10 tracking-tight">
        Gizlilik Politikası
      </h1>

      <div className="space-y-10 text-base leading-relaxed font-light">
        <section>
          <h2 className="text-white font-normal text-lg mb-3">Veri toplama</h2>
          <p>Futbol Trivia, kullanıcıların oyun istatistiklerini ve günlük katılım durumlarını tarayıcı tabanlı "localStorage" üzerinde saklar. Bu veriler kişisel kimlik bilgilerini içermez.</p>
        </section>

        <section>
          <h2 className="text-white font-normal text-lg mb-3">Reklamlar</h2>
          <p>Sitemizde Google AdSense reklamları yayınlanabilir. Google, ilgi alanlarınıza göre reklam göstermek için çerezleri (cookies) kullanabilir.</p>
        </section>

        <section>
          <h2 className="text-white font-normal text-lg mb-3">İletişim</h2>
          <p>Gizlilik politikamız hakkında sorularınız için bizimle e-posta yoluyla iletişime geçebilirsiniz.</p>
        </section>
      </div>

      <div className="mt-16 pt-8 border-t border-slate-900 text-[10px] text-slate-700 tracking-widest uppercase">
        Son güncelleme: 25 Mart 2026
      </div>
    </div>
  );
}