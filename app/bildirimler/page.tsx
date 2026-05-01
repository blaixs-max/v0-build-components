"use client"

import { useRouter } from "next/navigation"
import { useUser } from "@/contexts/user-context"
import { useEffect } from "react"
import { ArrowLeft, Bell, Heart, CreditCard, CheckCircle2, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SiteHeader } from "@/components/site-header"
import { BottomNavigation } from "@/components/bottom-navigation"
import { cn } from "@/lib/utils"

const demoNotifications = [
  {
    id: "1",
    type: "offer" as const,
    title: "Yeni Teklif",
    message: "Simental Boga ilaniniza 30.000 TL teklif geldi.",
    time: "2 saat once",
    read: false,
  },
  {
    id: "2",
    type: "favorite" as const,
    title: "Favorilere Eklendi",
    message: "Holstein Inek ilaniniz 5 kisi tarafindan favorilere eklendi.",
    time: "5 saat once",
    read: false,
  },
  {
    id: "3",
    type: "system" as const,
    title: "Hosgeldiniz!",
    message: "Meradan uygulamasina hosgeldiniz. Profilinizi tamamlayin.",
    time: "1 gun once",
    read: true,
  },
  {
    id: "4",
    type: "success" as const,
    title: "Ilan Yayinda",
    message: "Merinos Koc ilaniniz basariyla yayinlandi.",
    time: "2 gun once",
    read: true,
  },
]

const iconMap = {
  offer: CreditCard,
  favorite: Heart,
  system: Info,
  success: CheckCircle2,
}

const colorMap = {
  offer: "bg-meradan-orange/10 text-meradan-orange",
  favorite: "bg-red-100 text-red-500",
  system: "bg-blue-100 text-blue-500",
  success: "bg-meradan-green/10 text-meradan-green",
}

export default function BildirimlerPage() {
  const router = useRouter()
  const { isLoggedIn } = useUser()

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/giris")
    }
  }, [isLoggedIn, router])

  if (!isLoggedIn) return null

  return (
    <div className="min-h-screen bg-background pb-24">
      <SiteHeader />

      <div className="border-b border-border/60 bg-card">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-4 md:px-6 lg:px-10">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-10 w-10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">Bildirimler</h1>
          <span className="ml-auto text-sm text-muted-foreground">
            {demoNotifications.filter((n) => !n.read).length} yeni
          </span>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-4 md:px-6 lg:px-10">
        {demoNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
              <Bell className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Bildirim yok</h3>
            <p className="text-sm text-muted-foreground">Yeni bildirimleriniz burada gorunecek.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {demoNotifications.map((notif) => {
              const Icon = iconMap[notif.type]
              const colorClass = colorMap[notif.type]
              return (
                <Card key={notif.id} className={cn(!notif.read && "border-meradan-green/30 bg-meradan-green/5")}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={cn("h-10 w-10 rounded-full flex items-center justify-center shrink-0", colorClass)}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-foreground text-sm">{notif.title}</p>
                          {!notif.read && (
                            <span className="h-2 w-2 rounded-full bg-meradan-green shrink-0" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">{notif.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{notif.time}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </main>

      <BottomNavigation activeTab="home" />
    </div>
  )
}
