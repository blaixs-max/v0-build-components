"use client"

import { useState, useMemo, useRef } from "react"
import { SearchHeader } from "@/components/search-header"
import { CategoryFilterBar, type SortOption, type ViewMode } from "@/components/category-filter-bar"
import { type FilterValues, PRICE_OPTIONS } from "@/components/filter-bar"
import { ListingGrid } from "@/components/listing-grid"
import { BottomNavigation } from "@/components/bottom-navigation"
import { CreateListingWizard } from "@/components/create-listing-wizard"
import { SearchFilterDrawer } from "@/components/search-filter-drawer"
import { useUser } from "@/contexts/user-context"
import { demoListings } from "@/lib/listings-data"

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<"buyukbas" | "kucukbas">("buyukbas")
  const [activeTab, setActiveTab] = useState("home")
  const [listings, setListings] = useState(demoListings)
  const [filters, setFilters] = useState<FilterValues>({ price: "all", breed: "all", priceType: "all", city: "all" })
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateWizard, setShowCreateWizard] = useState(false)
  const [sortOption, setSortOption] = useState<SortOption>("newest")
  const [showFilterDrawer, setShowFilterDrawer] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const searchInputRef = useRef<HTMLInputElement>(null)

  const { toggleFavorite, isFavorite, addMyListing, addCreatedListing } = useUser()

  const handleFavoriteClick = (id: string) => {
    toggleFavorite(id)
  }

  const handleFilterChange = (key: keyof FilterValues, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleClearFilters = () => {
    setFilters({ price: "all", breed: "all", priceType: "all", city: "all" })
  }

  const handleTabChange = (tab: string) => {
    if (tab === "create") {
      setShowCreateWizard(true)
    } else if (tab === "search") {
      setActiveTab(tab)
      // Arama inputuna focus ver
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 100)
    } else {
      setActiveTab(tab)
    }
  }

  const handleCreateListing = (data: {
    category: "buyukbas" | "kucukbas"
    gender: string
    breed: string
    age: string
    weight: string
    price: string
    photos: string[]
    video: string | null
    city: string
    district: string
  }) => {
    const newId = `user_${Date.now()}`
    const newListing = {
      id: newId,
      title: `${data.breed} ${data.gender === "disi" ? "İnek" : "Boğa"}`,
      location: data.city || "Konya",
      city: data.city || "Konya",
      price: Number(data.price),
      imageUrl: data.photos[0] || "/simental-bull-cattle.jpg",
      images: data.photos || [],
      videoUrl: data.video || null,
      isFavorite: false,
      breed: data.breed,
      priceType: "sabit" as const,
      category: data.category,
      age: data.age,
      weight: data.weight ? `${data.weight} kg` : undefined,
      createdAt: new Date().toISOString().split("T")[0],
    }
    addCreatedListing(newListing)
    addMyListing(newId)
    setListings((prev) => [newListing, ...prev])
    setShowCreateWizard(false)
    setActiveTab("home")
  }

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filters.price !== "all") count++
    if (filters.breed !== "all") count++
    if (filters.priceType !== "all") count++
    if (filters.city !== "all") count++
    return count
  }, [filters])

  const filteredListings = useMemo(() => {
    let result = listings.filter((listing) => {
      if (listing.category !== selectedCategory) return false

      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch =
          listing.title.toLowerCase().includes(query) ||
          listing.location.toLowerCase().includes(query) ||
          listing.breed.toLowerCase().includes(query)
        if (!matchesSearch) return false
      }

      if (filters.price !== "all") {
        const priceOption = PRICE_OPTIONS.find((opt) => opt.value === filters.price)
        if (priceOption) {
          if (listing.price < priceOption.min || listing.price > priceOption.max) return false
        }
      }

      if (filters.breed !== "all" && listing.breed !== filters.breed) return false
      if (filters.priceType !== "all" && listing.priceType !== filters.priceType) return false

      if (filters.city !== "all") {
        const cityMap: Record<string, string> = {
          ankara: "Ankara",
          balikesir: "Balıkesir",
          bursa: "Bursa",
          izmir: "İzmir",
          konya: "Konya",
          manisa: "Manisa",
          samsun: "Samsun",
        }
        if (listing.city !== cityMap[filters.city]) return false
      }

      return true
    })

    switch (sortOption) {
      case "price-low":
        result = [...result].sort((a, b) => a.price - b.price)
        break
      case "price-high":
        result = [...result].sort((a, b) => b.price - a.price)
        break
      case "newest":
      case "closest":
      default:
        break
    }

    return result
  }, [listings, selectedCategory, searchQuery, filters, sortOption])

  const filteredListingsWithFavorites = useMemo(() => {
    return filteredListings.map((listing) => ({
      ...listing,
      isFavorite: isFavorite(listing.id),
    }))
  }, [filteredListings, isFavorite])

  if (showCreateWizard) {
    return <CreateListingWizard onClose={() => setShowCreateWizard(false)} onSubmit={handleCreateListing} />
  }

  return (
    <div className="min-h-screen bg-background">
      <SearchHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} inputRef={searchInputRef} />

      <main className="pb-20">
        <CategoryFilterBar
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
          onFilterClick={() => setShowFilterDrawer(true)}
          sortOption={sortOption}
          onSortChange={setSortOption}
          activeFilterCount={activeFilterCount}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        <SearchFilterDrawer
          filters={filters}
          category={selectedCategory}
          onFilterChange={handleFilterChange}
          onCategoryChange={setSelectedCategory}
          onClearFilters={handleClearFilters}
          onApply={() => setShowFilterDrawer(false)}
          open={showFilterDrawer}
          onOpenChange={setShowFilterDrawer}
        />

        <div className="mt-3">
          {filteredListingsWithFavorites.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="text-6xl mb-4">{selectedCategory === "buyukbas" ? "🐄" : "🐑"}</div>
              <h3 className="text-lg font-semibold text-foreground mb-2">İlan bulunamadı</h3>
              <p className="text-sm text-muted-foreground">
                Arama kriterlerinize uygun ilan bulunamadı. Filtreleri değiştirmeyi deneyin.
              </p>
            </div>
          ) : (
            <>
              <p className="px-4 text-sm text-muted-foreground mb-3">
                {filteredListingsWithFavorites.length} ilan bulundu
              </p>
              <ListingGrid
                listings={filteredListingsWithFavorites}
                onFavoriteClick={handleFavoriteClick}
                viewMode={viewMode}
              />
            </>
          )}
        </div>
      </main>

      <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  )
}
