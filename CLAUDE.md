# CLAUDE.md - Mera'dan Proje Rehberi

## Proje Hakkinda
Mera'dan - Turkiye'nin Hayvan Pazari. Next.js 16 + React 19 ile gelistirilmis mobil-oncelikli hayvan pazari uygulamasi.

## Teknoloji Yigini
- **Framework:** Next.js 16.0.10 (App Router, Turbopack)
- **UI:** React 19, Tailwind CSS v4, shadcn/ui (60+ bilesen)
- **State:** React Context API (auth + listings + offers context'leri)
- **Form:** React Hook Form + Zod
- **Lint:** ESLint 10 + Prettier
- **Paket Yoneticisi:** Bun
- **Dil:** TypeScript (strict mode)

## Proje Yapisi
```
app/                    # Next.js App Router sayfalari
  page.tsx              # Ana sayfa (ilan listesi)
  giris/page.tsx        # Giris/kayit
  profil/page.tsx       # Kullanici profili
  favorilerim/page.tsx  # Favoriler
  tekliflerim/page.tsx  # Teklifler
  ilanlarim/page.tsx    # Kullanici ilanlari
  bildirimler/page.tsx  # Bildirimler
  ayarlar/page.tsx      # Hesap ayarlari
  yardim/page.tsx       # SSS ve iletisim
  ilan/[id]/page.tsx    # Ilan detay
  error.tsx             # Global error boundary
  not-found.tsx         # 404 sayfasi
  loading.tsx           # Loading state
components/             # React bilesenler
  ui/                   # shadcn/ui primitifleri
  wizard/               # Ilan olusturma alt bilesenler
    wizard-types.ts     # Tip tanimlari ve sabitler
    step-category.tsx   # Kategori secimi (buyukbas/kucukbas)
    step-details-cattle.tsx  # Buyukbas detaylari
    step-details-sheep.tsx   # Kucukbas detaylari
    step-price-media.tsx     # Fiyat ve medya
  create-listing-wizard.tsx  # Ilan olusturma orchestrator
  offers-list.tsx       # Teklif listesi (366 satir)
  search-filter-drawer.tsx   # Filtre paneli
contexts/
  auth-context.tsx      # Kimlik dogrulama (User, login, logout)
  listings-context.tsx  # Ilan yonetimi (favoriler, kullanici ilanlari)
  offers-context.tsx    # Teklif yonetimi (gonderme, alma, durum)
  user-context.tsx      # Birlesik facade (useUser hook - geriye uyumlu)
lib/
  listings-data.ts      # Demo ilan verileri (941 satir)
  turkey-locations.ts   # Turkiye il/ilce verileri
```

## Onemli Komutlar
```bash
bun install          # Bagimliliklari yukle
bun run dev          # Gelistirme sunucusu
bun run build        # Uretim derlemesi
bun run lint         # ESLint kontrolu
bun run format       # Prettier ile formatla
bun run typecheck    # TypeScript tip kontrolu
```

## Gelistirme Kurallari
- Turkce UI metinleri icin dogru karakter kullanin (i/I, o/O, u/U, g/G, c/C, s/S)
- `BottomNavigation` bilesen her zaman `activeTab` prop'u gerektirir
- Yeni ilan olusturulurken `addMyListing` ve `addCreatedListing` mutlaka cagrilmali
- localStorage islemleri try-catch ile sarilmali
- `ListingFormData` tipi `create-listing-wizard.tsx`'den export edilir (kaynak: wizard/wizard-types.ts)
- Kullanici olusturdugu ilanlar `userCreatedListings` context'inde saklanir
- Yeni context eklerken `useUser` facade'ina da eklenmelidir (geriye uyumluluk)

## Context Mimarisi
```
AuthProvider          # En icte - User state, login/logout
  └─ ListingsProvider # Favoriler, ilanlar
       └─ OffersProvider  # Teklifler
            └─ LoadingGate    # Yukleme ekrani
                 └─ children
```
`useUser()` hook'u tum context'leri birlestirerek geriye uyumlu API saglar.

## Bilinen Sinirlamalar
- Tum veri localStorage'da (Firebase backend planlanmis)
- Test dosyalari henuz yok
- offers-list.tsx (366 satir) henuz parcalanmadi
- /guvenlik sayfasi henuz yok (ayarlar icinde birlestirildi)
