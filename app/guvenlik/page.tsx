"use client"

import { useRouter } from "next/navigation"
import { useUser } from "@/contexts/user-context"
import { useEffect } from "react"
import { ArrowLeft, Shield, Lock, Eye, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { SiteHeader } from "@/components/site-header"
import { BottomNavigation } from "@/components/bottom-navigation"
import { Separator } from "@/components/ui/separator"

export default function GuvenlikPage() {
  const router = useRouter()
  const { isLoggedIn } = useUser()

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/giris")
    }
  }, [isLoggedIn, router])

  if (!isLoggedIn) return null

  const securityItems = [
    {
      icon: Lock,
      title: "Sifre Degistir",
      description: "Hesap sifrenizi guncelleyin",
      action: "button",
    },
    {
      icon: Smartphone,
      title: "Iki Faktorlu Dogrulama",
      description: "SMS ile ek guvenlik",
      action: "switch",
      enabled: false,
    },
    {
      icon: Eye,
      title: "Profil Gorunurlugu",
      description: "Profilinizi herkes gorebilir",
      action: "switch",
      enabled: true,
    },
  ]

  return (
    <div className="min-h-screen bg-background pb-24">
      <SiteHeader />

      <div className="border-b border-border/60 bg-card">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-4 md:px-6 lg:px-10">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-10 w-10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">Gizlilik ve Guvenlik</h1>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-10">
        <Card>
          <CardContent className="p-0">
            {securityItems.map((item, index) => (
              <div key={item.title}>
                <div className="flex items-center justify-between px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-meradan-green/10 flex items-center justify-center">
                      <item.icon className="h-5 w-5 text-meradan-green" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                  {item.action === "switch" ? (
                    <Switch defaultChecked={item.enabled} />
                  ) : (
                    <Button variant="outline" size="sm" className="bg-transparent">
                      Degistir
                    </Button>
                  )}
                </div>
                {index < securityItems.length - 1 && <Separator />}
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="mt-6">
          <Card className="border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-red-500" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-red-600">Hesabi Sil</p>
                  <p className="text-sm text-muted-foreground">Hesabiniz ve tum verileriniz kalici olarak silinir.</p>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4 border-red-200 text-red-600 hover:bg-red-50 bg-transparent">
                Hesabimi Sil
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <BottomNavigation activeTab="profile" />
    </div>
  )
}
