"use client"

import { type User, getLevelInfo } from "@/contexts/user-context"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Phone, ShieldCheck, Zap, Award, Crown, UserIcon, BadgeCheck, Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface TrustScoreCardProps {
  user: User
}

export function TrustScoreCard({ user }: TrustScoreCardProps) {
  const level = user.level || "new"
  const levelInfo = getLevelInfo(level)
  const badges = user.badges || {
    phoneVerified: false,
    identityVerified: false,
    fastResponder: false,
    successfulSales: 0,
  }

  // Seviye ikonunu döndür
  const LevelIcon = () => {
    switch (level) {
      case "premium":
        return <Crown className="h-6 w-6" />
      case "expert":
        return <Award className="h-6 w-6" />
      case "trusted":
        return <ShieldCheck className="h-6 w-6" />
      default:
        return <UserIcon className="h-6 w-6" />
    }
  }

  // İlerleme hesapla (sonraki seviyeye)
  const calculateProgress = () => {
    switch (level) {
      case "new":
        return badges.phoneVerified ? 100 : 0
      case "trusted":
        const trustProgress = (badges.identityVerified ? 50 : 0) + Math.min((badges.successfulSales / 10) * 50, 50)
        return trustProgress
      case "expert":
        const expertProgress = (badges.fastResponder ? 33 : 0) + Math.min((badges.successfulSales / 50) * 67, 67)
        return expertProgress
      case "premium":
        return 100
      default:
        return 0
    }
  }

  // Sonraki seviye bilgisi
  const getNextLevelHint = () => {
    switch (level) {
      case "new":
        return "Telefon doğrulaması yaparak Güvenilir Satıcı olun"
      case "trusted":
        return "Kimlik doğrulaması ve 10+ satış ile Uzman Satıcı olun"
      case "expert":
        return "Tüm rozetleri kazanın ve 50+ satış yaparak Premium olun"
      case "premium":
        return "En yüksek seviyeye ulaştınız!"
      default:
        return ""
    }
  }

  // Üyelik süresi
  const getMemberDuration = () => {
    if (!user.memberSince) return "Yeni üye"
    const start = new Date(user.memberSince)
    const now = new Date()
    const months = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30))
    if (months < 1) return "Yeni üye"
    if (months < 12) return `${months} aydır üye`
    const years = Math.floor(months / 12)
    return `${years} yıldır üye`
  }

  const badgeItems = [
    {
      id: "phone",
      icon: Phone,
      label: "Telefon Doğrulandı",
      earned: badges.phoneVerified,
      description: "SMS ile doğrulama yapıldı",
    },
    {
      id: "identity",
      icon: BadgeCheck,
      label: "Kimlik Doğrulandı",
      earned: badges.identityVerified,
      description: "TC Kimlik doğrulaması yapıldı",
    },
    {
      id: "sales",
      icon: Star,
      label: badges.successfulSales >= 10 ? `${badges.successfulSales}+ Satış` : "10+ Satış",
      earned: badges.successfulSales >= 10,
      description: `${badges.successfulSales} başarılı satış`,
    },
    {
      id: "fast",
      icon: Zap,
      label: "Hızlı Yanıt",
      earned: badges.fastResponder,
      description: "Mesajlara hızlı cevap veriyor",
    },
  ]

  return (
    <Card className={cn("shadow-lg border-2", levelInfo.borderColor)}>
      <CardContent className="p-4">
        {/* Seviye Başlığı */}
        <div className={cn("flex items-center gap-3 p-3 rounded-xl mb-4", levelInfo.bgLight)}>
          <div className={cn("h-12 w-12 rounded-full flex items-center justify-center text-white", levelInfo.color)}>
            <LevelIcon />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className={cn("font-bold text-lg", levelInfo.textColor)}>{levelInfo.name}</h3>
            </div>
            <p className="text-sm text-muted-foreground">{getMemberDuration()}</p>
          </div>
          {user.responseRate !== undefined && user.responseRate > 0 && (
            <div className="text-right">
              <p className="text-sm font-semibold text-meradan-green">{user.responseRate}%</p>
              <p className="text-xs text-muted-foreground">Yanıt Oranı</p>
            </div>
          )}
        </div>

        {/* İlerleme Çubuğu */}
        {level !== "premium" && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground">Sonraki Seviye</span>
              <span className="text-xs font-medium">{Math.round(calculateProgress())}%</span>
            </div>
            <Progress value={calculateProgress()} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">{getNextLevelHint()}</p>
          </div>
        )}

        {/* Rozetler */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-foreground">Rozetler</h4>
          <div className="grid grid-cols-2 gap-2">
            {badgeItems.map((badge) => (
              <div
                key={badge.id}
                className={cn(
                  "flex items-center gap-2 p-2 rounded-lg border transition-all",
                  badge.earned ? "bg-meradan-green/10 border-meradan-green/30" : "bg-muted/50 border-border opacity-50",
                )}
              >
                <div
                  className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center shrink-0",
                    badge.earned ? "bg-meradan-green text-white" : "bg-muted text-muted-foreground",
                  )}
                >
                  <badge.icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p
                    className={cn(
                      "text-xs font-medium truncate",
                      badge.earned ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {badge.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
