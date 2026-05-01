"use client"

import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, Play, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import { buildWhatsAppShareText } from "@/lib/share-utils"

interface ListingCardListProps {
  id: string
  title: string
  location: string
  price: number
  imageUrl: string
  videoUrl?: string | null
  isFavorite?: boolean
  onFavoriteClick?: (id: string) => void
  breed?: string
  age?: string
  weight?: string
}

export function ListingCardList({
  id,
  title,
  location,
  price,
  imageUrl,
  videoUrl,
  isFavorite = false,
  onFavoriteClick,
  breed,
  age,
  weight,
}: ListingCardListProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("tr-TR").format(price)
  }

  const handleWhatsAppShare = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const shareText = buildWhatsAppShareText({ title, price: formatPrice(price), location, listingId: id })
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <article className="bg-card rounded-xl overflow-hidden shadow-sm">
      <Link href={`/ilan/${id}`} className="flex">
        <div className="relative w-36 h-36 flex-shrink-0">
          <Image src={imageUrl || "/placeholder.svg"} alt={title} fill className="object-cover" sizes="144px" />
          {videoUrl && (
            <div className="absolute top-2 left-2 bg-meradan-green text-white p-1.5 rounded-full shadow-md">
              <Play className="h-3 w-3 fill-white" />
            </div>
          )}
        </div>
        <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
          <div>
            <h3 className="font-semibold text-base text-foreground truncate">{title}</h3>
            <div className="flex items-center gap-1 text-muted-foreground mt-1">
              <MapPin className="h-3 w-3" />
              <span className="text-xs truncate">{location}</span>
            </div>
            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
              {age && <span>{age}</span>}
              {weight && <span>{weight}</span>}
              {breed && <span className="capitalize">{breed}</span>}
            </div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-meradan-orange font-bold text-lg">₺ {formatPrice(price)}</span>
            <div className="flex items-center gap-2">
              <button onClick={handleWhatsAppShare} className="p-1.5" aria-label="WhatsApp'ta paylaş">
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5 text-[#25D366] hover:text-[#128C7E] transition-colors"
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  onFavoriteClick?.(id)
                }}
                className="p-1.5"
                aria-label={isFavorite ? "Favorilerden kaldır" : "Favorilere ekle"}
              >
                <Heart
                  className={cn(
                    "h-5 w-5 transition-colors",
                    isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground",
                  )}
                />
              </button>
            </div>
          </div>
        </div>
      </Link>
    </article>
  )
}
