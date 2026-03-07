"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { RecaptchaVerifier, signInWithPhoneNumber, type ConfirmationResult } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"

type Step = "phone" | "otp" | "profile"

export default function GirisPage() {
  const router = useRouter()
  const { login, firebaseUser, isLoggedIn } = useAuth()

  const [step, setStep] = useState<Step>("phone")
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)

  const confirmationRef = useRef<ConfirmationResult | null>(null)
  const recaptchaRef = useRef<RecaptchaVerifier | null>(null)

  // Zaten giris yapmissa yonlendir
  useEffect(() => {
    if (isLoggedIn) {
      router.push("/")
    }
  }, [isLoggedIn, router])

  // Geri sayim
  useEffect(() => {
    if (resendTimer <= 0) return
    const t = setInterval(() => setResendTimer((s) => s - 1), 1000)
    return () => clearInterval(t)
  }, [resendTimer])

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    const limited = numbers.slice(0, 10)
    if (limited.length <= 3) return limited
    if (limited.length <= 6) return `${limited.slice(0, 3)} ${limited.slice(3)}`
    if (limited.length <= 8) return `${limited.slice(0, 3)} ${limited.slice(3, 6)} ${limited.slice(6)}`
    return `${limited.slice(0, 3)} ${limited.slice(3, 6)} ${limited.slice(6, 8)} ${limited.slice(8)}`
  }

  const getRawPhone = () => `+90${phone.replace(/\s/g, "")}`

  const initRecaptcha = () => {
    if (!recaptchaRef.current) {
      recaptchaRef.current = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
      })
    }
    return recaptchaRef.current
  }

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const rawPhone = phone.replace(/\s/g, "")
    if (!/^5\d{9}$/.test(rawPhone)) {
      setError("Geçerli bir telefon numarası girin (5XX XXX XX XX)")
      return
    }

    setLoading(true)
    try {
      const verifier = initRecaptcha()
      const result = await signInWithPhoneNumber(auth, getRawPhone(), verifier)
      confirmationRef.current = result
      setStep("otp")
      setResendTimer(60)
    } catch (err: unknown) {
      const firebaseError = err as { code?: string }
      if (firebaseError.code === "auth/invalid-phone-number") {
        setError("Geçersiz telefon numarası.")
      } else if (firebaseError.code === "auth/too-many-requests") {
        setError("Çok fazla deneme. Lütfen bekleyin.")
      } else {
        setError("SMS gönderilemedi. Lütfen tekrar deneyin.")
      }
      recaptchaRef.current = null
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (otp.length !== 6) {
      setError("6 haneli kodu girin.")
      return
    }

    setLoading(true)
    try {
      const result = await confirmationRef.current!.confirm(otp)
      const fbUser = result.user

      // Firestore'da profil var mi? auth-context onAuthStateChanged halledecek.
      // Profil yoksa profil adimina gec
      const { getUserProfile } = await import("@/lib/firestore")
      const profile = await getUserProfile(fbUser.uid)

      if (profile) {
        // Mevcut kullanici - ana sayfaya git
        router.push("/")
      } else {
        // Yeni kullanici - profil olustur
        setStep("profile")
      }
    } catch (err: unknown) {
      const firebaseError = err as { code?: string }
      if (firebaseError.code === "auth/invalid-verification-code") {
        setError("Hatalı kod. Lütfen kontrol edin.")
      } else if (firebaseError.code === "auth/code-expired") {
        setError("Kodun süresi doldu. Tekrar gönderin.")
      } else {
        setError("Doğrulama başarısız. Tekrar deneyin.")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!firstName.trim()) {
      setError("İsim gerekli.")
      return
    }
    if (!lastName.trim()) {
      setError("Soyisim gerekli.")
      return
    }

    setLoading(true)
    try {
      await login({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.replace(/\s/g, ""),
      })
      router.push("/")
    } catch {
      setError("Profil kaydedilemedi. Tekrar deneyin.")
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (resendTimer > 0) return
    setError("")
    setLoading(true)
    try {
      recaptchaRef.current = null
      const verifier = initRecaptcha()
      const result = await signInWithPhoneNumber(auth, getRawPhone(), verifier)
      confirmationRef.current = result
      setResendTimer(60)
    } catch {
      setError("SMS gönderilemedi. Tekrar deneyin.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* Invisible reCAPTCHA container */}
      <div id="recaptcha-container" />

      {/* Logo */}
      <div className="mb-8 text-center">
        <div className="w-20 h-20 bg-meradan-green rounded-full flex items-center justify-center mx-auto mb-4">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" className="w-12 h-12">
            <path d="M12 4c-1.5 0-3 .5-4 1.5C7 6.5 6 8 6 10c0 1.5.5 2.5 1 3.5.5 1 1 2 1 3.5v3h8v-3c0-1.5.5-2.5 1-3.5.5-1 1-2 1-3.5 0-2-1-3.5-2-4.5-1-1-2.5-1.5-4-1.5z" />
            <path d="M9 7c-.5.5-1 1.5-1 3M15 7c.5.5 1 1.5 1 3" />
            <ellipse cx="9" cy="11" rx="1" ry="1.5" fill="white" />
            <ellipse cx="15" cy="11" rx="1" ry="1.5" fill="white" />
            <path d="M8 4c-1-1-2-1.5-3-1.5M16 4c1-1 2-1.5 3-1.5" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-meradan-green">Mera'dan</h1>
        <p className="text-muted-foreground text-sm">Türkiye'nin Hayvan Pazarı</p>
      </div>

      <Card className="w-full max-w-md border-0 shadow-lg">
        {/* ADIM 1: Telefon */}
        {step === "phone" && (
          <>
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl">Giriş Yap</CardTitle>
              <CardDescription>Telefon numaranıza SMS kodu göndereceğiz</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefon Numarası</Label>
                  <div className="flex">
                    <div className="flex items-center px-3 bg-muted border border-r-0 border-input rounded-l-md text-muted-foreground text-sm">
                      +90
                    </div>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="5XX XXX XX XX"
                      value={phone}
                      onChange={(e) => {
                        setPhone(formatPhone(e.target.value))
                        setError("")
                      }}
                      className={`rounded-l-none ${error ? "border-destructive" : ""}`}
                    />
                  </div>
                  {error && <p className="text-destructive text-xs">{error}</p>}
                </div>

                <div className="flex gap-3">
                  <Button
                    type="submit"
                    className="flex-1 bg-meradan-green hover:bg-meradan-green/90 text-white"
                    disabled={loading}
                  >
                    {loading ? "Gönderiliyor..." : "SMS Gönder"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/")}
                    className="flex-1 border-meradan-green text-meradan-green hover:bg-meradan-green/10 bg-transparent"
                  >
                    Misafir Ol
                  </Button>
                </div>
              </form>
            </CardContent>
          </>
        )}

        {/* ADIM 2: OTP */}
        {step === "otp" && (
          <>
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl">Kodu Girin</CardTitle>
              <CardDescription>
                +90 {phone} numarasına gönderilen 6 haneli kodu girin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">Doğrulama Kodu</Label>
                  <Input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    placeholder="123456"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => {
                      setOtp(e.target.value.replace(/\D/g, ""))
                      setError("")
                    }}
                    className={`text-center text-2xl tracking-widest ${error ? "border-destructive" : ""}`}
                  />
                  {error && <p className="text-destructive text-xs">{error}</p>}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-meradan-green hover:bg-meradan-green/90 text-white"
                  disabled={loading}
                >
                  {loading ? "Doğrulanıyor..." : "Doğrula"}
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendTimer > 0 || loading}
                    className="text-sm text-meradan-green disabled:text-muted-foreground"
                  >
                    {resendTimer > 0 ? `Tekrar gönder (${resendTimer}s)` : "Kodu tekrar gönder"}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => { setStep("phone"); setOtp(""); setError("") }}
                  className="w-full text-sm text-muted-foreground underline"
                >
                  Telefon numarasını değiştir
                </button>
              </form>
            </CardContent>
          </>
        )}

        {/* ADIM 3: Profil (yeni kullanici) */}
        {step === "profile" && (
          <>
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl">Hoş Geldiniz!</CardTitle>
              <CardDescription>Profilinizi tamamlayın</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">İsim</Label>
                    <Input
                      id="firstName"
                      placeholder="Ahmet"
                      value={firstName}
                      onChange={(e) => { setFirstName(e.target.value); setError("") }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Soyisim</Label>
                    <Input
                      id="lastName"
                      placeholder="Yılmaz"
                      value={lastName}
                      onChange={(e) => { setLastName(e.target.value); setError("") }}
                    />
                  </div>
                </div>
                {error && <p className="text-destructive text-xs">{error}</p>}

                <Button
                  type="submit"
                  className="w-full bg-meradan-green hover:bg-meradan-green/90 text-white"
                  disabled={loading}
                >
                  {loading ? "Kaydediliyor..." : "Devam Et"}
                </Button>
              </form>
            </CardContent>
          </>
        )}
      </Card>

      <p className="mt-6 text-xs text-muted-foreground text-center max-w-xs">
        Giriş yaparak{" "}
        <span className="text-meradan-green cursor-pointer">Kullanım Koşullarını</span> ve{" "}
        <span className="text-meradan-green cursor-pointer">Gizlilik Politikasını</span> kabul
        etmiş olursunuz.
      </p>
    </div>
  )
}
