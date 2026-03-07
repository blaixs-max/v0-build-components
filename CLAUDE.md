# CLAUDE.md - Mera'dan Proje Rehberi

## Proje Hakkinda
Mera'dan - Turkiye'nin Hayvan Pazari. Next.js 16 + React 19 ile gelistirilmis mobil-oncelikli hayvan pazari uygulamasi.

## Teknoloji Yigini
- **Framework:** Next.js 16.0.10 (App Router, Turbopack)
- **UI:** React 19, Tailwind CSS v4, shadcn/ui (60+ bilesen)
- **State:** React Context API (user-context.tsx)
- **Form:** React Hook Form + Zod
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
  ilan/[id]/page.tsx    # Ilan detay
components/             # React bilesenler
  ui/                   # shadcn/ui primitifleri
  create-listing-wizard.tsx  # Ilan olusturma (647 satir)
  offers-list.tsx       # Teklif listesi (366 satir)
  search-filter-drawer.tsx   # Filtre paneli
contexts/
  user-context.tsx      # Kullanici state yonetimi (380 satir)
lib/
  listings-data.ts      # Demo ilan verileri (941 satir)
  turkey-locations.ts   # Turkiye il/ilce verileri
```

## Onemli Komutlar
```bash
bun install          # Bagimliliklari yukle
bun run dev          # Gelistirme sunucusu
bun run build        # Uretim derlemesi
bun run lint         # Lint kontrolu
```

## Gelistirme Kurallari
- Turkce UI metinleri icin dogru karakter kullanin (i/I, o/O, u/U, g/G, c/C, s/S)
- `BottomNavigation` bilesen her zaman `activeTab` prop'u gerektirir
- Yeni ilan olusturulurken `addMyListing` ve `addCreatedListing` mutlaka cagrilmali
- localStorage islemleri try-catch ile sarilmali
- `ListingFormData` tipi `create-listing-wizard.tsx`'den export edilir
- Kullanici olusturdugu ilanlar `userCreatedListings` context'inde saklanir

## Bilinen Sinirlamalar
- Tum veri localStorage'da (backend yok)
- Test dosyalari yok
- ESLint konfigurasyonu yok
- Bazi sayfalar eksik (/ilanlarim, /bildirimler, /ayarlar)
