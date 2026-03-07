"use client"

import { useRouter } from "next/navigation"
import { useUser } from "@/contexts/user-context"
import { useEffect } from "react"
import { ArrowLeft, Bell, CreditCard, CheckCircle2, X, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BottomNavigation } from "@/components/bottom-navigation"

export default function BildirimlerPage() {
  const router = useRouter()
  const { isLoggedIn, getMyOffers, getReceivedOffers } = useUser()

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/giris")
    }
  }, [isLoggedIn, router])

  if (!isLoggedIn) {
    return null
  }

  const myOffers = getMyOffers()
  const receivedOffers = getReceivedOffers()

  // Generate notifications from offers
  const notifications = [
    ...receivedOffers.map((offer) => ({
      id: `notif_recv_${offer.id}`,
      type: "offer_received" as const,
      title: "Yeni Teklif Alındı",
      message: `${offer.offererName} "${offer.listingTitle}" ilanınıza ₺${new Intl.NumberFormat("tr-TR").format(offer.offerAmount)} teklif verdi.`,
      date: offer.createdAt,
      icon: CreditCard,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      listingId: offer.listingId,
    })),
    ...myOffers
      .filter((o) => o.status === "accepted")
      .map((offer) => ({
        id: `notif_acc_${offer.id}`,
        type: "offer_accepted" as const,
        title: "Teklif Kabul Edildi",
        message: `"${offer.listingTitle}" ilanına verdiğiniz teklif kabul edildi.`,
        date: offer.createdAt,
        icon: CheckCircle2,
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
        listingId: offer.listingId,
      })),
    ...myOffers
      .filter((o) => o.status === "rejected")
      .map((offer) => ({
        id: `notif_rej_${offer.id}`,
        type: "offer_rejected" as const,
        title: "Teklif Reddedildi",
        message: `"${offer.listingTitle}" ilanına verdiğiniz teklif reddedildi.`,
        date: offer.createdAt,
        icon: X,
        iconBg: "bg-red-100",
        iconColor: "text-red-600",
        listingId: offer.listingId,
      })),
    ...myOffers
      .filter((o) => o.status === "completed")
      .map((offer) => ({
        id: `notif_comp_${offer.id}`,
        type: "offer_completed" as const,
        title: "İşlem Tamamlandı",
        message: `"${offer.listingTitle}" ilanındaki işlem başarıyla tamamlandı.`,
        date: offer.completedDate || offer.createdAt,
        icon: Package,
        iconBg: "bg-purple-100",
        iconColor: "text-purple-600",
        listingId: offer.listingId,
      })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="flex items-center gap-3 px-4 py-4">
          <Button variant="ghost" size="icon" className="shrink-0" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">Bildirimler</h1>
        </div>
      </div>

      <div className="px-4 py-4">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="h-12 w-12 mx-auto text-muted-foreground/50" />
            <p className="text-muted-foreground mt-4">Henüz bildiriminiz yok</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notif) => {
              const Icon = notif.icon
              return (
                <Card
                  key={notif.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => router.push(`/ilan/${notif.listingId}`)}
                >
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <div className={`w-10 h-10 rounded-full ${notif.iconBg} flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`h-5 w-5 ${notif.iconColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-foreground">{notif.title}</p>
                        <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">{notif.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{formatDate(notif.date)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      <BottomNavigation activeTab="profile" />
    </div>
  )
}
