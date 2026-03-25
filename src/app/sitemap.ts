import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://futboltrivia.com.tr';

  // Sitedeki ana sayfalar
  const routes = [
    '',
    '/listeyi-tamamla',
    '/top10',
    '/hakkimizda',
    '/iletisim',
    '/gizlilik-politikasi',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0], // Bugünün tarihi
    changeFrequency: 'daily' as const, // Her gün yeni soru eklendiği için
    priority: route === '' ? 1 : 0.8, // Ana sayfa en yüksek öncelikli
  }));

  return [...routes];
}