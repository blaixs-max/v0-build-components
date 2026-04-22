"use client"

import { useRouter } from "next/navigation"
import { useUser, type Offer } from "@/contexts/user-context"
import { useEffect } from "react"
import { ArrowLeft, Clock, CreditCard, Truck, CheckCircle2, X, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BottomNavigation } from "@/components/bottom-navigation"
import { SiteHeader } from "@/components/site-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

export default function TekliflerimPage() {
  const router = useRouter()
  const { user, isLoggedIn, getMyOffers, getReceivedOffers } = useUser()

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/giris")
    }
  }, [isLoggedIn, router])

  if (!isLoggedIn || !user) {
    return null
  }

  const myOffers = getMyOffers()
  const receivedOffers = getReceivedOffers()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("tr-TR").format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "short",
      year: "numeric",
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
            <Package className="h-3 w-3 mr-1" />
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

  const OfferCard = ({ offer, type }: { offer: Offer; type: "sent" | "received" }) => (
    <Card
      className={cn(
        "cursor-pointer hover:shadow-md transition-shadow",
        offer.status === "completed" && "border-green-200",
        offer.status === "rejected" && "border-red-200",
      )}
      onClick={() => router.push(`/ilan/${offer.listingId}`)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <p className="font-medium text-foreground line-clamp-1">{offer.listingTitle}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {type === "sent" ? "Teklif tarihi" : `Teklif veren: ${offer.offererName}`}: {formatDate(offer.createdAt)}
            </p>
          </div>
          {getStatusBadge(offer.status)}
        </div>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-lg font-bold text-meradan-green">₺ {formatPrice(offer.offerAmount)}</p>
          <Button variant="outline" size="sm" className="text-xs bg-transparent">
            Detay
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-background pb-24">
      <SiteHeader />

      {/* Sayfa Alt Başlığı */}
      <div className="border-b border-border/60 bg-card">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-4 md:px-6 lg:px-10">
          <Button variant="ghost" size="icon" className="shrink-0" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">Tekliflerim</h1>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-4 md:px-6 lg:px-10">
        <Tabs defaultValue="sent" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sent">Gönderdiğim ({myOffers.length})</TabsTrigger>
            <TabsTrigger value="received">Gelen ({receivedOffers.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="sent" className="mt-4">
            {myOffers.length === 0 ? (
              <div className="text-center py-12">
                <CreditCard className="h-12 w-12 mx-auto text-muted-foreground/50" />
                <p className="text-muted-foreground mt-4">Henüz teklif göndermediniz</p>
                <Button variant="outline" className="mt-4 bg-transparent" onClick={() => router.push("/")}>
                  İlanlara Göz At
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {myOffers.map((offer) => (
                  <OfferCard key={offer.id} offer={offer} type="sent" />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="received" className="mt-4">
            {receivedOffers.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-12 w-12 mx-auto text-muted-foreground/50" />
                <p className="text-muted-foreground mt-4">Henüz teklif almadınız</p>
                <Button variant="outline" className="mt-4 bg-transparent" onClick={() => router.push("/")}>
                  İlan Ver
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {receivedOffers.map((offer) => (
                  <OfferCard key={offer.id} offer={offer} type="received" />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <BottomNavigation activeTab="offers" />
    </div>
  )
}
