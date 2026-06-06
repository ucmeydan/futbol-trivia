# Google Play Submission Rehberi
# Futbol Trivia — com.futboltrivia.app

---

## İçerik Derecelendirme Anketi Cevapları

Google Play Console → App Content → Rating

| Soru | Cevap |
|---|---|
| Şiddet içeriği | Yok |
| Cinsel içerik | Yok |
| Küfür/argo | Yok |
| Uyuşturucu/alkol | Yok |
| Korku/gerilim | Yok |
| Kumar | Yok |
| Kullanıcı etkileşimi (chat, UGC) | Yok |
| Konum verisi | Yok |
| Kişisel veri toplama | Yok |
| Reklam içeriği | Yok |

**Sonuç: PEGI 3 / Everyone** ✅

---

## Google Play Console Kurulum Adımları

### 1. Hesap Oluştur
- https://play.google.com/console adresine git
- Google hesabınla giriş yap
- **$25** tek seferlik kayıt ücreti öde

### 2. Uygulama Oluştur
- "Create app" → "Android" → "App"
- App name: `Futbol Trivia`
- Default language: Turkish (tr)
- Free app: ✅ Free
- Contains ads: ❌ No

### 3. Store Listing Doldur
→ `store-metadata.md` dosyasındaki **Google Play** bölümünü kullan

### 4. APK / AAB Yükle

EAS build tamamlandıktan sonra:
```bash
# Preview profili → APK (test için)
npx eas-cli build --platform android --profile preview

# Production profili → AAB (Play Store için)
npx eas-cli build --platform android --profile production
```

Production build sonrası:
```bash
npx eas-cli submit --platform android --latest
```

### 5. Gerekli Politikalar

Google Play şunları zorunlu tutar:
- ✅ Gizlilik Politikası URL: `https://futboltrivia.com.tr/gizlilik`
- ✅ Email adresi: `futboltriviatr@gmail.com`
- ✅ İçerik derecelendirmesi anketi (yukarıda)

### 6. Internal Test → Production

1. "Internal testing" track'e yükle → ekibinle test et
2. Hazırsa "Production" track'e promote et
3. Review süresi: **birkaç saat** (iOS'tan çok hızlı)

---

## SHA-256 Fingerprint (assetlinks.json için)

Android build tamamlanınca:
```bash
npx eas-cli credentials --platform android
```
Çıkan SHA-256 değerini `public/.well-known/assetlinks.json` dosyasına ekle.

---

# Sürüm Notları Şablonu

## v1.0.0 — İlk Sürüm
- Listeyi Tamamla, Top 10, Kariyer Yolu ve Takım Arkadaşı oyunları
- Kolay ve Zor zorluk seviyeleri
- Kişisel istatistik takibi
- Günlük hatırlatma bildirimleri

## v1.x.0 — Sonraki Sürümler (Şablon)
- [YENİ] ...
- [İYİLEŞTİRME] ...
- [DÜZELTME] ...

### Güncelleme Komutu
```bash
# app.json'da version ve build number'ı artır
# "version": "1.1.0", "buildNumber": "2", "versionCode": 2

npx eas-cli build --platform all --profile production --auto-submit
```
