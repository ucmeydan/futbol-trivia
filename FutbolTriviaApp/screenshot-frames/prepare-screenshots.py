#!/usr/bin/env python3
"""
Futbol Trivia — App Store / Google Play Screenshot Hazırlayıcı

Kullanım:
  1. iPhone ekran görüntülerini bu klasöre kopyala (herhangi bir isimle)
  2. Bu scripti çalıştır: python3 prepare-screenshots.py
  3. 'output/' klasöründe store'a hazır görseller oluşur

App Store gereklilikleri:
  - iPhone 6.7": 1290 × 2796 px (zorunlu)
  - iPhone 5.5": 1242 × 2208 px (zorunlu)

Google Play gereklilikleri:
  - Telefon: min 1080 × 1920 px
"""

from PIL import Image
import os, sys, glob

INPUT_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_DIR = os.path.join(INPUT_DIR, 'output')
os.makedirs(OUTPUT_DIR, exist_ok=True)

TARGETS = {
    'appstore-67': (1290, 2796),   # iPhone 6.7" — zorunlu
    'appstore-55': (1242, 2208),   # iPhone 5.5" — zorunlu
    'playstore':   (1080, 1920),   # Google Play  — minimum
}

# Desteklenen giriş formatları
input_files = (
    glob.glob(os.path.join(INPUT_DIR, 'screenshots', '*.png')) +
    glob.glob(os.path.join(INPUT_DIR, 'screenshots', '*.jpg')) +
    glob.glob(os.path.join(INPUT_DIR, 'screenshots', '*.jpeg'))
)

if not input_files:
    print("❌ 'screenshots/' klasöründe görüntü bulunamadı.")
    print("   iPhone ekran görüntülerini screenshots/ klasörüne kopyala.")
    sys.exit(1)

print(f"🔍 {len(input_files)} dosya bulundu\n")

for src in sorted(input_files):
    name = os.path.splitext(os.path.basename(src))[0]
    img = Image.open(src)
    orig_w, orig_h = img.size
    print(f"📱 {name}: {orig_w}×{orig_h}")

    for profile, (tw, th) in TARGETS.items():
        # Oranı koru, gerekirse üst/alt kesim (crop)
        scale = max(tw / orig_w, th / orig_h)
        new_w = int(orig_w * scale)
        new_h = int(orig_h * scale)

        resized = img.resize((new_w, new_h), Image.LANCZOS)

        # Merkezi kırp
        left = (new_w - tw) // 2
        top  = (new_h - th) // 2
        cropped = resized.crop((left, top, left + tw, top + th))

        out_name = f"{name}_{profile}.png"
        out_path = os.path.join(OUTPUT_DIR, out_name)
        cropped.save(out_path, 'PNG', optimize=True)
        print(f"   ✓ {profile}: {tw}×{th} → {out_name}")

    print()

print(f"✅ Tamamlandı! Çıktılar: {OUTPUT_DIR}")
print("\nApp Store'a yüklenecek dosyalar:")
print("  output/*_appstore-67.png → iPhone 6.7\" bölümüne")
print("  output/*_appstore-55.png → iPhone 5.5\" bölümüne")
print("\nGoogle Play'e yüklenecek dosyalar:")
print("  output/*_playstore.png → Screenshots bölümüne")
