"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { ArrowLeft, Camera, X, Check, Video, Building2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { LocationSelector } from "@/components/location-selector"
import { getCityByValue } from "@/lib/turkey-locations"
import { useUser } from "@/contexts/user-context"
import { validateEnterpriseNo, formatEnterpriseDisplay } from "@/lib/enterprise-validation"

type Category = "buyukbas" | "kucukbas" | null
type Gender = "disi" | "erkek"
type AnimalType = "koyun" | "keci"
type SaleType = "tekli" | "toplu"

export interface ListingFormData {
  category: Category
  gender: Gender
  breed: string
  age: string
  weight: string
  status: string[]
  animalType: AnimalType
  saleType: SaleType
  quantity: string
  price: string
  photos: string[]
  video: string | null
  city: string
  district: string
  earTag: string
  enterpriseNo: string
  enterpriseLabel: string
  description: string
}

const initialFormData: ListingFormData = {
  category: null,
  gender: "erkek",
  breed: "",
  age: "",
  weight: "",
  status: [],
  animalType: "koyun",
  saleType: "tekli",
  quantity: "1",
  price: "",
  photos: [],
  video: null,
  city: "",
  district: "",
  earTag: "",
  enterpriseNo: "",
  enterpriseLabel: "",
  description: "",
}

const BUYUKBAS_BREEDS = [
  { value: "simental", label: "Simental", image: "/simental-bull-cattle.jpg" },
  { value: "holstein", label: "Hoştayn", image: "/holstein-black-white-dairy-cow.jpg" },
  { value: "montofon", label: "Montofon", image: "/brown-swiss-heifer-cattle.jpg" },
  { value: "yerli", label: "Yerli", image: "/jersey-brown-dairy-cow.jpg" },
]

const KUCUKBAS_BREEDS = [
  { value: "merinos", label: "Merinos", image: "/merino-ram-sheep-wool.jpg" },
  { value: "kivircik", label: "Kıvırcık", image: "/kivircik-lamb-sheep.jpg" },
  { value: "kilkecisi", label: "Kıl Keçisi", image: "/akkaraman-sheep-white.jpg" },
]

const AGE_OPTIONS = ["0-6 Ay", "6-12 Ay", "1-2 Yaş", "2+ Yaş"]

const BUYUKBAS_STATUS = ["Gebe", "Buzağılı", "Besilik", "Kurbanlık"]
const KUCUKBAS_STATUS = ["Kuzulu", "Gebe", "Adaklık"]

interface CreateListingWizardProps {
  onClose: () => void
  onSubmit: (data: ListingFormData) => void
}

export function CreateListingWizard({ onClose, onSubmit }: CreateListingWizardProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<ListingFormData>(initialFormData)
  const [enterpriseMode, setEnterpriseMode] = useState<"saved" | "manual">("saved")
  const [enterpriseError, setEnterpriseError] = useState("")
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false)
  const [isUploadingVideo, setIsUploadingVideo] = useState(false)
  const [uploadError, setUploadError] = useState("")
  const photoInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const { enterpriseNumbers, isLoggedIn } = useUser()

  const handleCategorySelect = (category: Category) => {
    setFormData({ ...initialFormData, category })
    setStep(2)
  }

  const handleBack = () => {
    if (step === 1) {
      onClose()
    } else {
      setStep(step - 1)
    }
  }

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    }
  }

  const handleSubmit = () => {
    onSubmit(formData)
  }

  const toggleStatus = (status: string) => {
    setFormData((prev) => ({
      ...prev,
      status: prev.status.includes(status) ? prev.status.filter((s) => s !== status) : [...prev.status, status],
    }))
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    setUploadError("")
    setIsUploadingPhoto(true)

    try {
      const remainingSlots = 5 - formData.photos.length
      const filesToUpload = Array.from(files).slice(0, remainingSlots)

      for (const file of filesToUpload) {
        if (file.size > 5 * 1024 * 1024) {
          setUploadError(`${file.name}: Maksimum 5MB olabilir.`)
          continue
        }
        const fd = new FormData()
        fd.append("file", file)
        fd.append("type", "photo")
        const res = await fetch("/api/upload", { method: "POST", body: fd })
        const data = await res.json()
        if (!res.ok) {
          setUploadError(data.error || "Yükleme hatası")
          continue
        }
        setFormData((prev) => ({
          ...prev,
          photos: [...prev.photos, data.url],
        }))
      }
    } catch {
      setUploadError("Fotoğraf yüklenirken bir hata oluştu.")
    } finally {
      setIsUploadingPhoto(false)
      if (photoInputRef.current) photoInputRef.current.value = ""
    }
  }

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadError("")
    setIsUploadingVideo(true)

    try {
      if (file.size > 50 * 1024 * 1024) {
        setUploadError("Video boyutu en fazla 50MB olabilir.")
        return
      }
      const fd = new FormData()
      fd.append("file", file)
      fd.append("type", "video")
      const res = await fetch("/api/upload", { method: "POST", body: fd })
      const data = await res.json()
      if (!res.ok) {
        setUploadError(data.error || "Video yükleme hatası")
        return
      }
      setFormData((prev) => ({ ...prev, video: data.url }))
    } catch {
      setUploadError("Video yüklenirken bir hata oluştu.")
    } finally {
      setIsUploadingVideo(false)
      if (videoInputRef.current) videoInputRef.current.value = ""
    }
  }

  const removeVideo = () => {
    setFormData((prev) => ({
      ...prev,
      video: null,
    }))
  }

  const removePhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }))
  }

  const getLocationDisplay = () => {
    if (!formData.city) return null
    const city = getCityByValue(formData.city)
    if (!city) return null
    if (formData.district && formData.district !== "all") {
      const district = city.districts.find((d) => d.value === formData.district)
      return district ? `${city.label}, ${district.label}` : city.label
    }
    return city.label
  }

  const isStep2Valid = () => {
    if (formData.category === "buyukbas") {
      return formData.breed && formData.age && formData.weight && formData.city
    } else {
      return formData.breed && (formData.saleType === "tekli" || formData.quantity) && formData.city
    }
  }

  const isStep3Valid = () => {
    return formData.price && formData.photos.length > 0
  }

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card">
        <button onClick={handleBack} className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-semibold">İlan Ver</h1>
          <p className="text-xs text-muted-foreground">Adım {step}/3</p>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="h-1 bg-muted">
        <div
          className="h-full bg-meradan-green transition-all duration-300"
          style={{ width: `${(step / 3) * 100}%` }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Step 1: Kategori Seçimi */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-xl font-bold text-foreground">Hayvan Türü Seçin</h2>
              <p className="text-sm text-muted-foreground mt-1">Hangi türde hayvan satmak istiyorsunuz?</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card
                className={cn(
                  "p-6 cursor-pointer transition-all hover:shadow-lg border-2",
                  formData.category === "buyukbas"
                    ? "border-meradan-green bg-meradan-green/5"
                    : "border-transparent hover:border-meradan-green/50",
                )}
                onClick={() => handleCategorySelect("buyukbas")}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="w-20 h-20 relative">
                    <Image src="/images/buyukbas.png" alt="Büyükbaş" fill className="object-contain" />
                  </div>
                  <span className="font-semibold text-foreground">Büyükbaş</span>
                  <span className="text-xs text-muted-foreground">İnek, Boğa, Dana</span>
                </div>
              </Card>

              <Card
                className={cn(
                  "p-6 cursor-pointer transition-all hover:shadow-lg border-2",
                  formData.category === "kucukbas"
                    ? "border-meradan-green bg-meradan-green/5"
                    : "border-transparent hover:border-meradan-green/50",
                )}
                onClick={() => handleCategorySelect("kucukbas")}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className="w-20 h-20 relative">
                    <Image src="/images/kucukbas.png" alt="Küçükbaş" fill className="object-contain" />
                  </div>
                  <span className="font-semibold text-foreground">Küçükbaş</span>
                  <span className="text-xs text-muted-foreground">Koyun, Keçi, Kuzu</span>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Step 2: Detay Bilgileri - Büyükbaş */}
        {step === 2 && formData.category === "buyukbas" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-foreground">Büyükbaş Bilgileri</h2>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Konum <span className="text-red-500">*</span>
              </label>
              <LocationSelector
                selectedCity={formData.city}
                selectedDistrict={formData.district}
                onCityChange={(city) => setFormData((prev) => ({ ...prev, city, district: "" }))}
                onDistrictChange={(district) => setFormData((prev) => ({ ...prev, district }))}
              />
            </div>

            {/* Cinsiyet */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Cinsiyet</label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={formData.gender === "disi" ? "default" : "outline"}
                  className={cn("h-12", formData.gender === "disi" && "bg-meradan-green hover:bg-meradan-green/90")}
                  onClick={() => setFormData((prev) => ({ ...prev, gender: "disi" }))}
                >
                  Dişi
                </Button>
                <Button
                  type="button"
                  variant={formData.gender === "erkek" ? "default" : "outline"}
                  className={cn("h-12", formData.gender === "erkek" && "bg-meradan-green hover:bg-meradan-green/90")}
                  onClick={() => setFormData((prev) => ({ ...prev, gender: "erkek" }))}
                >
                  Erkek
                </Button>
              </div>
            </div>

            {/* Irk */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Irk <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {BUYUKBAS_BREEDS.map((breed) => (
                  <button
                    key={breed.value}
                    type="button"
                    className={cn(
                      "flex items-center gap-2 p-3 rounded-lg border-2 transition-all",
                      formData.breed === breed.value
                        ? "border-meradan-green bg-meradan-green/5"
                        : "border-border hover:border-meradan-green/50",
                    )}
                    onClick={() => setFormData((prev) => ({ ...prev, breed: breed.value }))}
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden relative flex-shrink-0">
                      <Image src={breed.image || "/placeholder.svg"} alt={breed.label} fill className="object-cover" />
                    </div>
                    <span className="text-sm font-medium">{breed.label}</span>
                    {formData.breed === breed.value && <Check className="h-4 w-4 text-meradan-green ml-auto" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Yaş */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Yaş <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {AGE_OPTIONS.map((age) => (
                  <button
                    key={age}
                    type="button"
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium transition-all",
                      formData.age === age
                        ? "bg-meradan-green text-white"
                        : "bg-muted text-foreground hover:bg-muted/80",
                    )}
                    onClick={() => setFormData((prev) => ({ ...prev, age }))}
                  >
                    {age}
                  </button>
                ))}
              </div>
            </div>

            {/* Ağırlık */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Canlı Kilo <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Input
                  type="number"
                  placeholder="Örn: 450"
                  value={formData.weight}
                  onChange={(e) => setFormData((prev) => ({ ...prev, weight: e.target.value }))}
                  className="h-12 pr-12 text-lg"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">kg</span>
              </div>
            </div>

            {/* Durum */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Durum (Opsiyonel)</label>
              <div className="flex flex-wrap gap-2">
                {BUYUKBAS_STATUS.map((status) => (
                  <button
                    key={status}
                    type="button"
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium transition-all",
                      formData.status.includes(status)
                        ? "bg-meradan-orange text-white"
                        : "bg-muted text-foreground hover:bg-muted/80",
                    )}
                    onClick={() => toggleStatus(status)}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* İşletme Numarası (Opsiyonel) */}
            {isLoggedIn && (
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">İşletme Numarası (Opsiyonel)</label>

                {enterpriseNumbers.length > 0 && (
                  <div className="flex gap-2 mb-2">
                    <Button
                      type="button"
                      size="sm"
                      variant={enterpriseMode === "saved" ? "default" : "outline"}
                      className={cn(enterpriseMode === "saved" && "bg-meradan-green hover:bg-meradan-green/90")}
                      onClick={() => { setEnterpriseMode("saved"); setEnterpriseError("") }}
                    >
                      Kayıtlı
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={enterpriseMode === "manual" ? "default" : "outline"}
                      className={cn(enterpriseMode === "manual" && "bg-meradan-green hover:bg-meradan-green/90")}
                      onClick={() => { setEnterpriseMode("manual"); setEnterpriseError("") }}
                    >
                      Manuel Gir
                    </Button>
                  </div>
                )}

                {(enterpriseMode === "saved" && enterpriseNumbers.length > 0) ? (
                  <div className="space-y-2">
                    {enterpriseNumbers.map((en) => (
                      <button
                        key={en.id}
                        type="button"
                        className={cn(
                          "flex items-center gap-3 w-full p-3 rounded-lg border-2 transition-all text-left",
                          formData.enterpriseNo === en.enterpriseNo
                            ? "border-meradan-green bg-meradan-green/5"
                            : "border-border hover:border-meradan-green/50",
                        )}
                        onClick={() => setFormData((prev) => ({
                          ...prev,
                          enterpriseNo: prev.enterpriseNo === en.enterpriseNo ? "" : en.enterpriseNo,
                          enterpriseLabel: prev.enterpriseNo === en.enterpriseNo ? "" : (en.label || ""),
                        }))}
                      >
                        <Building2 className="h-5 w-5 text-meradan-green shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-mono text-sm font-medium truncate">
                            {formatEnterpriseDisplay(en.enterpriseNo, en.label)}
                          </p>
                        </div>
                        {formData.enterpriseNo === en.enterpriseNo && (
                          <Check className="h-5 w-5 text-meradan-green shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Input
                      placeholder="TR0612345"
                      value={formData.enterpriseNo}
                      onChange={(e) => {
                        const val = e.target.value.toUpperCase()
                        setFormData((prev) => ({ ...prev, enterpriseNo: val }))
                        setEnterpriseError("")
                        if (val && !validateEnterpriseNo(val).valid) {
                          setEnterpriseError(validateEnterpriseNo(val).error || "")
                        }
                      }}
                      className="font-mono"
                      maxLength={14}
                    />
                    {enterpriseError && (
                      <p className="text-xs text-destructive">{enterpriseError}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {"Format: TR + 2 hane il kodu + 1-10 rakam"}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Detay Bilgileri - Küçükbaş */}
        {step === 2 && formData.category === "kucukbas" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-foreground">Küçükbaş Bilgileri</h2>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Konum <span className="text-red-500">*</span>
              </label>
              <LocationSelector
                selectedCity={formData.city}
                selectedDistrict={formData.district}
                onCityChange={(city) => setFormData((prev) => ({ ...prev, city, district: "" }))}
                onDistrictChange={(district) => setFormData((prev) => ({ ...prev, district }))}
              />
            </div>

            {/* Tür */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Tür</label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={formData.animalType === "koyun" ? "default" : "outline"}
                  className={cn(
                    "h-12",
                    formData.animalType === "koyun" && "bg-meradan-green hover:bg-meradan-green/90",
                  )}
                  onClick={() => setFormData((prev) => ({ ...prev, animalType: "koyun" }))}
                >
                  Koyun
                </Button>
                <Button
                  type="button"
                  variant={formData.animalType === "keci" ? "default" : "outline"}
                  className={cn("h-12", formData.animalType === "keci" && "bg-meradan-green hover:bg-meradan-green/90")}
                  onClick={() => setFormData((prev) => ({ ...prev, animalType: "keci" }))}
                >
                  Keçi
                </Button>
              </div>
            </div>

            {/* Satış Tipi */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Satış Tipi</label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={formData.saleType === "tekli" ? "default" : "outline"}
                  className={cn("h-12", formData.saleType === "tekli" && "bg-meradan-green hover:bg-meradan-green/90")}
                  onClick={() => setFormData((prev) => ({ ...prev, saleType: "tekli" }))}
                >
                  Tekli Satış
                </Button>
                <Button
                  type="button"
                  variant={formData.saleType === "toplu" ? "default" : "outline"}
                  className={cn("h-12", formData.saleType === "toplu" && "bg-meradan-green hover:bg-meradan-green/90")}
                  onClick={() => setFormData((prev) => ({ ...prev, saleType: "toplu" }))}
                >
                  Toplu Satış
                </Button>
              </div>
            </div>

            {/* Adet - Sadece Toplu Satışta */}
            {formData.saleType === "toplu" && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Adet</label>
                <Input
                  type="number"
                  placeholder="Kaç adet?"
                  value={formData.quantity}
                  onChange={(e) => setFormData((prev) => ({ ...prev, quantity: e.target.value }))}
                  className="h-12 text-lg"
                />
              </div>
            )}

            {/* Irk */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Irk <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 gap-2">
                {KUCUKBAS_BREEDS.map((breed) => (
                  <button
                    key={breed.value}
                    type="button"
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg border-2 transition-all",
                      formData.breed === breed.value
                        ? "border-meradan-green bg-meradan-green/5"
                        : "border-border hover:border-meradan-green/50",
                    )}
                    onClick={() => setFormData((prev) => ({ ...prev, breed: breed.value }))}
                  >
                    <div className="w-12 h-12 rounded-full overflow-hidden relative flex-shrink-0">
                      <Image src={breed.image || "/placeholder.svg"} alt={breed.label} fill className="object-cover" />
                    </div>
                    <span className="text-sm font-medium flex-1 text-left">{breed.label}</span>
                    {formData.breed === breed.value && <Check className="h-5 w-5 text-meradan-green" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Durum */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Durum (Opsiyonel)</label>
              <div className="flex flex-wrap gap-2">
                {KUCUKBAS_STATUS.map((status) => (
                  <button
                    key={status}
                    type="button"
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium transition-all",
                      formData.status.includes(status)
                        ? "bg-meradan-orange text-white"
                        : "bg-muted text-foreground hover:bg-muted/80",
                    )}
                    onClick={() => toggleStatus(status)}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* İşletme Numarası (Opsiyonel) */}
            {isLoggedIn && (
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">İşletme Numarası (Opsiyonel)</label>

                {enterpriseNumbers.length > 0 && (
                  <div className="flex gap-2 mb-2">
                    <Button
                      type="button"
                      size="sm"
                      variant={enterpriseMode === "saved" ? "default" : "outline"}
                      className={cn(enterpriseMode === "saved" && "bg-meradan-green hover:bg-meradan-green/90")}
                      onClick={() => { setEnterpriseMode("saved"); setEnterpriseError("") }}
                    >
                      Kayıtlı
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={enterpriseMode === "manual" ? "default" : "outline"}
                      className={cn(enterpriseMode === "manual" && "bg-meradan-green hover:bg-meradan-green/90")}
                      onClick={() => { setEnterpriseMode("manual"); setEnterpriseError("") }}
                    >
                      Manuel Gir
                    </Button>
                  </div>
                )}

                {(enterpriseMode === "saved" && enterpriseNumbers.length > 0) ? (
                  <div className="space-y-2">
                    {enterpriseNumbers.map((en) => (
                      <button
                        key={en.id}
                        type="button"
                        className={cn(
                          "flex items-center gap-3 w-full p-3 rounded-lg border-2 transition-all text-left",
                          formData.enterpriseNo === en.enterpriseNo
                            ? "border-meradan-green bg-meradan-green/5"
                            : "border-border hover:border-meradan-green/50",
                        )}
                        onClick={() => setFormData((prev) => ({
                          ...prev,
                          enterpriseNo: prev.enterpriseNo === en.enterpriseNo ? "" : en.enterpriseNo,
                          enterpriseLabel: prev.enterpriseNo === en.enterpriseNo ? "" : (en.label || ""),
                        }))}
                      >
                        <Building2 className="h-5 w-5 text-meradan-green shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-mono text-sm font-medium truncate">
                            {formatEnterpriseDisplay(en.enterpriseNo, en.label)}
                          </p>
                        </div>
                        {formData.enterpriseNo === en.enterpriseNo && (
                          <Check className="h-5 w-5 text-meradan-green shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Input
                      placeholder="TR0612345"
                      value={formData.enterpriseNo}
                      onChange={(e) => {
                        const val = e.target.value.toUpperCase()
                        setFormData((prev) => ({ ...prev, enterpriseNo: val }))
                        setEnterpriseError("")
                        if (val && !validateEnterpriseNo(val).valid) {
                          setEnterpriseError(validateEnterpriseNo(val).error || "")
                        }
                      }}
                      className="font-mono"
                      maxLength={14}
                    />
                    {enterpriseError && (
                      <p className="text-xs text-destructive">{enterpriseError}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {"Format: TR + 2 hane il kodu + 1-10 rakam"}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Fiyat ve Fotoğraf */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-foreground">Fiyat ve Medya</h2>

            {uploadError && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive">{uploadError}</p>
              </div>
            )}

            {/* Seçilen Konum Özeti */}
            {getLocationDisplay() && (
              <div className="p-3 bg-meradan-green/10 rounded-lg">
                <p className="text-sm text-meradan-green font-medium">Konum: {getLocationDisplay()}</p>
              </div>
            )}

            {/* Fiyat */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Fiyat <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">₺</span>
                <Input
                  type="number"
                  placeholder="0"
                  value={formData.price}
                  onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                  className="h-14 pl-10 text-2xl font-bold"
                />
              </div>
              {formData.price && (
                <p className="text-xs text-muted-foreground">
                  Alıcı komisyonu dahil toplam: ₺{(Number(formData.price) * 1.03).toLocaleString("tr-TR")}
                </p>
              )}
            </div>

            {/* Fotoğraf Yükleme */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Fotoğraflar ({formData.photos.length}/5) <span className="text-red-500">*</span>
              </label>

              {formData.photos.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {formData.photos.map((photo, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                      <Image
                        src={photo || "/placeholder.svg"}
                        alt={`Fotoğraf ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(index)}
                        className="absolute top-1 right-1 p-1 bg-black/50 rounded-full"
                      >
                        <X className="h-4 w-4 text-white" />
                      </button>
                      {index === 0 && (
                        <span className="absolute bottom-1 left-1 px-2 py-0.5 bg-meradan-green text-white text-xs rounded">
                          Kapak
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {formData.photos.length < 5 && (
                <>
                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
                    multiple
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                  <button
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                    disabled={isUploadingPhoto}
                    className="w-full border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center gap-3 hover:border-meradan-green/50 hover:bg-muted/50 transition-all disabled:opacity-50"
                  >
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                      {isUploadingPhoto ? (
                        <Loader2 className="h-8 w-8 text-meradan-green animate-spin" />
                      ) : (
                        <Camera className="h-8 w-8 text-muted-foreground" />
                      )}
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-foreground">
                        {isUploadingPhoto ? "Yükleniyor..." : "Fotoğraf Ekle"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        JPG, PNG veya WebP - Maks. 5MB
                      </p>
                    </div>
                  </button>
                </>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Video (Opsiyonel)</label>

              {formData.video ? (
                <div className="relative rounded-xl overflow-hidden bg-black">
                  <video src={formData.video} className="w-full aspect-video object-contain" controls />
                  <button
                    type="button"
                    onClick={removeVideo}
                    className="absolute top-2 right-2 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                  >
                    <X className="h-5 w-5 text-white" />
                  </button>
                  <span className="absolute bottom-2 left-2 px-2 py-1 bg-meradan-orange text-white text-xs rounded flex items-center gap-1">
                    <Video className="h-3 w-3" />
                    Video
                  </span>
                </div>
              ) : (
                <>
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime"
                    className="hidden"
                    onChange={handleVideoUpload}
                  />
                  <button
                    type="button"
                    onClick={() => videoInputRef.current?.click()}
                    disabled={isUploadingVideo}
                    className="w-full border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center gap-3 hover:border-meradan-orange/50 hover:bg-muted/50 transition-all disabled:opacity-50"
                  >
                    <div className="w-16 h-16 rounded-full bg-meradan-orange/10 flex items-center justify-center">
                      {isUploadingVideo ? (
                        <Loader2 className="h-8 w-8 text-meradan-orange animate-spin" />
                      ) : (
                        <Video className="h-8 w-8 text-meradan-orange" />
                      )}
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-foreground">
                        {isUploadingVideo ? "Video Yükleniyor..." : "Video Ekle"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        MP4 veya WebM - Maks. 50MB
                      </p>
                    </div>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      {step > 1 && (
        <div className="p-4 border-t border-border bg-card safe-area-inset-bottom">
          {step === 2 && (
            <Button
              onClick={handleNext}
              disabled={!isStep2Valid()}
              className="w-full h-14 text-lg font-semibold bg-meradan-green hover:bg-meradan-green/90 disabled:opacity-50"
            >
              Devam Et
            </Button>
          )}
          {step === 3 && (
            <Button
              onClick={handleSubmit}
              disabled={!isStep3Valid()}
              className="w-full h-14 text-lg font-semibold bg-meradan-orange hover:bg-meradan-orange/90 disabled:opacity-50"
            >
              İlanı Yayınla
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
