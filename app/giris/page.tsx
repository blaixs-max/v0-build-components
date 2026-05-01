"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useUser } from "@/contexts/user-context"
import { Eye, EyeOff } from "lucide-react"

export default function GirisPage() {
  const router = useRouter()
  const { login, register } = useUser()
  const [isRegister, setIsRegister] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [apiError, setApiError] = useState("")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    password: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validatePhone = (phone: string) => {
    const phoneRegex = /^5\d{9}$/
    return phoneRegex.test(phone.replace(/\s/g, ""))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiError("")
    const newErrors: Record<string, string> = {}

    if (isRegister) {
      if (!formData.firstName.trim()) newErrors.firstName = "İsim gerekli"
      if (!formData.lastName.trim()) newErrors.lastName = "Soyisim gerekli"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Telefon numarası gerekli"
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "Geçerli bir telefon numarası girin (5XX XXX XX XX)"
    }

    if (!formData.password.trim()) {
      newErrors.password = "Şifre gerekli"
    } else if (isRegister && formData.password.length < 6) {
      newErrors.password = "Şifre en az 6 karakter olmalı"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)
    const cleanPhone = formData.phone.replace(/\s/g, "")

    if (isRegister) {
      const result = await register({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phone: cleanPhone,
        password: formData.password,
      })
      if (result.success) {
        router.push("/")
      } else {
        setApiError(result.error || "Kayıt sırasında bir hata oluştu.")
      }
    } else {
      const result = await login(cleanPhone, formData.password)
      if (result.success) {
        router.push("/")
      } else {
        setApiError(result.error || "Giriş sırasında bir hata oluştu.")
      }
    }

    setIsSubmitting(false)
  }

  const handleOpenWithoutLogin = () => {
    router.push("/")
  }

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    const limited = numbers.slice(0, 10)
    if (limited.length <= 3) return limited
    if (limited.length <= 6) return `${limited.slice(0, 3)} ${limited.slice(3)}`
    if (limited.length <= 8) return `${limited.slice(0, 3)} ${limited.slice(3, 6)} ${limited.slice(6)}`
    return `${limited.slice(0, 3)} ${limited.slice(3, 6)} ${limited.slice(6, 8)} ${limited.slice(8)}`
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* Logo */}
      <div className="mb-8 text-center">
        <Image
          src="/images/meradan-logo.png"
          alt="Meradan"
          width={340}
          height={100}
          priority
          className="mx-auto mb-3 h-14 w-auto"
        />
        <p className="text-muted-foreground text-sm">{"Türkiye'nin Hayvan Pazarı"}</p>
      </div>

      {/* Giriş / Kayıt Formu */}
      <Card className="w-full max-w-md border-0 shadow-lg">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-xl text-foreground">
            {isRegister ? "Kayıt Ol" : "Giriş Yap"}
          </CardTitle>
          <CardDescription>
            {isRegister ? "Yeni hesap oluşturun" : "Bilgilerinizi girerek devam edin"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">İsim</Label>
                  <Input
                    id="firstName"
                    placeholder="Ahmet"
                    value={formData.firstName}
                    onChange={(e) => {
                      setFormData({ ...formData, firstName: e.target.value })
                      setErrors({ ...errors, firstName: "" })
                    }}
                    className={errors.firstName ? "border-destructive" : ""}
                  />
                  {errors.firstName && <p className="text-destructive text-xs">{errors.firstName}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Soyisim</Label>
                  <Input
                    id="lastName"
                    placeholder="Yılmaz"
                    value={formData.lastName}
                    onChange={(e) => {
                      setFormData({ ...formData, lastName: e.target.value })
                      setErrors({ ...errors, lastName: "" })
                    }}
                    className={errors.lastName ? "border-destructive" : ""}
                  />
                  {errors.lastName && <p className="text-destructive text-xs">{errors.lastName}</p>}
                </div>
              </div>
            )}

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
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData({ ...formData, phone: formatPhone(e.target.value) })
                    setErrors({ ...errors, phone: "" })
                    setApiError("")
                  }}
                  className={`rounded-l-none ${errors.phone ? "border-destructive" : ""}`}
                />
              </div>
              {errors.phone && <p className="text-destructive text-xs">{errors.phone}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Şifre</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={isRegister ? "En az 6 karakter" : "Şifreniz"}
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value })
                    setErrors({ ...errors, password: "" })
                    setApiError("")
                  }}
                  className={`pr-10 ${errors.password ? "border-destructive" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-destructive text-xs">{errors.password}</p>}
            </div>

            {apiError && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                {apiError}
              </div>
            )}

            <div className="flex gap-3">
              <Button
                type="submit"
                className="flex-1 bg-meradan-green hover:bg-meradan-green/90 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Lütfen bekleyin..." : isRegister ? "Kayıt Ol" : "Giriş Yap"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleOpenWithoutLogin}
                className="flex-1 border-meradan-green text-meradan-green hover:bg-meradan-green/10 bg-transparent"
              >
                Misafir Göz At
              </Button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setIsRegister(!isRegister)
                  setErrors({})
                  setApiError("")
                }}
                className="text-sm text-meradan-green hover:underline"
              >
                {isRegister ? "Zaten hesabınız var mı? Giriş yapın" : "Hesabınız yok mu? Kayıt olun"}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Alt Bilgi */}
      <p className="mt-6 text-xs text-muted-foreground text-center max-w-xs">
        {"Giriş yaparak "}
        <span className="text-meradan-green cursor-pointer">Kullanım Koşullarını</span>
        {" ve "}
        <span className="text-meradan-green cursor-pointer">Gizlilik Politikasını</span>
        {" kabul etmiş olursunuz."}
      </p>
    </div>
  )
}
