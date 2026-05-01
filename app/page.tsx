"use client"

import { useState, useMemo, useRef, useEffect, useCallback } from "react"
import { SiteHeader } from "@/components/site-header"
import { HeroSection } from "@/components/hero-section"
import { FeaturedListings } from "@/components/featured-listings"
import { ListingToolbar, type SortOption, type ViewMode } from "@/components/listing-toolbar"
import { SearchFilterDrawer } from "@/components/search-filter-drawer"
import { CreateListingWizard, type ListingFormData } from "@/components/create-listing-wizard"
import { BottomNavigation } from "@/components/bottom-navigation"
import type { FilterValues } from "@/components/filter-bar"
import { PRICE_OPTIONS } from "@/components/filter-bar"
import { useUser } from "@/contexts/user-context"

interface DBListing {
  id: string
  title: string
  animalType: string
  breed: string
  age: string
  weight: string
  gender: string
  price: number
  priceType: string
  location: string
  city: string
  description: string
  imageUrl: string
  images: string[]
  earTag: string
  enterpriseNo: string | null
  enterpriseLabel: string | null
  createdAt: string
  sellerName: string
  sellerPhone: string
  isFavorite: boolean
}

const DEFAULT_FILTERS: FilterValues = {
  price: "all",
  breed: "all",
  priceType: "all",
  city: "all",
}

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<"buyukbas" | "kucukbas">("buyukbas")
  const [listings, setListings] = useState<DBListing[]>([])
  const [isLoadingListings, setIsLoadingListings] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateWizard, setShowCreateWizard] = useState(false)
  const [filters, setFilters] = useState<FilterValues>(DEFAULT_FILTERS)
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)
  const [sortOption, setSortOption] = useState<SortOption>("newest")
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [activeTab, setActiveTab] = useState<string>("home")
  const searchInputRef = useRef<HTMLInputElement>(null)

  const { addMyListing, addCreatedListing } = useUser()

  const fetchListings = useCallback(async () => {
    try {
      const res = await fetch("/api/listings")
      const data = await res.json()
      if (data.listings) {
        setListings(data.listings)
      }
    } catch {
      // silently fail
    }
    setIsLoadingListings(false)
  }, [])

  useEffect(() => {
    fetchListings()
  }, [fetchListings])

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    if (tab === "create") {
      setShowCreateWizard(true)
    } else if (tab === "search") {
      searchInputRef.current?.focus()
      searchInputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }

  const handleCreateListing = async (data: ListingFormData) => {
    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `${data.breed} ${data.gender === "disi" ? "İnek" : "Boğa"}`,
          animalType: data.category,
          breed: data.breed,
          age: data.age,
          weight: data.weight ? `${data.weight} kg` : null,
          gender: data.gender,
          price: Number(data.price),
          priceType: "sabit",
          location: data.city || "Konya",
          city: data.city || "Konya",
          description: data.description,
          imageUrl: data.photos[0] || "/simental-bull-cattle.jpg",
          images: data.photos,
          earTag: data.earTag,
          enterpriseNo: data.enterpriseNo,
          enterpriseLabel: data.enterpriseLabel,
        }),
      })

      if (res.ok) {
        const result = await res.json()
        addMyListing(result.id)
        addCreatedListing({
          id: result.id,
          title: `${data.breed} ${data.gender === "disi" ? "İnek" : "Boğa"}`,
          location: data.city || "Konya",
          price: Number(data.price),
          imageUrl: data.photos[0] || "/simental-bull-cattle.jpg",
          breed: data.breed,
          priceType: "sabit",
          category: data.category as "buyukbas" | "kucukbas",
        })
        // Refresh listings
        await fetchListings()
      }
    } catch {
      // silently fail
    }
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
    // Map DB listings to the shape components expect
    let result = listings
      .filter((listing) => listing.animalType === selectedCategory)
      .map((l) => ({
        id: l.id,
        title: l.title,
        location: l.location,
        city: l.city,
        price: l.price,
        imageUrl: l.imageUrl,
        images: l.images,
        isFavorite: l.isFavorite,
        breed: l.breed,
        priceType: l.priceType,
        category: l.animalType as "buyukbas" | "kucukbas",
        age: l.age,
        weight: l.weight,
        earTag: l.earTag,
        gender: l.gender,
        description: l.description,
        sellerName: l.sellerName,
        sellerPhone: l.sellerPhone,
        createdAt: l.createdAt,
      }))

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

    if (filters.price !== "all") {
      const priceRange = PRICE_OPTIONS.find((opt) => opt.value === filters.price)
      if (priceRange) {
        result = result.filter((l) => l.price >= priceRange.min && l.price <= priceRange.max)
      }
    }

    if (filters.breed !== "all") {
      result = result.filter((l) => l.breed.toLowerCase() === filters.breed.toLowerCase())
    }

    if (filters.priceType !== "all") {
      result = result.filter((l) => l.priceType === filters.priceType)
    }

    if (filters.city !== "all") {
      const cityValue = filters.city.split(":")[0]
      result = result.filter((l) => l.city.toLowerCase() === cityValue.toLowerCase())
    }

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
        break
    }

    return sorted.slice(0, 12)
  }, [listings, selectedCategory, searchQuery, filters, sortOption])

  if (showCreateWizard) {
    return <CreateListingWizard onClose={() => setShowCreateWizard(false)} onSubmit={handleCreateListing} />
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <SiteHeader />
      <main>
        <HeroSection
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
          inputRef={searchInputRef}
        />
        {isLoadingListings ? (
          <div className="flex justify-center py-12">
            <div className="animate-pulse text-muted-foreground">İlanlar yükleniyor...</div>
          </div>
        ) : (
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
        )}
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

      <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  )
}
