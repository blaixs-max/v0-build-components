"use client"

import { useState, useMemo, useRef } from "react"
import { SiteHeader } from "@/components/site-header"
import { HeroSection } from "@/components/hero-section"
import { FeaturedListings } from "@/components/featured-listings"
import { ListingToolbar, type SortOption, type ViewMode } from "@/components/listing-toolbar"
import { SearchFilterDrawer } from "@/components/search-filter-drawer"
import { CreateListingWizard, type ListingFormData } from "@/components/create-listing-wizard"
import type { FilterValues } from "@/components/filter-bar"
import { PRICE_OPTIONS } from "@/components/filter-bar"
import { useUser } from "@/contexts/user-context"
import { demoListings } from "@/lib/listings-data"

const DEFAULT_FILTERS: FilterValues = {
  price: "all",
  breed: "all",
  priceType: "all",
  city: "all",
}

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<"buyukbas" | "kucukbas">("buyukbas")
  const [listings, setListings] = useState(demoListings)
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateWizard, setShowCreateWizard] = useState(false)
  const [filters, setFilters] = useState<FilterValues>(DEFAULT_FILTERS)
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)
  const [sortOption, setSortOption] = useState<SortOption>("newest")
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
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

  const handleFilterChange = (key: keyof FilterValues, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleClearFilters = () => setFilters(DEFAULT_FILTERS)

  const activeFilterCount = useMemo(() => {
    return (Object.keys(filters) as (keyof FilterValues)[]).reduce(
      (count, key) => count + (filters[key] !== "all" ? 1 : 0),
      0,
    )
  }, [filters])

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

    // Fiyat aralığı filtresi
    if (filters.price !== "all") {
      const priceRange = PRICE_OPTIONS.find((opt) => opt.value === filters.price)
      if (priceRange) {
        result = result.filter((l) => l.price >= priceRange.min && l.price <= priceRange.max)
      }
    }

    // Cins filtresi
    if (filters.breed !== "all") {
      result = result.filter((l) => l.breed.toLowerCase() === filters.breed.toLowerCase())
    }

    // Fiyat tipi filtresi
    if (filters.priceType !== "all") {
      result = result.filter((l) => l.priceType === filters.priceType)
    }

    // Şehir filtresi (şehir veya şehir:ilçe formatında)
    if (filters.city !== "all") {
      const cityValue = filters.city.split(":")[0]
      result = result.filter((l) => l.city.toLowerCase() === cityValue.toLowerCase())
    }

    // Sıralama
    const sorted = [...result]
    switch (sortOption) {
      case "price-low":
        sorted.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        sorted.sort((a, b) => b.price - a.price)
        break
      case "newest":
        sorted.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""))
        break
      case "closest":
        // Konum bilgisi olmadığı için mevcut sırayı koruyoruz
        break
    }

    return sorted.slice(0, 12)
  }, [listings, selectedCategory, searchQuery, filters, sortOption])

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
        <FeaturedListings
          listings={featuredListings}
          viewMode={viewMode}
          toolbar={
            <ListingToolbar
              onFilterClick={() => setFilterDrawerOpen(true)}
              activeFilterCount={activeFilterCount}
              sortOption={sortOption}
              onSortChange={setSortOption}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />
          }
        />
      </main>

      <SearchFilterDrawer
        filters={filters}
        category={selectedCategory}
        onFilterChange={handleFilterChange}
        onCategoryChange={setSelectedCategory}
        onClearFilters={handleClearFilters}
        onApply={() => setFilterDrawerOpen(false)}
        open={filterDrawerOpen}
        onOpenChange={setFilterDrawerOpen}
      />
    </div>
  )
}
