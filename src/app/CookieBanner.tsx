'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('cookie_consent')) {
      setVisible(true);
    }
  }, []);

  const handleConsent = (granted: boolean) => {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        ad_storage: granted ? 'granted' : 'denied',
        analytics_storage: granted ? 'granted' : 'denied',
        ad_personalization: granted ? 'granted' : 'denied',
        ad_user_data: granted ? 'granted' : 'denied',
      });
    }
    localStorage.setItem('cookie_consent', granted ? '1' : '0');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900 border-t border-slate-700 px-4 py-4 shadow-2xl">
      <div className="max-w-2xl mx-auto">
        <p className="text-slate-300 text-xs leading-relaxed mb-1">
          Sitemizde reklamları kişiselleştirmek ve deneyimi iyileştirmek için çerezler kullanılmaktadır.{' '}
          <Link href="/gizlilik" className="text-red-500 underline underline-offset-2 hover:text-red-400 transition-colors">
            Gizlilik politikası
          </Link>
        </p>
        <p className="text-slate-600 text-[10px] mb-3">
          "Yalnızca Zorunlu" seçeneğinde kişiselleştirilmemiş reklamlar gösterilmeye devam edebilir.
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => handleConsent(true)}
            className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl transition-colors active:scale-95"
          >
            Tümünü Kabul Et
          </button>
          <button
            onClick={() => handleConsent(false)}
            className="flex-1 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 transition-colors active:scale-95"
          >
            Yalnızca Zorunlu
          </button>
        </div>
      </div>
    </div>
  );
}
