"use client"

import { useRouter } from "next/navigation"
import { useUser } from "@/contexts/user-context"
import { useEffect, useState } from "react"
import { ArrowLeft, User, Bell, Shield, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { BottomNavigation } from "@/components/bottom-navigation"
import { toast } from "sonner"

export default function AyarlarPage() {
  const router = useRouter()
  const { user, isLoggedIn, updateUser, logout } = useUser()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [location, setLocation] = useState("")

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/giris")
    }
  }, [isLoggedIn, router])

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName)
      setLastName(user.lastName)
      setLocation(user.location || "")
    }
  }, [user])

  if (!isLoggedIn || !user) {
    return null
  }

  const handleSaveProfile = () => {
    updateUser({ firstName, lastName, location })
    toast.success("Profil bilgileri güncellendi")
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="flex items-center gap-3 px-4 py-4">
          <Button variant="ghost" size="icon" className="shrink-0" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">Ayarlar</h1>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Profil Bilgileri */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-4 w-4" />
              Profil Bilgileri
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Ad</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Soyad</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefon</Label>
              <Input id="phone" value={user.phone} disabled className="bg-muted" />
              <p className="text-xs text-muted-foreground">Telefon numarası değiştirilemez</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Konum</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Şehir, İlçe"
              />
            </div>
            <Button
              onClick={handleSaveProfile}
              className="w-full bg-meradan-green hover:bg-meradan-green/90"
            >
              Kaydet
            </Button>
          </CardContent>
        </Card>

        {/* Bildirim Tercihleri */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Bildirim Tercihleri
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Yeni Teklif</p>
                <p className="text-xs text-muted-foreground">İlanlarınıza gelen teklifler</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Teklif Güncellemesi</p>
                <p className="text-xs text-muted-foreground">Teklif kabul/red bildirimleri</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Mesajlar</p>
                <p className="text-xs text-muted-foreground">Yeni mesaj bildirimleri</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Güvenlik */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Güvenlik
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Telefon Doğrulama</p>
                <p className="text-xs text-muted-foreground">
                  {user.isVerified ? "Doğrulanmış" : "Doğrulanmamış"}
                </p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${user.isVerified ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                {user.isVerified ? "Aktif" : "Beklemede"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Çıkış */}
        <Button
          variant="outline"
          className="w-full text-red-600 border-red-200 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Çıkış Yap
        </Button>
      </div>

      <BottomNavigation activeTab="profile" />
    </div>
  )
}
