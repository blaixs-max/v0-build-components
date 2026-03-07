"use client"

import Image from "next/image"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { LocationSelector } from "@/components/location-selector"
import type { ListingFormData } from "./wizard-types"
import { KUCUKBAS_BREEDS, KUCUKBAS_STATUS } from "./wizard-types"

interface StepDetailsSheepProps {
  formData: ListingFormData
  onUpdate: (updates: Partial<ListingFormData>) => void
  onToggleStatus: (status: string) => void
}

export function StepDetailsSheep({ formData, onUpdate, onToggleStatus }: StepDetailsSheepProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-foreground">Küçükbaş Bilgileri</h2>

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
            onClick={() => onUpdate({ animalType: "koyun" })}
          >
            Koyun
          </Button>
          <Button
            type="button"
            variant={formData.animalType === "keci" ? "default" : "outline"}
            className={cn("h-12", formData.animalType === "keci" && "bg-meradan-green hover:bg-meradan-green/90")}
            onClick={() => onUpdate({ animalType: "keci" })}
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
            onClick={() => onUpdate({ saleType: "tekli" })}
          >
            Tekli Satış
          </Button>
          <Button
            type="button"
            variant={formData.saleType === "toplu" ? "default" : "outline"}
            className={cn("h-12", formData.saleType === "toplu" && "bg-meradan-green hover:bg-meradan-green/90")}
            onClick={() => onUpdate({ saleType: "toplu" })}
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
            onChange={(e) => onUpdate({ quantity: e.target.value })}
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
              onClick={() => onUpdate({ breed: breed.value })}
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
