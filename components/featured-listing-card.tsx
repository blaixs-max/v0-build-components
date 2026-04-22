"use client"

import Image from "next/image"
import Link from "next/link"
import { MapPin, PlayCircle } from "lucide-react"

interface FeaturedListingCardProps {
  id: string
  title: string
  city: string
  price: number
  imageUrl: string
  videoUrl?: string | null
}

export function FeaturedListingCard({ id, title, city, price, imageUrl, videoUrl }: FeaturedListingCardProps) {
  const formatPrice = (value: number) => new Intl.NumberFormat("tr-TR").format(value)
  const hasVideo = Boolean(videoUrl)

  return (
    <Link
      href={`/ilan/${id}`}
      className="group flex flex-col overflow-hidden rounded-xl bg-card shadow-sm ring-1 ring-border/60 transition-all hover:shadow-md"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        {hasVideo && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-meradan-green px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm">
            <PlayCircle className="h-3.5 w-3.5" strokeWidth={2.4} />
            Videolu İlan
          </span>
        )}
      </div>
      <div className="flex flex-col gap-1 p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-base font-bold text-foreground">{formatPrice(price)} TL</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-meradan-green/10 px-2.5 py-1 text-xs font-medium text-meradan-green">
            <MapPin className="h-3 w-3" strokeWidth={2.4} />
            {city}
          </span>
        </div>
        <p className="truncate text-sm text-muted-foreground">{title}</p>
      </div>
    </Link>
  )
}
