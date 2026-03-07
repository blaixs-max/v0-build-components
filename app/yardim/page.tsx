"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft, HelpCircle, ChevronDown, Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { BottomNavigation } from "@/components/bottom-navigation"

const FAQ_ITEMS = [
  {
    question: "Nasıl ilan verebilirim?",
    answer:
      "Ana sayfada '+' butonuna tıklayarak ilan oluşturma sihirbazını açabilirsiniz. Hayvan türünü seçin, detayları doldurun, fotoğraf ekleyin ve ilanınızı yayınlayın.",
  },
  {
    question: "Teklif nasıl gönderilir?",
    answer:
      "İlan detay sayfasında 'Teklif Ver' butonuna tıklayarak teklif gönderebilirsiniz. Telefon doğrulamanızın yapılmış olması gerekmektedir.",
  },
  {
    question: "Ödeme nasıl yapılır?",
    answer:
      "Şu an için ödeme sistemi geliştirme aşamasındadır. Güvenli emanet ödeme sistemi yakında hizmetinize sunulacaktır.",
  },
  {
    question: "İlanımı nasıl düzenleyebilirim?",
    answer:
      "Profilim > İlanlarım bölümünden ilanlarınızı görüntüleyebilir ve düzenleyebilirsiniz.",
  },
  {
    question: "Hesabımı nasıl doğrulatırım?",
    answer:
      "Giriş yaparken telefon numaranıza gelen OTP kodunu girerek hesabınızı doğrulayabilirsiniz. Kimlik doğrulama ise yakında eklenecektir.",
  },
  {
    question: "Komisyon oranı nedir?",
    answer:
      "Alıcıdan %3 komisyon alınmaktadır. Satıcıdan herhangi bir komisyon alınmaz.",
  },
]

export default function YardimPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="flex items-center gap-3 px-4 py-4">
          <Button variant="ghost" size="icon" className="shrink-0" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">Yardım</h1>
        </div>
      </div>

      <div className="px-4 py-4 space-y-6">
        {/* SSS */}
        <div>
          <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-meradan-green" />
            Sıkça Sorulan Sorular
          </h2>
          <div className="space-y-2">
            {FAQ_ITEMS.map((item, index) => (
              <Collapsible key={index}>
                <Card>
                  <CollapsibleTrigger className="w-full">
                    <CardContent className="p-4 flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground text-left">{item.question}</p>
                      <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0 ml-2" />
                    </CardContent>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="px-4 pb-4">
                      <p className="text-sm text-muted-foreground">{item.answer}</p>
                    </div>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            ))}
          </div>
        </div>

        {/* İletişim */}
        <div>
          <h2 className="text-base font-semibold mb-3">İletişim</h2>
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-meradan-green/10 flex items-center justify-center">
                  <Mail className="h-5 w-5 text-meradan-green" />
                </div>
                <div>
                  <p className="text-sm font-medium">E-posta</p>
                  <p className="text-sm text-muted-foreground">destek@meradan.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-meradan-green/10 flex items-center justify-center">
                  <Phone className="h-5 w-5 text-meradan-green" />
                </div>
                <div>
                  <p className="text-sm font-medium">Telefon</p>
                  <p className="text-sm text-muted-foreground">0850 123 45 67</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <BottomNavigation activeTab="profile" />
    </div>
  )
}
