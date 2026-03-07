"use client"
import Image from "next/image"
import Link from "next/link"
import { Heart, Play } from "lucide-react"
import { cn } from "@/lib/utils"

interface ListingCardCompactProps {
  id: string
  title: string
  location: string
  price: number
  imageUrl: string
  videoUrl?: string | null
  isFavorite?: boolean
  onFavoriteClick?: (id: string) => void
}

export function ListingCardCompact({
  id,
  title,
  location,
  price,
  imageUrl,
  videoUrl,
  isFavorite = false,
  onFavoriteClick,
}: ListingCardCompactProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("tr-TR").format(price)
  }

  return (
    <article className="bg-card rounded-lg overflow-hidden shadow-sm">
      <Link href={`/ilan/${id}`} className="flex items-center gap-3 p-2">
        <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
          <Image src={imageUrl || "/placeholder.svg"} alt={title} fill className="object-cover" sizes="64px" />
          {videoUrl && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <Play className="h-4 w-4 text-white fill-white" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm text-foreground truncate">{title}</h3>
          <p className="text-xs text-muted-foreground truncate">{location}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-meradan-orange font-bold text-sm">₺{formatPrice(price)}</span>
          <button
            onClick={(e) => {
              e.preventDefault()
              onFavoriteClick?.(id)
            }}
            className="p-1"
            aria-label={isFavorite ? "Favorilerden kaldır" : "Favorilere ekle"}
          >
            <Heart
              className={cn(
                "h-4 w-4 transition-colors",
                isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground",
              )}
            />
          </button>
        </div>
      </Link>
    </article>
  )
}
