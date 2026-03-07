"use client"

import { useMemo } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useUser } from "@/contexts/user-context"
import { ListingCard } from "@/components/listing-card"

// Demo ilanlar (ana sayfadakiyle ayni)
const allListings = [
  {
    id: "1",
    title: "Simental Boğa",
    location: "Konya",
    price: 32500,
    imageUrl: "/simental-bull-cattle.jpg",
    breed: "simental",
    priceType: "sabit",
    category: "buyukbas" as const,
  },
  {
    id: "2",
    title: "Simental İnek",
    location: "Konya",
    price: 28000,
    imageUrl: "/simental-cow-cattle.jpg",
    breed: "simental",
    priceType: "pazarlik",
    category: "buyukbas" as const,
  },
  {
    id: "3",
    title: "Holstein İnek",
    location: "İzmir",
    price: 35000,
    imageUrl: "/holstein-black-white-dairy-cow.jpg",
    breed: "holstein",
    priceType: "sabit",
    category: "buyukbas" as const,
  },
  {
    id: "4",
    title: "Montofon Düve",
    location: "Bursa",
    price: 24500,
    imageUrl: "/brown-swiss-heifer-cattle.jpg",
    breed: "montofon",
    priceType: "pazarlik",
    category: "buyukbas" as const,
  },
  {
    id: "5",
    title: "Angus Tosun",
    location: "Ankara",
    price: 42000,
    imageUrl: "/angus-black-bull-cattle.jpg",
    breed: "angus",
    priceType: "sabit",
    category: "buyukbas" as const,
  },
  {
    id: "6",
    title: "Jersey İnek",
    location: "Balıkesir",
    price: 31000,
    imageUrl: "/jersey-brown-dairy-cow.jpg",
    breed: "jersey",
    priceType: "sabit",
    category: "buyukbas" as const,
  },
  {
    id: "7",
    title: "Merinos Koç",
    location: "Konya",
    price: 8500,
    imageUrl: "/merino-ram-sheep-wool.jpg",
    breed: "merinos",
    priceType: "sabit",
    category: "kucukbas" as const,
  },
  {
    id: "8",
    title: "Akkaraman Koyun",
    location: "Ankara",
    price: 4500,
    imageUrl: "/akkaraman-sheep-white.jpg",
    breed: "akkaraman",
    priceType: "pazarlik",
    category: "kucukbas" as const,
  },
  {
    id: "9",
    title: "Kıvırcık Kuzu",
    location: "Balıkesir",
    price: 3200,
    imageUrl: "/kivircik-lamb-sheep.jpg",
    breed: "kivircik",
    priceType: "sabit",
    category: "kucukbas" as const,
  },
  {
    id: "10",
    title: "Merinos Koyun",
    location: "Manisa",
    price: 6000,
    imageUrl: "/merino-sheep-wool-white.jpg",
    breed: "merinos",
    priceType: "pazarlik",
    category: "kucukbas" as const,
  },
]

export default function FavorilerimPage() {
  const router = useRouter()
  const { favorites, toggleFavorite, isFavorite } = useUser()

  const favoriteListings = useMemo(() => {
    return allListings
      .filter((listing) => favorites.includes(listing.id))
      .map((listing) => ({
        ...listing,
        isFavorite: true,
      }))
  }, [favorites])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background border-b">
        <div className="flex items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-10 w-10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">Favorilerim</h1>
          <span className="ml-auto text-sm text-muted-foreground">{favoriteListings.length} ilan</span>
        </div>
      </header>

      <main className="pb-8">
        {favoriteListings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-4">
              <Heart className="h-10 w-10 text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Henüz favoriniz yok</h3>
            <p className="text-sm text-muted-foreground max-w-xs mb-6">
              İlanlardaki kalp ikonuna tıklayarak favorilerinize ekleyebilirsiniz.
            </p>
            <Button onClick={() => router.push("/")} className="bg-meradan-green hover:bg-meradan-green/90">
              İlanlara Göz At
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 p-4">
            {favoriteListings.map((listing) => (
              <ListingCard key={listing.id} {...listing} onFavoriteClick={toggleFavorite} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
