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

export default function GirisPage() {
  const router = useRouter()
  const { login } = useUser()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validatePhone = (phone: string) => {
    const phoneRegex = /^5\d{9}$/
    return phoneRegex.test(phone.replace(/\s/g, ""))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = "İsim gerekli"
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Soyisim gerekli"
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Telefon numarası gerekli"
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "Geçerli bir telefon numarası girin (5XX XXX XX XX)"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    login({
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      phone: formData.phone.replace(/\s/g, ""),
    })

    router.push("/")
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
        <p className="text-muted-foreground text-sm">Türkiye&apos;nin Hayvan Pazarı</p>
      </div>

      {/* Giriş Formu */}
      <Card className="w-full max-w-md border-0 shadow-lg">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-xl text-foreground">Giriş Yap</CardTitle>
          <CardDescription>Bilgilerinizi girerek devam edin</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
                  }}
                  className={`rounded-l-none ${errors.phone ? "border-destructive" : ""}`}
                />
              </div>
              {errors.phone && <p className="text-destructive text-xs">{errors.phone}</p>}
            </div>

            <div className="flex gap-3">
              <Button type="submit" className="flex-1 bg-meradan-green hover:bg-meradan-green/90 text-white">
                Giriş Yap
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleOpenWithoutLogin}
                className="flex-1 border-meradan-green text-meradan-green hover:bg-meradan-green/10 bg-transparent"
              >
                Misafir Olarak Göz At
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Alt Bilgi */}
      <p className="mt-6 text-xs text-muted-foreground text-center max-w-xs">
        Giriş yaparak <span className="text-meradan-green cursor-pointer">Kullanım Koşullarını</span> ve{" "}
        <span className="text-meradan-green cursor-pointer">Gizlilik Politikasını</span> kabul etmiş olursunuz.
      </p>
    </div>
  )
}
