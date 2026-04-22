"use client"

import { useState, useMemo, useRef } from "react"
import { SiteHeader } from "@/components/site-header"
import { HeroSection } from "@/components/hero-section"
import { FeaturedListings } from "@/components/featured-listings"
import { CreateListingWizard, type ListingFormData } from "@/components/create-listing-wizard"
import { useUser } from "@/contexts/user-context"
import { demoListings } from "@/lib/listings-data"

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<"buyukbas" | "kucukbas">("buyukbas")
  const [listings, setListings] = useState(demoListings)
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateWizard, setShowCreateWizard] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const { addMyListing, addCreatedListing } = useUser()

  const handleCreateListing = (data: ListingFormData) => {
    const newId = `user_${Date.now()}`
    const newListing = {
      id: newId,
      title: `${data.breed} ${data.gender === "disi" ? "İnek" : "Boğa"}`,
      location: data.city || "Konya",
      city: data.city || "Konya",
      price: Number(data.price),
      imageUrl: data.photos[0] || "/simental-bull-cattle.jpg",
      images: data.photos,
      videoUrl: data.video || null,
      isFavorite: false,
      breed: data.breed,
      priceType: "sabit" as const,
      category: data.category as "buyukbas" | "kucukbas",
      age: data.age,
      weight: data.weight ? `${data.weight} kg` : undefined,
      createdAt: new Date().toISOString().split("T")[0],
    }
    addCreatedListing(newListing)
    addMyListing(newId)
    setListings((prev) => [newListing, ...prev])
    setShowCreateWizard(false)
  }

  const featuredListings = useMemo(() => {
    let result = listings.filter((listing) => listing.category === selectedCategory)

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (listing) =>
          listing.title.toLowerCase().includes(query) ||
          listing.location.toLowerCase().includes(query) ||
          listing.breed.toLowerCase().includes(query) ||
          listing.city.toLowerCase().includes(query),
      )
    }

    return result.slice(0, 8)
  }, [listings, selectedCategory, searchQuery])

  if (showCreateWizard) {
    return <CreateListingWizard onClose={() => setShowCreateWizard(false)} onSubmit={handleCreateListing} />
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <HeroSection
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
          inputRef={searchInputRef}
        />
        <FeaturedListings listings={featuredListings} />
      </main>
    </div>
  )
}
