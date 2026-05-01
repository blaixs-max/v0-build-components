"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useUser } from "@/contexts/user-context"
import { ListingCard } from "@/components/listing-card"
import { SiteHeader } from "@/components/site-header"
import type { Listing } from "@/lib/listings-data"

export default function FavorilerimPage() {
  const router = useRouter()
  const { favorites, toggleFavorite } = useUser()
  const [allListings, setAllListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch("/api/listings")
        const data = await res.json()
        setAllListings(data.listings || [])
      } catch {
        setAllListings([])
      } finally {
        setLoading(false)
      }
    }
    fetchListings()
  }, [])

  const favoriteListings = allListings
    .filter((listing) => favorites.includes(listing.id))
    .map((listing) => ({ ...listing, isFavorite: true }))

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Sayfa Alt Başlığı */}
      <div className="border-b border-border/60 bg-card">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-4 md:px-6 lg:px-10">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-10 w-10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">Favorilerim</h1>
          <span className="ml-auto text-sm text-muted-foreground">{favoriteListings.length} ilan</span>
        </div>
      </div>

      <main className="mx-auto max-w-7xl pb-8">
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
          <div className="grid grid-cols-2 gap-3 p-4 md:grid-cols-3 md:gap-4 md:px-6 lg:grid-cols-4 lg:px-10">
            {favoriteListings.map((listing) => (
              <ListingCard key={listing.id} {...listing} onFavoriteClick={toggleFavorite} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
