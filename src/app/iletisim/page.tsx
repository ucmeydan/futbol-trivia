'use client';

import Link from 'next/link';

export default function Iletisim() {
  return (
    /* Arka plan rengini (bg-slate-950) buraya sabitledik, böylece tarayıcı beyaz yapamaz */
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans">
      <div className="max-w-2xl mx-auto p-6 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        <div className="mb-8">
          <Link href="/" className="text-red-600 hover:text-red-500 font-bold text-sm transition-colors tracking-tight">
            ← Ana sayfaya dön
          </Link>
        </div>

        <h1 className="text-4xl font-light text-white mb-10 tracking-tight">
          İletişim
        </h1>

        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-red-600/5 rounded-full blur-3xl"></div>
          
          <p className="text-lg leading-relaxed mb-10 relative z-10 font-light text-slate-400">
            Futbol Trivia topluluğunun bir parçası olduğunuz için teşekkürler! 
            <span className="block mt-4 text-white font-normal">
              Soru önerileri, yeni oyun fikirleri ya da merak ettiğiniz diğer tüm konularda bizimle iletişime geçebilirsiniz.
            </span>
          </p>

          <div className="pt-8 border-t border-slate-800/50 relative z-10">
            <h2 className="text-red-600 font-light text-sm mb-3 tracking-tight">
              E-posta Adresimiz
            </h2>
            <a 
              href="mailto:futboltriviatr@gmail.com" 
              className="text-2xl font-light text-white hover:text-red-500 transition-all break-all"
            >
              futboltriviatr@gmail.com
            </a>
          </div>
        </div>

        <div className="mt-12 pt-12 pb-6 text-center text-slate-700">
          <p className="text-[10px] tracking-[0.2em] uppercase">
            Sahada görüşürüz!
          </p>
        </div>
      </div>
    </div>
  );
}
