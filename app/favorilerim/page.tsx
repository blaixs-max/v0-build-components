"use client"

import { useMemo } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useUser } from "@/contexts/user-context"
import { ListingCard } from "@/components/listing-card"
import { demoListings } from "@/lib/listings-data"

export default function FavorilerimPage() {
  const router = useRouter()
  const { favorites, toggleFavorite, userCreatedListings } = useUser()

  const favoriteListings = useMemo(() => {
    const allListings = [...demoListings, ...userCreatedListings]
    return allListings
      .filter((listing) => favorites.includes(listing.id))
      .map((listing) => ({
        ...listing,
        isFavorite: true,
      }))
  }, [favorites, userCreatedListings])

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
