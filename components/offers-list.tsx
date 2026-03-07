"use client"

import { Check, X, Clock, User, CreditCard, Truck, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useUser, type Offer } from "@/contexts/user-context"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

interface OffersListProps {
  listingId: string
}

export function OffersList({ listingId }: OffersListProps) {
  const { getOffersForListing, updateOfferStatus, isMyListing, user } = useUser()
  const { toast } = useToast()
  const [processingId, setProcessingId] = useState<string | null>(null)

  const offers = getOffersForListing(listingId)
  const isOwner = isMyListing(listingId)

  // Kullanicinin kendi teklifi var mi kontrol et
  const myOffer = offers.find((o) => o.offererId === user?.phone)

  if (offers.length === 0 && !myOffer) {
    return null
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("tr-TR").format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusBadge = (status: Offer["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
            <Clock className="h-3 w-3 mr-1" />
            Beklemede
          </Badge>
        )
      case "accepted":
      case "payment_pending":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            <CreditCard className="h-3 w-3 mr-1" />
            Odeme Bekleniyor
          </Badge>
        )
      case "paid":
        return (
          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
            <Truck className="h-3 w-3 mr-1" />
            Teslimat Bekleniyor
          </Badge>
        )
      case "delivered":
        return (
          <Badge variant="secondary" className="bg-orange-100 text-orange-700">
            <AlertCircle className="h-3 w-3 mr-1" />
            Onay Bekleniyor
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Tamamlandi
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-700">
            <X className="h-3 w-3 mr-1" />
            Reddedildi
          </Badge>
        )
    }
  }

  const handlePayment = async (offerId: string) => {
    setProcessingId(offerId)
    // Simule edilmis odeme islemi
    await new Promise((resolve) => setTimeout(resolve, 1500))
    updateOfferStatus(offerId, "paid")
    toast({
      title: "Odeme Basarili",
      description: "Odemeniz emanet hesabina alindi. Teslimat bekleniyor.",
    })
    setProcessingId(null)
  }

  const handleDeliveryConfirm = (offerId: string) => {
    updateOfferStatus(offerId, "delivered")
    toast({
      title: "Teslimat Bildirildi",
      description: "Alicinin teslimat onayini bekliyorsunuz.",
    })
  }

  const handleReceiveConfirm = (offerId: string) => {
    updateOfferStatus(offerId, "completed")
    toast({
      title: "Islem Tamamlandi",
      description: "Odeme saticiya aktarildi. Alisveris tamamlandi!",
    })
  }

  const calculateCommission = (amount: number) => {
    return Math.round(amount * 0.03)
  }

  // Alici gorunumu - kendi teklifini goster
  if (myOffer && !isOwner) {
    return (
      <div className="space-y-3">
        <h3 className="font-semibold text-foreground">Teklifiniz</h3>
        <div
          className={cn(
            "bg-muted/30 rounded-xl p-4 border",
            myOffer.status === "completed" && "border-green-300 bg-green-50/50",
            myOffer.status === "rejected" && "border-red-200 bg-red-50/30",
            myOffer.status === "pending" && "border-yellow-200",
            (myOffer.status === "payment_pending" || myOffer.status === "accepted") && "border-blue-200 bg-blue-50/30",
            myOffer.status === "paid" && "border-purple-200 bg-purple-50/30",
            myOffer.status === "delivered" && "border-orange-200 bg-orange-50/30",
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-lg font-bold text-meradan-green">₺ {formatPrice(myOffer.offerAmount)}</p>
              <p className="text-xs text-muted-foreground mt-1">{formatDate(myOffer.createdAt)}</p>
            </div>
            {getStatusBadge(myOffer.status)}
          </div>

          {myOffer.message && (
            <p className="text-sm text-muted-foreground mt-3 bg-background rounded-lg p-2">"{myOffer.message}"</p>
          )}

          {/* Odeme Bekleniyor - Alici odeme yapar */}
          {(myOffer.status === "payment_pending" || myOffer.status === "accepted") && (
            <div className="mt-4 pt-3 border-t">
              <div className="bg-blue-50 rounded-lg p-3 mb-3">
                <p className="text-sm text-blue-800 font-medium">Teklifiniz kabul edildi!</p>
                <p className="text-xs text-blue-600 mt-1">
                  Odeme yaptiginizda tutar emanet hesabina alinacak ve teslimat sonrasi saticiya aktarilacaktir.
                </p>
              </div>
              <div className="text-sm text-muted-foreground mb-3">
                <div className="flex justify-between">
                  <span>Teklif Tutari:</span>
                  <span>₺ {formatPrice(myOffer.offerAmount)}</span>
                </div>
                <div className="flex justify-between text-meradan-orange">
                  <span>Platform Komisyonu (%3):</span>
                  <span>₺ {formatPrice(calculateCommission(myOffer.offerAmount))}</span>
                </div>
                <div className="flex justify-between font-bold text-foreground mt-2 pt-2 border-t">
                  <span>Toplam:</span>
                  <span>₺ {formatPrice(myOffer.offerAmount + calculateCommission(myOffer.offerAmount))}</span>
                </div>
              </div>
              <Button
                className="w-full bg-meradan-green hover:bg-meradan-green/90"
                onClick={() => handlePayment(myOffer.id)}
                disabled={processingId === myOffer.id}
              >
                {processingId === myOffer.id ? (
                  "Odeme Isleniyor..."
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Guvenli Odeme Yap
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Teslimat Bekleniyor */}
          {myOffer.status === "paid" && (
            <div className="mt-4 pt-3 border-t">
              <div className="bg-purple-50 rounded-lg p-3">
                <p className="text-sm text-purple-800 font-medium">Odeme emanet hesabinda</p>
                <p className="text-xs text-purple-600 mt-1">
                  Saticinin teslimati gerceklestirmesini bekliyorsunuz. Teslimat sonrasi onay vermeniz gerekecek.
                </p>
              </div>
            </div>
          )}

          {/* Teslimat Onay Bekleniyor - Alici onaylar */}
          {myOffer.status === "delivered" && (
            <div className="mt-4 pt-3 border-t">
              <div className="bg-orange-50 rounded-lg p-3 mb-3">
                <p className="text-sm text-orange-800 font-medium">Satici teslimati bildirdi</p>
                <p className="text-xs text-orange-600 mt-1">
                  Hayvani teslim aldiysaniz lutfen onaylayin. Onayladiginizda odeme saticiya aktarilacak.
                </p>
              </div>
              <Button
                className="w-full bg-meradan-green hover:bg-meradan-green/90"
                onClick={() => handleReceiveConfirm(myOffer.id)}
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Teslim Aldim, Onayla
              </Button>
            </div>
          )}

          {/* Tamamlandi */}
          {myOffer.status === "completed" && (
            <div className="mt-4 pt-3 border-t">
              <div className="bg-green-50 rounded-lg p-3">
                <p className="text-sm text-green-800 font-medium">Islem basariyla tamamlandi!</p>
                <p className="text-xs text-green-600 mt-1">Meradan'i tercih ettiginiz icin tesekkurler.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Satici gorunumu - gelen teklifleri goster
  if (!isOwner) {
    return null
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-foreground flex items-center gap-2">
        Gelen Teklifler
        <Badge variant="outline" className="text-meradan-green border-meradan-green">
          {offers.length}
        </Badge>
      </h3>

      <div className="space-y-3">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className={cn(
              "bg-muted/30 rounded-xl p-4 border",
              offer.status === "completed" && "border-green-300 bg-green-50/50",
              offer.status === "rejected" && "border-red-200 bg-red-50/30",
              offer.status === "pending" && "border-yellow-200",
              (offer.status === "payment_pending" || offer.status === "accepted") && "border-blue-200 bg-blue-50/30",
              offer.status === "paid" && "border-purple-200 bg-purple-50/30",
              offer.status === "delivered" && "border-orange-200 bg-orange-50/30",
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-meradan-green/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-meradan-green" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{offer.offererName}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(offer.createdAt)}</p>
                </div>
              </div>
              {getStatusBadge(offer.status)}
            </div>

            <div className="mt-3 pl-13">
              <p className="text-lg font-bold text-meradan-green">₺ {formatPrice(offer.offerAmount)}</p>
              {offer.message && (
                <p className="text-sm text-muted-foreground mt-2 bg-background rounded-lg p-2">"{offer.message}"</p>
              )}
            </div>

            {/* Satici icin onay/red butonlari */}
            {offer.status === "pending" && (
              <div className="flex gap-2 mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 border-red-300 text-red-600 hover:bg-red-50 bg-transparent"
                  onClick={() => updateOfferStatus(offer.id, "rejected")}
                >
                  <X className="h-4 w-4 mr-1" />
                  Reddet
                </Button>
                <Button
                  size="sm"
                  className="flex-1 bg-meradan-green hover:bg-meradan-green/90"
                  onClick={() => updateOfferStatus(offer.id, "payment_pending")}
                >
                  <Check className="h-4 w-4 mr-1" />
                  Kabul Et
                </Button>
              </div>
            )}

            {/* Odeme Bekleniyor - Satici bekler */}
            {(offer.status === "payment_pending" || offer.status === "accepted") && (
              <div className="mt-4 pt-3 border-t">
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-sm text-blue-800 font-medium">Alicinin odeme yapmasini bekliyorsunuz</p>
                  <p className="text-xs text-blue-600 mt-1">
                    Odeme yapildiktan sonra teslimati gerceklestirebilirsiniz.
                  </p>
                </div>
              </div>
            )}

            {/* Teslimat Bekleniyor - Satici teslimat yapar */}
            {offer.status === "paid" && (
              <div className="mt-4 pt-3 border-t">
                <div className="bg-purple-50 rounded-lg p-3 mb-3">
                  <p className="text-sm text-purple-800 font-medium">Odeme emanet hesabina alindi</p>
                  <p className="text-xs text-purple-600 mt-1">
                    Teslimati gerceklestirdikten sonra bildirin. Alici onayladiktan sonra odeme size aktarilacak.
                  </p>
                </div>
                <Button
                  className="w-full bg-meradan-orange hover:bg-meradan-orange/90"
                  onClick={() => handleDeliveryConfirm(offer.id)}
                >
                  <Truck className="h-4 w-4 mr-2" />
                  Teslimati Gerceklestirdim
                </Button>
              </div>
            )}

            {/* Teslimat Onay Bekleniyor - Satici bekler */}
            {offer.status === "delivered" && (
              <div className="mt-4 pt-3 border-t">
                <div className="bg-orange-50 rounded-lg p-3">
                  <p className="text-sm text-orange-800 font-medium">Alicinin teslimat onayini bekliyorsunuz</p>
                  <p className="text-xs text-orange-600 mt-1">
                    Alici teslimati onayladiginda odeme hesabiniza aktarilacak.
                  </p>
                </div>
              </div>
            )}

            {/* Tamamlandi */}
            {offer.status === "completed" && (
              <div className="mt-4 pt-3 border-t">
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-sm text-green-800 font-medium">Satis tamamlandi!</p>
                  <p className="text-xs text-green-600 mt-1">
                    Odeme hesabiniza aktarildi. Meradan'i tercih ettiginiz icin tesekkurler.
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
