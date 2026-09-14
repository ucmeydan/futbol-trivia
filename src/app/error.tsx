'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Hatanın konsola düşmesi, tarayıcı tabanlı hata raporlamanın yakalamasını sağlar
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center px-6 text-center">
      <p className="font-bebas text-[5rem] md:text-[7rem] leading-none text-red-600/80 tracking-tighter">Hata</p>
      <h1 className="text-2xl md:text-3xl font-semibold mb-3">Bir şeyler ters gitti</h1>
      <p className="text-slate-400 max-w-md mb-8 leading-relaxed">
        Beklenmeyen bir hata oluştu. Tekrar deneyebilir ya da ana sayfaya dönebilirsin.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={reset}
          className="bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-3 rounded-xl transition-colors"
        >
          Tekrar dene
        </button>
        <Link href="/" className="border border-slate-700 hover:border-slate-500 text-slate-300 px-6 py-3 rounded-xl transition-colors">
          Ana Sayfa
        </Link>
      </div>
    </main>
  );
}
