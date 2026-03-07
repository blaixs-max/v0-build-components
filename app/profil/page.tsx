"use client"

import { useRouter } from "next/navigation"
import { useUser } from "@/contexts/user-context"
import { useEffect, useState } from "react"
import {
  Phone,
  MapPin,
  Settings,
  LogOut,
  ChevronRight,
  Heart,
  Package,
  HelpCircle,
  Shield,
  Bell,
  BadgeCheck,
  ShieldAlert,
  CreditCard,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { BottomNavigation } from "@/components/bottom-navigation"
import { PhoneVerificationModal } from "@/components/phone-verification-modal"
import { TrustScoreCard } from "@/components/trust-score-card"

export default function ProfilPage() {
  const router = useRouter()
  const { user, isLoggedIn, logout, updateUser, favorites } = useUser()
  const [verificationOpen, setVerificationOpen] = useState(false)

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/giris")
    }
  }, [isLoggedIn, router])

  if (!isLoggedIn || !user) {
    return null
  }

  const getInitials = () => {
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleVerified = () => {
    updateUser({ isVerified: true })
  }

  const menuItems = [
    { icon: Package, label: "İlanlarım", href: "/ilanlarim", count: 3 },
    { icon: Heart, label: "Favorilerim", href: "/favorilerim", count: favorites.length },
    { icon: CreditCard, label: "Tekliflerim", href: "/tekliflerim", count: 0 },
    { icon: Bell, label: "Bildirimler", href: "/bildirimler", count: 5 },
  ]

  const settingsItems = [
    { icon: Settings, label: "Hesap Ayarları", href: "/ayarlar" },
    { icon: Shield, label: "Gizlilik ve Güvenlik", href: "/guvenlik" },
    { icon: HelpCircle, label: "Yardım ve Destek", href: "/yardim" },
  ]

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-meradan-green px-4 pt-8 pb-12">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
              <AvatarFallback className="bg-white text-meradan-green text-2xl font-bold">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            {user.isVerified && (
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                <BadgeCheck className="h-6 w-6 text-meradan-green fill-meradan-green/20" />
              </div>
            )}
          </div>
          <div className="text-white flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold">
                {user.firstName} {user.lastName}
              </h1>
              {user.isVerified && <BadgeCheck className="h-5 w-5 text-white fill-white/20" />}
            </div>
            <div className="flex items-center gap-1 mt-1 opacity-90">
              <Phone className="h-4 w-4" />
              <span className="text-sm">{user.phone}</span>
            </div>
            {user.location && (
              <div className="flex items-center gap-1 mt-1 opacity-90">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{user.location}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 -mt-6 mb-4">
        <TrustScoreCard user={user} />
      </div>

      {/* Doğrulama Kartı - sadece telefon doğrulanmamışsa göster */}
      {!user.isVerified && (
        <div className="px-4 mb-4">
          <Card className="shadow-lg border-meradan-orange/30 bg-gradient-to-r from-meradan-orange/5 to-meradan-orange/10">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-meradan-orange/20 flex items-center justify-center shrink-0">
                  <ShieldAlert className="h-6 w-6 text-meradan-orange" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">Hesabını Doğrula</h3>
                  <p className="text-sm text-muted-foreground">
                    Güvenilir satıcı rozeti kazanmak için telefonunu doğrula
                  </p>
                </div>
              </div>
              <Button
                className="w-full mt-4 bg-meradan-orange hover:bg-meradan-orange/90"
                onClick={() => setVerificationOpen(true)}
              >
                <BadgeCheck className="h-5 w-5 mr-2" />
                Hesabımı Doğrula
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Stats Card */}
      <div className="px-4">
        <Card className="shadow-lg">
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-meradan-green">3</p>
                <p className="text-xs text-muted-foreground">Aktif İlan</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-meradan-green">{favorites.length}</p>
                <p className="text-xs text-muted-foreground">Favori</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-meradan-green">28</p>
                <p className="text-xs text-muted-foreground">Görüntülenme</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Menu Items */}
      <div className="px-4 mt-6">
        <Card>
          <CardContent className="p-0">
            {menuItems.map((item, index) => (
              <div key={item.label}>
                <button
                  onClick={() => router.push(item.href)}
                  className="flex items-center justify-between w-full px-4 py-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-meradan-green/10 flex items-center justify-center">
                      <item.icon className="h-5 w-5 text-meradan-green" />
                    </div>
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.count > 0 && (
                      <span className="bg-meradan-orange text-white text-xs font-medium px-2 py-0.5 rounded-full">
                        {item.count}
                      </span>
                    )}
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </button>
                {index < menuItems.length - 1 && <Separator />}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Settings Items */}
      <div className="px-4 mt-4">
        <Card>
          <CardContent className="p-0">
            {settingsItems.map((item, index) => (
              <div key={item.label}>
                <button
                  onClick={() => router.push(item.href)}
                  className="flex items-center justify-between w-full px-4 py-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                      <item.icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </button>
                {index < settingsItems.length - 1 && <Separator />}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Logout Button */}
      <div className="px-4 mt-6">
        <Button
          variant="outline"
          className="w-full h-12 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 bg-transparent"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 mr-2" />
          Çıkış Yap
        </Button>
      </div>

      <PhoneVerificationModal
        open={verificationOpen}
        onOpenChange={setVerificationOpen}
        phone={user.phone}
        onVerified={handleVerified}
      />

      <BottomNavigation activeTab="profile" />
    </div>
  )
}
