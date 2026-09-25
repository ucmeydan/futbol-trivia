#!/usr/bin/env node
/**
 * Uygulamanın bundled veri klasörünü (src/data) website'nin veri klasörüyle
 * (../src/data) eşitler. Website tek doğru kaynaktır; burası sadece onun bir
 * kopyasıdır ve ilk açılış (henüz sync olmamışken) + App Store'a giden build
 * için gereken temel içeriktir.
 *
 * Kullanım:  npm run sync-data
 * Ne zaman:  App Store'a yeni bir build göndermeden ÖNCE (bundled içerik taze olsun).
 *            Yüklü uygulamalar zaten futboltrivia.com.tr/data üzerinden otomatik
 *            senkron olur; bu script sadece build'e gömülen kopyayı günceller.
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const APP_DATA = join(__dirname, '..', 'src', 'data');       // FutbolTriviaApp/src/data
const SITE_DATA = join(__dirname, '..', '..', 'src', 'data'); // tr-trivia/src/data

// questionSync.ts içindeki DataKey listesiyle birebir aynı olmalı.
const FILES = [
  'all_teams',
  'cities',
  'countries',
  'european_teams',
  'players',
  'td',
  'teams',
  'questions-kariyer-yolu-kolay',
  'questions-kariyer-yolu-zor',
  'questions-listeyi-tamamla-kolay',
  'questions-listeyi-tamamla-zor',
  'questions-takim-arkadasi-kolay',
  'questions-takim-arkadasi-zor',
  'questions-top10-kolay',
  'questions-top10-zor',
];

if (!existsSync(SITE_DATA)) {
  console.error(`✗ Website veri klasörü bulunamadı: ${SITE_DATA}`);
  console.error('  Bu script, app klasörü website reposunun içinde (tr-trivia/FutbolTriviaApp) iken çalışır.');
  process.exit(1);
}

let changed = 0;
let unchanged = 0;
const problems = [];

for (const key of FILES) {
  const src = join(SITE_DATA, `${key}.json`);
  const dst = join(APP_DATA, `${key}.json`);

  if (!existsSync(src)) {
    problems.push(`${key}: website'de yok (${src})`);
    continue;
  }

  const raw = readFileSync(src, 'utf8');

  // Geçerli, boş olmayan bir JSON dizisi mi? (bozuk veriyi kopyalama)
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    problems.push(`${key}: website dosyası geçerli JSON değil — atlandı`);
    continue;
  }
  if (!Array.isArray(parsed) || parsed.length === 0) {
    problems.push(`${key}: dizi değil veya boş — atlandı`);
    continue;
  }

  const before = existsSync(dst) ? readFileSync(dst, 'utf8') : null;
  const beforeCount = before ? (JSON.parse(before)?.length ?? 0) : 0;

  if (before === raw) {
    unchanged++;
    continue;
  }

  writeFileSync(dst, raw);
  changed++;
  console.log(`  ✓ ${key}: ${beforeCount} → ${parsed.length}`);
}

console.log(`\n${changed} dosya güncellendi, ${unchanged} zaten güncel.`);

if (problems.length) {
  console.log('\nUyarılar:');
  for (const p of problems) console.log(`  ! ${p}`);
  process.exit(1);
}
