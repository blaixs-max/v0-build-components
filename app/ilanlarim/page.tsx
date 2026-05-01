"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useUser } from "@/contexts/user-context"
import { ListingCard } from "@/components/listing-card"
import { SiteHeader } from "@/components/site-header"
import { BottomNavigation } from "@/components/bottom-navigation"
import type { Listing } from "@/lib/listings-data"

export default function IlanlarimPage() {
  const router = useRouter()
  const { user, isLoggedIn, toggleFavorite, favorites } = useUser()
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/giris")
      return
    }
  }, [isLoggedIn, router])

  useEffect(() => {
    if (!user) return
    const fetchMyListings = async () => {
      try {
        const res = await fetch("/api/listings")
        const data = await res.json()
        const myListings = data.listings?.filter(
          (l: Listing & { userId: string }) => l.userId === user.phone
        ) || []
        setListings(myListings)
      } catch {
        setListings([])
      } finally {
        setLoading(false)
      }
    }
    fetchMyListings()
  }, [user])

  if (!isLoggedIn || !user) return null

  return (
    <div className="min-h-screen bg-background pb-24">
      <SiteHeader />

      <div className="border-b border-border/60 bg-card">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-4 md:px-6 lg:px-10">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-10 w-10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">Ilanlarim</h1>
          <span className="ml-auto text-sm text-muted-foreground">{listings.length} ilan</span>
        </div>
      </div>

      <main className="mx-auto max-w-7xl pb-8">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-meradan-green border-t-transparent" />
          </div>
        ) : listings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-20 h-20 bg-meradan-green/10 rounded-full flex items-center justify-center mb-4">
              <Package className="h-10 w-10 text-meradan-green" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Henuz ilaniniz yok</h3>
            <p className="text-sm text-muted-foreground max-w-xs mb-6">
              Hayvanlarinizi satisa cikarmak icin ilan verebilirsiniz.
            </p>
            <Button onClick={() => router.push("/")} className="bg-meradan-green hover:bg-meradan-green/90">
              Ilan Ver
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 p-4 md:grid-cols-3 md:gap-4 md:px-6 lg:grid-cols-4 lg:px-10">
            {listings.map((listing) => (
              <ListingCard
                key={listing.id}
                {...listing}
                isFavorite={favorites.includes(listing.id)}
                onFavoriteClick={toggleFavorite}
              />
            ))}
          </div>
        )}
      </main>

      <BottomNavigation activeTab="home" />
    </div>
  )
}
