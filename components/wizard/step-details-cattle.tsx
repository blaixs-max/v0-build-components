"use client"

import Image from "next/image"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { LocationSelector } from "@/components/location-selector"
import type { ListingFormData } from "./wizard-types"
import { BUYUKBAS_BREEDS, AGE_OPTIONS, BUYUKBAS_STATUS } from "./wizard-types"

interface StepDetailsCattleProps {
  formData: ListingFormData
  onUpdate: (updates: Partial<ListingFormData>) => void
  onToggleStatus: (status: string) => void
}

export function StepDetailsCattle({ formData, onUpdate, onToggleStatus }: StepDetailsCattleProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-foreground">Büyükbaş Bilgileri</h2>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Konum <span className="text-red-500">*</span>
        </label>
        <LocationSelector
          selectedCity={formData.city}
          selectedDistrict={formData.district}
          onCityChange={(city) => onUpdate({ city, district: "" })}
          onDistrictChange={(district) => onUpdate({ district })}
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
            onClick={() => onUpdate({ gender: "disi" })}
          >
            Dişi
          </Button>
          <Button
            type="button"
            variant={formData.gender === "erkek" ? "default" : "outline"}
            className={cn("h-12", formData.gender === "erkek" && "bg-meradan-green hover:bg-meradan-green/90")}
            onClick={() => onUpdate({ gender: "erkek" })}
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
              onClick={() => onUpdate({ breed: breed.value })}
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
              onClick={() => onUpdate({ age })}
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
            onChange={(e) => onUpdate({ weight: e.target.value })}
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
              onClick={() => onToggleStatus(status)}
            >
              {status}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
