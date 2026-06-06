# Apple Developer & App Store Submission Rehberi
# Futbol Trivia — com.futboltrivia.app

---

## ADIM 1 — Apple Developer Program'a Kayıt

1. https://developer.apple.com/programs adresine git
2. "Enroll" → Apple ID ile giriş yap
3. Entity Type: **Individual** seç (şirket değilsen)
4. Ödeme: **$99/yıl** (kredi kartı)
5. Onay süresi: genellikle **aynı gün**, bazen 1-2 gün

> ⚠️ Kayıt sonrası Apple'dan "Welcome to the Apple Developer Program" maili gelince devam et.

---

## ADIM 2 — App Store Connect'te Uygulama Oluştur

1. https://appstoreconnect.apple.com adresine git
2. "Apps" → "+" → "New App"
3. Doldurulacaklar:
   - **Platform:** iOS
   - **Name:** `Futbol Trivia`
   - **Primary Language:** Turkish
   - **Bundle ID:** `com.futboltrivia.app` (seç — EAS kayıt etmiş olacak)
   - **SKU:** `futboltrivia-ios-v1` (dahili referans, değiştirilebilir)
4. "Create" → uygulama oluşturulur

---

## ADIM 3 — App Store Bilgilerini Doldur

App Store Connect → Uygulamanı seç → "App Store" sekmesi

### Genel Bilgiler
| Alan | Değer |
|---|---|
| Name | Futbol Trivia |
| Subtitle | Süper Lig Bilgi Oyunları |
| Category (Primary) | Games → Trivia |
| Category (Secondary) | Entertainment |
| Age Rating | 4+ |
| Price | Free |
| Availability | Turkey (önce), sonra All Countries |

### Açıklama
→ `store-metadata.md` dosyasındaki **App Store Açıklaması**'nı kopyala/yapıştır

### Anahtar Kelimeler (100 karakter)
```
futbol,trivia,süper lig,bilgi,quiz,günlük,kariyer,takım,wordle,türk futbolu
```

### Destek URL
`https://futboltrivia.com.tr/iletisim`

### Pazarlama URL
`https://futboltrivia.com.tr`

### Gizlilik Politikası URL
`https://futboltrivia.com.tr/gizlilik`

---

## ADIM 4 — Ekran Görüntülerini Yükle

→ `screenshot-frames/` klasöründeki şablonlu görüntüleri kullan

| Format | Boyut | Gerekli mi |
|---|---|---|
| iPhone 6.7" | 1290 × 2796 px | ✅ Zorunlu |
| iPhone 5.5" | 1242 × 2208 px | ✅ Zorunlu |
| iPad Pro 12.9" | 2048 × 2732 px | Opsiyonel |

> 💡 App Store'a yüklemeden önce ekran görüntülerini macOS'ta `sips --resampleWidth 1290 foto.png` komutuyla boyutlandır.

---

## ADIM 5 — EAS ile iOS Build Al

Terminalde:
```bash
cd /Users/ufukcanmeydan/Desktop/tr-trivia/FutbolTriviaApp
npx eas-cli build --platform ios --profile production
```

EAS şunları otomatik yapar:
- Apple Developer hesabına bağlan (e-posta + şifre sorar)
- Provisioning profile oluştur
- Sertifikaları yönet
- Build al (15-25 dakika)
- `.ipa` dosyası üret

---

## ADIM 6 — TestFlight'a Yükle

Build bittikten sonra:
```bash
npx eas-cli submit --platform ios --latest
```

Apple ID ve App Store Connect uygulama ID'sini sorar.
Yükleme tamamlanınca **TestFlight**'ta görünür (~30 dakika bekle).

**TestFlight'ta test:**
- Telefonunda TestFlight uygulamasını aç
- Daveti kabul et
- Gerçek build'i test et (Expo Go olmadan!)

---

## ADIM 7 — App Store Review'a Gönder

App Store Connect'te:
1. "Add for Review" → tüm bilgileri doldur
2. **App Review Information:**
   - Demo Account: (gerekmez, kayıt yok)
   - Notes: "Kayıt gerektirmeyen ücretsiz bir futbol bilgi oyunudur."
3. "Submit to App Review"

**Review süresi:** 24-72 saat (çoğunlukla 1 gün)

---

## ÖNEMLİ NOTLAR

- Bundle ID `com.futboltrivia.app` zaten EAS'a kayıtlı ✅
- Privacy Policy URL hazır: `futboltrivia.com.tr/gizlilik` ✅
- Bildirim izin açıklaması app.json'a eklendi ✅
- `store-metadata.md`'de açıklamalar hazır ✅
- 6 ekran görüntüsü çekildi ✅
