import Link from 'next/link';

export default function SiteFooter() {
  return (
    <footer className="w-full pt-12 pb-10 relative z-10 border-t border-slate-900/50 bg-slate-950">
      <div className="max-w-5xl mx-auto px-6">
        <nav
          aria-label="Alt navigasyon"
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 mb-8 text-sm font-medium text-slate-500"
        >
          <Link href="/" className="hover:text-white transition-colors px-1">Ana Sayfa</Link>
          <Link href="/hakkimizda" className="hover:text-white transition-colors px-1">Hakkımızda</Link>
          <Link href="/sss" className="hover:text-white transition-colors px-1">SSS</Link>
          <Link href="/iletisim" className="hover:text-white transition-colors px-1">İletişim</Link>
          <Link href="/gizlilik" className="hover:text-white transition-colors px-1">Gizlilik Politikası</Link>
          <Link href="/kullanim-sartlari" className="hover:text-white transition-colors px-1">Kullanım Koşulları</Link>
        </nav>
        <p className="text-center text-slate-700 text-[10px] tracking-wide font-mono">
          © 2026 Futbol Trivia · Tüm hakları saklıdır.
        </p>
      </div>
    </footer>
  );
}
