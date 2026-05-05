import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://futboltrivia.com.tr';
  const today = new Date().toISOString().split('T')[0];

  const pages: { route: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
    { route: '',                    priority: 1.0, changeFrequency: 'daily'   },
    { route: '/takim-arkadasi',        priority: 0.9, changeFrequency: 'daily'   },
    { route: '/takim-arkadasi/kolay',  priority: 0.8, changeFrequency: 'weekly'  },
    { route: '/takim-arkadasi/zor',    priority: 0.8, changeFrequency: 'weekly'  },
    { route: '/kariyer-yolu',          priority: 0.9, changeFrequency: 'daily'   },
    { route: '/kariyer-yolu/kolay',    priority: 0.8, changeFrequency: 'weekly'  },
    { route: '/kariyer-yolu/zor',      priority: 0.8, changeFrequency: 'weekly'  },
    { route: '/top10',                 priority: 0.9, changeFrequency: 'daily'   },
    { route: '/top10/kolay',           priority: 0.8, changeFrequency: 'weekly'  },
    { route: '/top10/zor',             priority: 0.8, changeFrequency: 'weekly'  },
    { route: '/listeyi-tamamla',       priority: 0.9, changeFrequency: 'daily'   },
    { route: '/listeyi-tamamla/kolay', priority: 0.8, changeFrequency: 'weekly'  },
    { route: '/listeyi-tamamla/zor',   priority: 0.8, changeFrequency: 'weekly'  },
    { route: '/hakkimizda',         priority: 0.6, changeFrequency: 'monthly' },
    { route: '/iletisim',           priority: 0.6, changeFrequency: 'monthly' },
    { route: '/sss',                priority: 0.6, changeFrequency: 'monthly' },
    { route: '/kullanim-sartlari',   priority: 0.4, changeFrequency: 'yearly'  },
    { route: '/gizlilik',           priority: 0.4, changeFrequency: 'yearly'  },
  ];

  return pages.map(({ route, priority, changeFrequency }) => ({
    url: `${baseUrl}${route}`,
    lastModified: today,
    changeFrequency,
    priority,
  }));
}