'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('cookie_consent')) {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900 border-t border-slate-800 px-4 py-3">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-slate-400 text-xs leading-relaxed text-center sm:text-left">
          Sitemizde daha iyi bir deneyim sunmak ve Google AdSense reklamları için çerezler kullanılmaktadır.{' '}
          <Link href="/gizlilik" className="text-red-500 hover:text-red-400 underline underline-offset-2 transition-colors">
            Gizlilik politikası
          </Link>
        </p>
        <button
          onClick={() => {
            localStorage.setItem('cookie_consent', '1');
            setVisible(false);
          }}
          className="shrink-0 px-6 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl transition-colors active:scale-95"
        >
          Kabul et
        </button>
      </div>
    </div>
  );
}