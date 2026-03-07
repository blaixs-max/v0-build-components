"use client"

import { ListingCard } from "./listing-card"
import { ListingCardList } from "./listing-card-list"
import { ListingCardCompact } from "./listing-card-compact"
import type { ViewMode } from "./category-filter-bar"

interface Listing {
  id: string
  title: string
  location: string
  price: number
  imageUrl: string
  videoUrl?: string | null
  isFavorite?: boolean
  breed?: string
  age?: string
  weight?: string
}

interface ListingGridProps {
  listings: Listing[]
  onFavoriteClick?: (id: string) => void
  viewMode?: ViewMode
}

export function ListingGrid({ listings, onFavoriteClick, viewMode = "grid" }: ListingGridProps) {
  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-2 gap-3 px-4 pb-24">
        {listings.map((listing) => (
          <ListingCard key={listing.id} {...listing} onFavoriteClick={onFavoriteClick} />
        ))}
      </div>
    )
  }

  if (viewMode === "list") {
    return (
      <div className="flex flex-col gap-3 px-4 pb-24">
        {listings.map((listing) => (
          <ListingCardList key={listing.id} {...listing} onFavoriteClick={onFavoriteClick} />
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2 px-4 pb-24">
      {listings.map((listing) => (
        <ListingCardCompact key={listing.id} {...listing} onFavoriteClick={onFavoriteClick} />
      ))}
    </div>
  )
}
