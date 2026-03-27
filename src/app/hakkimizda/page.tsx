'use client';

import Link from 'next/link';

export default function Hakkimizda() {
  return (
    /* Arka planı kesin olarak siyah (slate-950) yaparak beyaz ekran sorununu çözdük */
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans">
      <div className="max-w-2xl mx-auto p-6 flex flex-col animate-in fade-in duration-700">
        
        <div className="mb-8">
          <Link href="/" className="text-red-600 hover:text-red-500 font-bold text-sm transition-colors tracking-tight">
            ← Ana sayfaya dön
          </Link>
        </div>

        <h1 className="text-4xl font-light text-white mb-10 tracking-tight">
          Hakkımızda
        </h1>

        <div className="space-y-6 text-lg leading-relaxed font-light">
          <p>
            Futbol Trivia, futbol tutkunlarının bilgilerini taze tutmak ve eğlenceli vakit geçirmelerini sağlamak amacıyla kurulmuş bir oyun platformudur.
          </p>
          <p>
            Süper Lig'den Avrupa liglerine, efsane futbolculardan unutulmaz takımlara kadar futbolun her alanında hazırladığımız günlük sorularla kullanıcılarımıza rekabetçi bir ortam sunuyoruz.
          </p>
          <p>
            Amacımız, Türkiye'nin en kaliteli futbol bilgi yarışması deneyimini sunmak ve her gün güncellenen sorularla futbol kültürünü canlı tutmaktır.
          </p>
        </div>

        <div className="mt-16 pt-8 border-t border-slate-900 text-[10px] text-slate-600 tracking-[0.2em] uppercase">
          © 2026 Futbol Trivia
        </div>
      </div>
    </div>
  );
}
