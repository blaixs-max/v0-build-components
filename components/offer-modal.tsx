"use client"

import { useState } from "react"
import { Send, ShieldCheck, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useUser } from "@/contexts/user-context"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface OfferModalProps {
  isOpen: boolean
  onClose: () => void
  listingId: string
  listingTitle: string
  currentPrice: number
}

export function OfferModal({ isOpen, onClose, listingId, listingTitle, currentPrice }: OfferModalProps) {
  const { user, isLoggedIn, sendOffer } = useUser()
  const router = useRouter()
  const [offerAmount, setOfferAmount] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("tr-TR").format(price)
  }

  const handleSubmit = async () => {
    if (!offerAmount) return

    setIsSubmitting(true)

    const result = sendOffer({
      listingId,
      listingTitle,
      offerAmount: Number.parseInt(offerAmount.replace(/\D/g, "")),
      message: message || undefined,
    })

    if (result) {
      setSuccess(true)
      setTimeout(() => {
        onClose()
        setSuccess(false)
        setOfferAmount("")
        setMessage("")
      }, 2000)
    }

    setIsSubmitting(false)
  }

  // Giris yapmamis kullanici
  if (!isLoggedIn) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Giriş Yapmanız Gerekiyor</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center py-6 gap-4">
            <AlertCircle className="h-16 w-16 text-meradan-orange" />
            <p className="text-center text-muted-foreground">Teklif verebilmek için önce giriş yapmalısınız.</p>
            <Button className="w-full bg-meradan-green hover:bg-meradan-green/90" onClick={() => router.push("/giris")}>
              Giriş Yap
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // Dogrulanmamis kullanici
  if (!user?.isVerified) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Hesap Doğrulaması Gerekiyor</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center py-6 gap-4">
            <ShieldCheck className="h-16 w-16 text-meradan-orange" />
            <p className="text-center text-muted-foreground">
              Teklif verebilmek için hesabınızı doğrulamanız gerekiyor. Profil sayfanızdan telefon numaranızı
              doğrulayabilirsiniz.
            </p>
            <Button
              className="w-full bg-meradan-green hover:bg-meradan-green/90"
              onClick={() => router.push("/profil")}
            >
              Profil Sayfasına Git
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // Basarili teklif
  if (success) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center py-8 gap-4">
            <div className="w-16 h-16 rounded-full bg-meradan-green/10 flex items-center justify-center">
              <Send className="h-8 w-8 text-meradan-green" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Teklifiniz Gönderildi!</h3>
            <p className="text-center text-muted-foreground text-sm">
              Satıcı teklifinizi değerlendirecek ve size dönüş yapacak.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Teklif Ver</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Ilan bilgisi */}
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-sm text-muted-foreground">İlan</p>
            <p className="font-medium text-foreground">{listingTitle}</p>
            <p className="text-sm text-meradan-green font-semibold mt-1">
              İstenen Fiyat: ₺ {formatPrice(currentPrice)}
            </p>
          </div>

          {/* Teklif tutari */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Teklif Tutarınız (₺)</label>
            <Input
              type="text"
              placeholder="Örn: 35000"
              value={offerAmount}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "")
                if (value) {
                  setOfferAmount(formatPrice(Number.parseInt(value)))
                } else {
                  setOfferAmount("")
                }
              }}
              className="text-lg font-semibold"
            />
          </div>

          {/* Mesaj */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Mesajınız (Opsiyonel)</label>
            <Textarea
              placeholder="Satıcıya iletmek istediğiniz bir mesaj..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
          </div>

          {/* Butonlar */}
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1 bg-transparent" onClick={onClose}>
              İptal
            </Button>
            <Button
              className="flex-1 bg-meradan-green hover:bg-meradan-green/90"
              onClick={handleSubmit}
              disabled={!offerAmount || isSubmitting}
            >
              <Send className="h-4 w-4 mr-2" />
              Teklif Gönder
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
