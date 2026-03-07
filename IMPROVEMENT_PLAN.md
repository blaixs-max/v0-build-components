# Mera'dan - Firebase Uretim Iyilestirme Plani

## FAZ 1: Firebase Altyapisi (1. Hafta)

### 1.1 Firebase Kurulumu
- [ ] `firebase` ve `firebase-admin` paketleri kurulumu
- [ ] `lib/firebase.ts` - Firebase client konfigurasyonu
- [ ] `lib/firebase-admin.ts` - Server-side admin SDK
- [ ] `.env.example` dosyasi (NEXT_PUBLIC_FIREBASE_* degiskenleri)

### 1.2 Firebase Auth (Telefon OTP)
- [ ] Firebase Phone Auth entegrasyonu
- [x] `contexts/auth-context.tsx` - Auth state yonetimi (user-context'ten ayrildi)
- [ ] `app/giris/page.tsx` guncelleme - Firebase Auth ile giris
- [ ] `middleware.ts` - Korunmus route'lar (/profil, /tekliflerim, /favorilerim)

### 1.3 Firestore Veritabani
- [ ] Koleksiyonlar: `users`, `listings`, `offers`, `messages`, `notifications`
- [ ] `lib/firestore.ts` - CRUD islemleri (addListing, getListings, addOffer, vb.)
- [ ] `firestore.rules` - Guvenlik kurallari
- [ ] localStorage'dan Firestore'a veri gecisi

### 1.4 Firebase Storage
- [ ] Gorsel yukleme (maks 5 foto + 1 video per ilan)
- [ ] `lib/storage.ts` - Upload/delete fonksiyonlari
- [ ] `components/image-upload.tsx` - Gercek yukleme bileseni (ilerleme gostergeli)
- [ ] Client-side gorsel boyutlandirma

---

## FAZ 2: Kod Kalitesi ve Refactoring (2. Hafta) ✅ TAMAMLANDI

### 2.1 Buyuk Bilesenleri Parcalama ✅
- [x] `create-listing-wizard.tsx` (647 satir) → 5 alt bilesen
  - `components/wizard/wizard-types.ts`
  - `components/wizard/step-category.tsx`
  - `components/wizard/step-details-cattle.tsx`
  - `components/wizard/step-details-sheep.tsx`
  - `components/wizard/step-price-media.tsx`
- [ ] `offers-list.tsx` (366 satir) → parcalanacak
- [x] `user-context.tsx` (380 satir) → 3 ayri context
  - `contexts/auth-context.tsx` (auth islemleri)
  - `contexts/listings-context.tsx` (ilan CRUD)
  - `contexts/offers-context.tsx` (teklif yonetimi)

### 2.2 ESLint + Prettier ✅
- [x] `eslint.config.mjs` konfigurasyonu (ESLint 10 flat config)
- [x] `.prettierrc` konfigurasyonu
- [x] Mevcut dosyalari lint'ten gecirme (0 hata)
- [ ] `husky` + `lint-staged` pre-commit hook (opsiyonel)

### 2.3 Hata Yonetimi ✅
- [x] `app/error.tsx` - Global error boundary
- [x] `app/not-found.tsx` - 404 sayfasi
- [x] Toast ile kullaniciya hata gosterme (sonner zaten yuklu)

---

## FAZ 3: Eksik Sayfalar (3. Hafta) ✅ BUYUK OLCUDE TAMAMLANDI

### 3.1 Ilanlarim Sayfasi ✅
- [x] `app/ilanlarim/page.tsx` - Aktif/satilmis ilanlar
- [x] Ilan goruntuleme ve silme butonlari

### 3.2 Ilan Duzenleme
- [ ] `app/ilan/[id]/duzenle/page.tsx`
- [ ] Mevcut verileri form'a doldurma
- [ ] Gorsel ekleme/cikarma

### 3.3 Bildirimler ✅
- [x] `app/bildirimler/page.tsx`
- [x] Yeni teklif, teklif kabul/red bildirimleri

### 3.4 Ayarlar ve Diger ✅
- [x] `app/ayarlar/page.tsx` - Profil duzenleme, bildirim tercihleri, guvenlik
- [x] `app/yardim/page.tsx` - SSS, iletisim formu

### 3.5 Profil Iyilestirmeleri ✅
- [x] Dinamik ilan sayisi (hardcoded degil)
- [x] Dinamik teklif ve bildirim sayilari

---

## FAZ 4: Test Altyapisi (4. Hafta)

### 4.1 Kurulum
- [ ] Jest + React Testing Library + `jest.config.ts`
- [ ] Firebase emulators (test ortami)

### 4.2 Testler
- [ ] Birim: `calculateUserLevel`, filtre logikleri, Firestore CRUD
- [ ] Bilesen: `ListingCard`, `OfferModal`, `CreateListingWizard`
- [ ] E2E (opsiyonel): Playwright ile kritik akislar

---

## FAZ 5: Performans, SEO, Gelismis (5. Hafta+)

### 5.1 Performans
- [ ] Firestore pagination (limit + startAfter)
- [ ] React.memo + useMemo optimizasyonlari
- [ ] Skeleton loading state'leri

### 5.2 SEO
- [ ] Dinamik metadata (`generateMetadata`)
- [ ] Open Graph + `sitemap.ts` + `robots.ts`

### 5.3 Mesajlasma
- [ ] Alici-satici mesajlasma (Firestore real-time listeners)

### 5.4 Odeme (Gelecek)
- [ ] iyzico entegrasyonu + emanet odeme sistemi

### 5.5 PWA
- [ ] Service Worker, App manifest, offline destek

---

## Ilerleme Ozeti

| Faz | Durum | Tamamlanma |
|-----|-------|------------|
| 1 - Firebase Altyapisi | Beklemede | %5 |
| 2 - Kod Kalitesi | ✅ Tamamlandi | %90 |
| 3 - Eksik Sayfalar | ✅ Buyuk olcude | %80 |
| 4 - Test Altyapisi | Beklemede | %0 |
| 5 - Performans/SEO | Beklemede | %0 |
