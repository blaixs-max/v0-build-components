"use client"

import Image from "next/image"
import { Camera, X, Video } from "lucide-react"
import { Input } from "@/components/ui/input"
import type { ListingFormData } from "./wizard-types"
import { getCityByValue } from "@/lib/turkey-locations"

interface StepPriceMediaProps {
  formData: ListingFormData
  onUpdate: (updates: Partial<ListingFormData>) => void
  onPhotoUpload: () => void
  onRemovePhoto: (index: number) => void
  onVideoUpload: () => void
  onRemoveVideo: () => void
}

function getLocationDisplay(formData: ListingFormData): string | null {
  if (!formData.city) return null
  const city = getCityByValue(formData.city)
  if (!city) return null
  if (formData.district && formData.district !== "all") {
    const district = city.districts.find((d) => d.value === formData.district)
    return district ? `${city.label}, ${district.label}` : city.label
  }
  return city.label
}

export function StepPriceMedia({
  formData,
  onUpdate,
  onPhotoUpload,
  onRemovePhoto,
  onVideoUpload,
  onRemoveVideo,
}: StepPriceMediaProps) {
  const locationDisplay = getLocationDisplay(formData)

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-foreground">Fiyat ve Medya</h2>

      {/* Seçilen Konum Özeti */}
      {locationDisplay && (
        <div className="p-3 bg-meradan-green/10 rounded-lg">
          <p className="text-sm text-meradan-green font-medium">Konum: {locationDisplay}</p>
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
            onChange={(e) => onUpdate({ price: e.target.value })}
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
                  onClick={() => onRemovePhoto(index)}
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
          <button
            type="button"
            onClick={onPhotoUpload}
            className="w-full border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center gap-3 hover:border-meradan-green/50 hover:bg-muted/50 transition-all"
          >
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <Camera className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="font-medium text-foreground">Fotoğraf Ekle</p>
              <p className="text-xs text-muted-foreground mt-1">En az 1, en fazla 5 fotoğraf</p>
            </div>
          </button>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Video (Opsiyonel)</label>

        {formData.video ? (
          <div className="relative rounded-xl overflow-hidden bg-black">
            <video src={formData.video} className="w-full aspect-video object-contain" controls />
            <button
              type="button"
              onClick={onRemoveVideo}
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
          <button
            type="button"
            onClick={onVideoUpload}
            className="w-full border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center gap-3 hover:border-meradan-orange/50 hover:bg-muted/50 transition-all"
          >
            <div className="w-16 h-16 rounded-full bg-meradan-orange/10 flex items-center justify-center">
              <Video className="h-8 w-8 text-meradan-orange" />
            </div>
            <div className="text-center">
              <p className="font-medium text-foreground">Video Ekle</p>
              <p className="text-xs text-muted-foreground mt-1">Hayvanın videosunu ekleyin (Maks. 30 sn)</p>
            </div>
          </button>
        )}
      </div>
    </div>
  )
}
