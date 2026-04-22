import { FeaturedListingCard } from "./featured-listing-card"
import type { Listing } from "@/lib/listings-data"

interface FeaturedListingsProps {
  listings: Listing[]
}

export function FeaturedListings({ listings }: FeaturedListingsProps) {
  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-10 lg:px-10">
      <h2 className="mb-6 text-2xl font-bold text-foreground md:text-[26px]">Öne Çıkan İlanlar</h2>
      <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
        {listings.map((listing) => (
          <FeaturedListingCard
            key={listing.id}
            id={listing.id}
            title={listing.title}
            city={listing.city}
            price={listing.price}
            imageUrl={listing.imageUrl}
          />
        ))}
      </div>
    </section>
  )
}
