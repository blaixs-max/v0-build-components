"use client"

import { useRouter } from "next/navigation"
import { useUser } from "@/contexts/user-context"
import { useEffect, useState } from "react"
import { ArrowLeft, User, Phone, MapPin, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SiteHeader } from "@/components/site-header"
import { BottomNavigation } from "@/components/bottom-navigation"
import { useToast } from "@/hooks/use-toast"

export default function AyarlarPage() {
  const router = useRouter()
  const { user, isLoggedIn, updateUser } = useUser()
  const { toast } = useToast()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [location, setLocation] = useState("")

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/giris")
      return
    }
    if (user) {
      setFirstName(user.firstName)
      setLastName(user.lastName)
      setLocation(user.location || "")
    }
  }, [isLoggedIn, router, user])

  if (!isLoggedIn || !user) return null

  const handleSave = () => {
    updateUser({ firstName, lastName, location })
    toast({
      title: "Kaydedildi",
      description: "Hesap bilgileriniz guncellendi.",
    })
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <SiteHeader />

      <div className="border-b border-border/60 bg-card">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-4 md:px-6 lg:px-10">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-10 w-10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">Hesap Ayarlari</h1>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-10 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="h-5 w-5 text-meradan-green" />
              Kisisel Bilgiler
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Ad</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Adiniz"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Soyad</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Soyadiniz"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-1">
                <Phone className="h-3.5 w-3.5" />
                Telefon
              </Label>
              <Input id="phone" value={user.phone} disabled className="bg-muted" />
              <p className="text-xs text-muted-foreground">Telefon numarasi degistirilemez.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                Konum
              </Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Sehir, Ilce"
              />
            </div>
          </CardContent>
        </Card>

        <Button onClick={handleSave} className="w-full bg-meradan-green hover:bg-meradan-green/90">
          <Save className="h-4 w-4 mr-2" />
          Degisiklikleri Kaydet
        </Button>
      </main>

      <BottomNavigation activeTab="profile" />
    </div>
  )
}
