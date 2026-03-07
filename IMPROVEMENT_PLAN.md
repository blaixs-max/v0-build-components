# Mera'dan - Firebase Uretim Iyilestirme Plani

## FAZ 1: Firebase Altyapisi (1. Hafta)

### 1.1 Firebase Kurulumu
- [ ] `firebase` ve `firebase-admin` paketleri kurulumu
- [ ] `lib/firebase.ts` - Firebase client konfigurasyonu
- [ ] `lib/firebase-admin.ts` - Server-side admin SDK
- [ ] `.env.example` dosyasi (NEXT_PUBLIC_FIREBASE_* degiskenleri)

### 1.2 Firebase Auth (Telefon OTP)
- [ ] Firebase Phone Auth entegrasyonu
- [ ] `contexts/auth-context.tsx` - Auth state yonetimi (user-context'ten ayrilacak)
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

## FAZ 2: Kod Kalitesi ve Refactoring (2. Hafta)

### 2.1 Buyuk Bilesenleri Parcalama
- [ ] `create-listing-wizard.tsx` (647 satir) →
  - `components/wizard/step-category.tsx`
  - `components/wizard/step-details-cattle.tsx`
  - `components/wizard/step-details-sheep.tsx`
  - `components/wizard/step-price-media.tsx`
  - `components/wizard/wizard-layout.tsx`
- [ ] `offers-list.tsx` (366 satir) →
  - `components/offers/offer-card.tsx`
  - `components/offers/offer-timeline.tsx`
  - `components/offers/offer-actions.tsx`
- [ ] `user-context.tsx` (380 satir) →
  - `contexts/auth-context.tsx` (auth islemleri)
  - `contexts/listings-context.tsx` (ilan CRUD + Firestore)
  - `contexts/offers-context.tsx` (teklif yonetimi + Firestore)

### 2.2 ESLint + Prettier + Husky
- [ ] `.eslintrc.json` konfigurasyonu
- [ ] `.prettierrc` konfigurasyonu
- [ ] `husky` + `lint-staged` pre-commit hook
- [ ] Mevcut dosyalari lint'ten gecirme

### 2.3 Hata Yonetimi
- [ ] `app/error.tsx` - Global error boundary
- [ ] `app/not-found.tsx` - 404 sayfasi
- [ ] Toast ile kullaniciya hata gosterme (sonner zaten yuklu)

---

## FAZ 3: Eksik Sayfalar (3. Hafta)

### 3.1 Ilanlarim Sayfasi
- [ ] `app/ilanlarim/page.tsx` - Aktif/pasif/satilmis ilanlar
- [ ] Ilan duzenleme ve silme butonlari

### 3.2 Ilan Duzenleme
- [ ] `app/ilan/[id]/duzenle/page.tsx`
- [ ] Mevcut verileri form'a doldurma
- [ ] Gorsel ekleme/cikarma

### 3.3 Bildirimler
- [ ] `app/bildirimler/page.tsx`
- [ ] Yeni teklif, teklif kabul/red bildirimleri
- [ ] Okundu/okunmadi durumu

### 3.4 Ayarlar ve Diger
- [ ] `app/ayarlar/page.tsx` - Profil duzenleme, bildirim tercihleri
- [ ] `app/guvenlik/page.tsx` - Guvenlik ayarlari
- [ ] `app/yardim/page.tsx` - SSS, iletisim formu

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

## Oncelik Sirasi

| Sira | Gorev | Faz |
|------|-------|-----|
| 1 | Firebase Auth (OTP) | 1.2 |
| 2 | Firestore veritabani | 1.3 |
| 3 | Firebase Storage | 1.4 |
| 4 | Buyuk bilesen parcalama | 2.1 |
| 5 | ESLint + Prettier | 2.2 |
| 6 | Hata yonetimi | 2.3 |
| 7 | Eksik sayfalar | 3.x |
| 8 | Test altyapisi | 4.x |
| 9 | Performans + SEO | 5.1-5.2 |
| 10 | Mesajlasma + Odeme | 5.3-5.4 |
