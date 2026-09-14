import type { Metadata } from 'next';
import Link from 'next/link';
import SiteFooter from './components/SiteFooter';

export const metadata: Metadata = {
  title: 'Sayfa Bulunamadı (404) | FutbolTrivia',
  description: 'Aradığın sayfa bulunamadı. Ana sayfadan oyunlara dönebilirsin.',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <p className="font-bebas text-[6rem] md:text-[8rem] leading-none text-red-600/80 tracking-tighter">404</p>
        <h1 className="text-2xl md:text-3xl font-semibold mb-3">Sayfa bulunamadı</h1>
        <p className="text-slate-400 max-w-md mb-8 leading-relaxed">
          Aradığın sayfa taşınmış veya hiç var olmamış olabilir. Aşağıdan oyunlara dönebilirsin.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/" className="bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-3 rounded-xl transition-colors">
            Ana Sayfa
          </Link>
          <Link href="/listeyi-tamamla" className="border border-slate-700 hover:border-slate-500 text-slate-300 px-6 py-3 rounded-xl transition-colors">
            Oyunlar
          </Link>
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
