"use client"

import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { useState, useEffect } from "react"
import {
  ArrowLeft,
  Heart,
  MapPin,
  Calendar,
  Tag,
  Scale,
  Clock,
  Play,
  User,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Video,
  HandCoins,
  Building2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { useUser } from "@/contexts/user-context"
import { OfferModal } from "@/components/offer-modal"
import { OffersList } from "@/components/offers-list"
import { SiteHeader } from "@/components/site-header"
import { formatEnterpriseDisplay } from "@/lib/enterprise-validation"

interface ListingDetail {
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
  views: number
  createdAt: string
  userId: string
  sellerName: string
  sellerPhone: string
  sellerVerified: boolean
  isFavorite: boolean
  videoUrl?: string | null
}

export default function ListingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toggleFavorite, isFavorite, isMyListing, user } = useUser()
  const [showVideo, setShowVideo] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showOfferModal, setShowOfferModal] = useState(false)
  const [listing, setListing] = useState<ListingDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(`/api/listings/${params.id}`)
        const data = await res.json()
        if (data.listing) {
          setListing(data.listing)
        }
      } catch {
        // silently fail
      }
      setIsLoading(false)
    }
    fetchListing()
  }, [params.id])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Yükleniyor...</div>
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium text-foreground mb-2">İlan bulunamadı</p>
          <Button onClick={() => router.push("/")} variant="outline">
            Ana Sayfaya Dön
          </Button>
        </div>
      </div>
    )
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("tr-TR").format(price)
  }

  const isListingFavorite = isFavorite(listing.id)
  const isOwner = user?.id === listing.userId || isMyListing(listing.id)

  const images = listing.images && listing.images.length > 0 ? listing.images : [listing.imageUrl]

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/ilan/${listing.id}`
    const shareText = `${listing.title} - ₺${formatPrice(listing.price)}\n📍 ${listing.location}\n\nMera'dan uygulamasında bu ilana göz atın:`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + "\n" + shareUrl)}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <SiteHeader />

      {/* Sayfa Alt Başlığı */}
      <header className="border-b border-border/60 bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between p-4 md:px-6 lg:px-10">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleShare}
              className="text-[#25D366] hover:text-[#25D366]/80"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => toggleFavorite(listing.id)}>
              <Heart className={cn("h-5 w-5", isListingFavorite ? "fill-red-500 text-red-500" : "")} />
            </Button>
          </div>
        </div>
      </header>

      {/* Görsel / Video Bölümü */}
      <div className="relative aspect-[4/3] bg-muted">
        {showVideo && listing.videoUrl ? (
          <div className="relative w-full h-full">
            <video src={listing.videoUrl} className="w-full h-full object-cover" controls autoPlay />
            <Button
              variant="secondary"
              size="sm"
              className="absolute top-4 right-4"
              onClick={() => setShowVideo(false)}
            >
              Fotoğraflara Dön
            </Button>
          </div>
        ) : (
          <>
            <Image
              src={images[currentImageIndex] || "/placeholder.svg"}
              alt={`${listing.title} - Fotoğraf ${currentImageIndex + 1}`}
              fill
              className="object-cover"
              priority
            />

            {/* Resim gezinme oklari */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            {/* Resim sayaci */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {images.length}
            </div>

            {/* Kucuk resim noktalari */}
            {images.length > 1 && (
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={cn(
                      "w-2 h-2 rounded-full transition-colors",
                      index === currentImageIndex ? "bg-white" : "bg-white/50",
                    )}
                  />
                ))}
              </div>
            )}

            {/* Video izle butonu */}
            {listing.videoUrl && (
              <button
                onClick={() => setShowVideo(true)}
                className="absolute top-4 left-4 bg-meradan-green text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-lg hover:bg-meradan-green/90 transition-colors"
              >
                <Video className="h-4 w-4" />
                Video İzle
              </button>
            )}
          </>
        )}
      </div>

      {/* Kucuk resim onizleme - galeri */}
      {!showVideo && images.length > 1 && (
        <div className="flex gap-2 p-4 overflow-x-auto">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={cn(
                "relative w-16 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-colors",
                index === currentImageIndex ? "border-meradan-green" : "border-transparent",
              )}
            >
              <Image src={img || "/placeholder.svg"} alt={`Fotoğraf ${index + 1}`} fill className="object-cover" />
            </button>
          ))}
          {/* Video onizleme */}
          {listing.videoUrl && (
            <button
              onClick={() => setShowVideo(true)}
              className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 border-2 border-transparent bg-black/80 flex items-center justify-center"
            >
              <Play className="h-6 w-6 text-white fill-white" />
            </button>
          )}
        </div>
      )}

      {/* İçerik */}
      <div className="p-4 space-y-4">
        {/* Başlık ve Fiyat */}
        <div>
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-xl font-bold text-foreground">{listing.title}</h1>
            <Badge variant="secondary" className="bg-meradan-orange/10 text-meradan-orange shrink-0">
              {listing.priceType === "sabit" ? "Sabit Fiyat" : "Pazarlık"}
            </Badge>
          </div>
          <p className="text-2xl font-bold text-meradan-green mt-1">₺ {formatPrice(listing.price)}</p>
        </div>

        {/* Konum */}
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span className="text-sm">{listing.location}</span>
        </div>

        <Separator />

        {/* Detaylar Grid */}
        <div className="grid grid-cols-2 gap-3">
          {listing.age && (
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Calendar className="h-4 w-4" />
                <span className="text-xs">Yaş</span>
              </div>
              <p className="font-medium text-sm">{listing.age}</p>
            </div>
          )}
          {listing.weight && (
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Scale className="h-4 w-4" />
                <span className="text-xs">Ağırlık</span>
              </div>
              <p className="font-medium text-sm">{listing.weight}</p>
            </div>
          )}
          {listing.earTag && (
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Tag className="h-4 w-4" />
                <span className="text-xs">Kulak Küpesi</span>
              </div>
              <p className="font-medium text-sm">{listing.earTag}</p>
            </div>
          )}
          {listing.enterpriseNo && (
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Building2 className="h-4 w-4" />
                <span className="text-xs">İşletme No</span>
              </div>
              <p className="font-mono font-medium text-sm">
                {formatEnterpriseDisplay(listing.enterpriseNo, listing.enterpriseLabel)}
              </p>
            </div>
          )}
          {listing.breed && (
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Clock className="h-4 w-4" />
                <span className="text-xs">Irk</span>
              </div>
              <p className="font-medium text-sm capitalize">{listing.breed}</p>
            </div>
          )}
        </div>

        <Separator />

        {/* Açıklama */}
        {listing.description && (
          <div>
            <h2 className="font-semibold text-foreground mb-2">Açıklama</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{listing.description}</p>
          </div>
        )}

        <Separator />

        {/* Satıcı Bilgileri */}
        <div className="bg-muted/30 rounded-xl p-4">
          <h2 className="font-semibold text-foreground mb-3">Satıcı Bilgileri</h2>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-meradan-green/10 flex items-center justify-center">
              <User className="h-6 w-6 text-meradan-green" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium text-foreground">{listing.sellerName}</p>
                <ShieldCheck className="h-4 w-4 text-meradan-green" />
              </div>
              <p className="text-xs text-muted-foreground">Doğrulanmış Satıcı</p>
            </div>
          </div>
        </div>

        {isOwner && (
          <>
            <Separator />
            <OffersList listingId={listing.id} />
          </>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4">
        <div className="flex gap-3">
          <Button
            variant="outline"
            className={cn(
              "flex-1 h-12 border-2 transition-colors",
              isListingFavorite
                ? "border-red-500 text-red-500 hover:bg-red-50"
                : "border-meradan-green text-meradan-green hover:bg-meradan-green/10",
            )}
            onClick={() => toggleFavorite(listing.id)}
          >
            <Heart className={cn("h-5 w-5 mr-2", isListingFavorite && "fill-red-500")} />
            {isListingFavorite ? "Favorilerde" : "Favorilere Ekle"}
          </Button>
          {!isOwner && (
            <Button
              className="flex-1 h-12 bg-meradan-orange hover:bg-meradan-orange/90"
              onClick={() => setShowOfferModal(true)}
            >
              <HandCoins className="h-5 w-5 mr-2" />
              Teklif Ver
            </Button>
          )}
        </div>
      </div>

      {/* Teklif Modal */}
      <OfferModal
        isOpen={showOfferModal}
        onClose={() => setShowOfferModal(false)}
        listingId={listing.id}
        listingTitle={listing.title}
        currentPrice={listing.price}
      />
    </div>
  )
}
