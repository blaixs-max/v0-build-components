import Image from "next/image"
import Link from "next/link"
import { MapPin, PlayCircle } from "lucide-react"
import { FeaturedListingCard } from "./featured-listing-card"
import type { Listing } from "@/lib/listings-data"
import type { ReactNode } from "react"
import type { ViewMode } from "./listing-toolbar"

interface FeaturedListingsProps {
  listings: Listing[]
  viewMode?: ViewMode
  toolbar?: ReactNode
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("tr-TR").format(value)
}

function FeaturedListingRow({ listing }: { listing: Listing }) {
  const hasVideo = Boolean(listing.videoUrl)
  return (
    <Link
      href={`/ilan/${listing.id}`}
      className="group flex gap-4 overflow-hidden rounded-xl bg-card p-3 shadow-sm ring-1 ring-border/60 transition-all hover:shadow-md"
    >
      <div className="relative h-28 w-40 flex-shrink-0 overflow-hidden rounded-lg bg-muted sm:h-32 sm:w-48">
        <Image
          src={listing.imageUrl || "/placeholder.svg"}
          alt={listing.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="192px"
        />
        {hasVideo && (
          <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-meradan-green px-2 py-0.5 text-[10px] font-semibold text-white shadow-sm">
            <PlayCircle className="h-3 w-3" strokeWidth={2.4} />
            Videolu
          </span>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-2 py-1">
        <h3 className="truncate text-base font-semibold text-foreground sm:text-lg">{listing.title}</h3>
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold text-foreground sm:text-xl">{formatPrice(listing.price)} TL</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-meradan-green-light px-2.5 py-1 text-xs font-medium text-meradan-green">
            <MapPin className="h-3 w-3" strokeWidth={2.4} />
            {listing.city}
          </span>
        </div>
        {listing.breed && (
          <p className="text-sm text-muted-foreground capitalize">
            {listing.breed}
            {listing.age ? ` • ${listing.age}` : ""}
          </p>
        )}
      </div>
    </Link>
  )
}

export function FeaturedListings({ listings, viewMode = "grid", toolbar }: FeaturedListingsProps) {
  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-10 lg:px-10">
      {toolbar && <div className="mb-8">{toolbar}</div>}
      <h2 className="mb-6 text-2xl font-bold text-foreground md:text-[26px]">Öne Çıkan İlanlar</h2>

      {listings.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center text-muted-foreground">
          Bu kriterlere uygun ilan bulunamadı.
        </div>
      ) : viewMode === "list" ? (
        <div className="flex flex-col gap-4">
          {listings.map((listing) => (
            <FeaturedListingRow key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
          {listings.map((listing) => (
            <FeaturedListingCard
              key={listing.id}
              id={listing.id}
              title={listing.title}
              city={listing.city}
              price={listing.price}
              imageUrl={listing.imageUrl}
              videoUrl={listing.videoUrl}
            />
          ))}
        </div>
      )}
    </section>
  )
}
