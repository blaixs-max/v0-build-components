"use client"

import { useRouter } from "next/navigation"
import { useUser } from "@/contexts/user-context"
import { useEffect, useState } from "react"
import { ArrowLeft, HelpCircle, MessageCircle, FileText, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SiteHeader } from "@/components/site-header"
import { BottomNavigation } from "@/components/bottom-navigation"
import { cn } from "@/lib/utils"

const faqItems = [
  {
    question: "Nasil ilan verebilirim?",
    answer: "Ana sayfadaki 'Ucretsiz Ilan Ver' butonuna tiklayarak veya alt menudeki 'Ilan Ver' sekmesinden yeni ilan olusturabilirsiniz. 3 adimda ilaninizi yayinlayabilirsiniz.",
  },
  {
    question: "Ilan vermek ucretli mi?",
    answer: "Hayir, Meradan uygulamasinda ilan vermek tamamen ucretsizdir.",
  },
  {
    question: "Nasil teklif gonderebilirim?",
    answer: "Begendiginiz bir ilanin detay sayfasina gidin ve 'Teklif Ver' butonuna tiklayin. Teklif tutarinizi ve mesajinizi girin.",
  },
  {
    question: "Isletme numarasi nedir?",
    answer: "Isletme numarasi, Tarim ve Orman Bakanligi tarafindan hayvancilk isletmelerine verilen resmi kayit numarasidir. TR ile baslar ve rakamlardan olusur.",
  },
  {
    question: "Hesabimi nasil dogrularim?",
    answer: "Profil sayfanizda 'Hesabimi Dogrula' butonuna tiklayin. Telefonunuza gelen SMS kodunu girerek hesabinizi dogrulayabilirsiniz.",
  },
]

export default function YardimPage() {
  const router = useRouter()
  const { isLoggedIn } = useUser()
  const [openFaq, setOpenFaq] = useState<number | null>(null)

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
          <h1 className="text-lg font-semibold text-foreground">Yardim ve Destek</h1>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-10 space-y-6">
        {/* Iletisim */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex flex-col items-center gap-2 text-center">
              <div className="h-12 w-12 rounded-full bg-meradan-green/10 flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-meradan-green" />
              </div>
              <p className="font-medium text-sm">Canli Destek</p>
              <p className="text-xs text-muted-foreground">7/24 yardim alin</p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex flex-col items-center gap-2 text-center">
              <div className="h-12 w-12 rounded-full bg-meradan-orange/10 flex items-center justify-center">
                <FileText className="h-6 w-6 text-meradan-orange" />
              </div>
              <p className="font-medium text-sm">Kullanim Kilavuzu</p>
              <p className="text-xs text-muted-foreground">Detayli rehber</p>
            </CardContent>
          </Card>
        </div>

        {/* SSS */}
        <div>
          <h2 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-meradan-green" />
            Sik Sorulan Sorular
          </h2>
          <Card>
            <CardContent className="p-0">
              {faqItems.map((faq, index) => (
                <div key={index}>
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="flex items-center justify-between w-full px-4 py-4 text-left hover:bg-muted/50 transition-colors"
                  >
                    <span className="font-medium text-sm text-foreground pr-4">{faq.question}</span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 text-muted-foreground shrink-0 transition-transform",
                        openFaq === index && "rotate-180"
                      )}
                    />
                  </button>
                  {openFaq === index && (
                    <div className="px-4 pb-4">
                      <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                  {index < faqItems.length - 1 && <div className="border-t border-border" />}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>

      <BottomNavigation activeTab="profile" />
    </div>
  )
}
