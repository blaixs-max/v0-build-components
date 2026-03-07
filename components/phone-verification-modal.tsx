"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle2, Phone, ShieldCheck } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PhoneVerificationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  phone: string
  onVerified: () => void
}

export function PhoneVerificationModal({ open, onOpenChange, phone, onVerified }: PhoneVerificationModalProps) {
  const [step, setStep] = useState<"send" | "verify" | "success">("send")
  const [code, setCode] = useState(["", "", "", "", "", ""])
  const [generatedCode, setGeneratedCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const { toast } = useToast()

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const generateCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  const handleSendCode = async () => {
    setIsLoading(true)

    // Simüle edilmiş SMS gönderimi (Demo mod)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const newCode = generateCode()
    setGeneratedCode(newCode)

    // Demo modda kodu toast ile göster
    toast({
      title: "Demo Mod - SMS Kodu",
      description: `Doğrulama kodunuz: ${newCode}`,
      duration: 10000,
    })

    setIsLoading(false)
    setStep("verify")
    setCountdown(120) // 2 dakika geri sayım

    // İlk input'a odaklan
    setTimeout(() => inputRefs.current[0]?.focus(), 100)
  }

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Yapıştırma durumu
      const pastedCode = value.slice(0, 6).split("")
      const newCode = [...code]
      pastedCode.forEach((char, i) => {
        if (index + i < 6) {
          newCode[index + i] = char
        }
      })
      setCode(newCode)
      const nextIndex = Math.min(index + pastedCode.length, 5)
      inputRefs.current[nextIndex]?.focus()
      return
    }

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    // Sonraki input'a geç
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleVerify = async () => {
    const enteredCode = code.join("")
    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (enteredCode === generatedCode) {
      setStep("success")
      setTimeout(() => {
        onVerified()
        onOpenChange(false)
        // Reset state
        setStep("send")
        setCode(["", "", "", "", "", ""])
        setGeneratedCode("")
      }, 2000)
    } else {
      toast({
        title: "Hatalı Kod",
        description: "Girdiğiniz kod yanlış. Lütfen tekrar deneyin.",
        variant: "destructive",
      })
      setCode(["", "", "", "", "", ""])
      inputRefs.current[0]?.focus()
    }

    setIsLoading(false)
  }

  const handleResend = () => {
    setCode(["", "", "", "", "", ""])
    handleSendCode()
  }

  const formatPhone = (phone: string) => {
    // Telefon numarasının son 4 hanesini göster
    const cleaned = phone.replace(/\D/g, "")
    return `*** *** ${cleaned.slice(-4)}`
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {step === "send" && (
          <>
            <DialogHeader>
              <div className="mx-auto w-16 h-16 bg-meradan-green/10 rounded-full flex items-center justify-center mb-4">
                <Phone className="h-8 w-8 text-meradan-green" />
              </div>
              <DialogTitle className="text-center">Telefon Doğrulama</DialogTitle>
              <DialogDescription className="text-center">
                Hesabınızı doğrulamak için telefonunuza bir SMS kodu göndereceğiz.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="bg-muted rounded-lg p-4 text-center">
                <p className="text-sm text-muted-foreground">Doğrulama kodu gönderilecek numara:</p>
                <p className="text-lg font-semibold mt-1">{phone}</p>
              </div>
              <Button
                className="w-full bg-meradan-green hover:bg-meradan-green/90"
                onClick={handleSendCode}
                disabled={isLoading}
              >
                {isLoading ? "Gönderiliyor..." : "Kod Gönder"}
              </Button>
              <p className="text-xs text-center text-muted-foreground">Demo modda kod ekranda gösterilecektir.</p>
            </div>
          </>
        )}

        {step === "verify" && (
          <>
            <DialogHeader>
              <div className="mx-auto w-16 h-16 bg-meradan-orange/10 rounded-full flex items-center justify-center mb-4">
                <ShieldCheck className="h-8 w-8 text-meradan-orange" />
              </div>
              <DialogTitle className="text-center">Kodu Girin</DialogTitle>
              <DialogDescription className="text-center">
                {formatPhone(phone)} numarasına gönderilen 6 haneli kodu girin.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 pt-4">
              {/* Kod giriş alanları */}
              <div className="flex justify-center gap-2">
                {code.map((digit, index) => (
                  <Input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value.replace(/\D/g, ""))}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-11 h-14 text-center text-xl font-bold border-2 focus:border-meradan-green"
                  />
                ))}
              </div>

              {/* Geri sayım */}
              {countdown > 0 && (
                <p className="text-center text-sm text-muted-foreground">
                  Kodu tekrar gönder: {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, "0")}
                </p>
              )}

              <Button
                className="w-full bg-meradan-green hover:bg-meradan-green/90"
                onClick={handleVerify}
                disabled={isLoading || code.some((d) => !d)}
              >
                {isLoading ? "Doğrulanıyor..." : "Doğrula"}
              </Button>

              {countdown === 0 && (
                <Button variant="ghost" className="w-full text-meradan-green" onClick={handleResend}>
                  Tekrar Kod Gönder
                </Button>
              )}
            </div>
          </>
        )}

        {step === "success" && (
          <div className="py-8 text-center">
            <div className="mx-auto w-20 h-20 bg-meradan-green/10 rounded-full flex items-center justify-center mb-4 animate-pulse">
              <CheckCircle2 className="h-12 w-12 text-meradan-green" />
            </div>
            <h3 className="text-xl font-bold text-meradan-green">Doğrulama Başarılı!</h3>
            <p className="text-muted-foreground mt-2">Hesabınız başarıyla doğrulandı.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
