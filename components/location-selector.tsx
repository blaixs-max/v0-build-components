"use client"

import { useState, useEffect } from "react"
import { ChevronDown, MapPin, Check } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { TURKEY_CITIES, getDistrictsByCityValue, type City, type District } from "@/lib/turkey-locations"

interface LocationSelectorProps {
  selectedCity: string
  selectedDistrict: string
  onCityChange: (city: string) => void
  onDistrictChange: (district: string) => void
  className?: string
}

export function LocationSelector({
  selectedCity,
  selectedDistrict,
  onCityChange,
  onDistrictChange,
  className,
}: LocationSelectorProps) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<"city" | "district">("city")
  const [searchQuery, setSearchQuery] = useState("")
  const [tempCity, setTempCity] = useState(selectedCity)

  const districts = getDistrictsByCityValue(tempCity)

  const selectedCityData = TURKEY_CITIES.find((c) => c.value === selectedCity)
  const selectedDistrictData = districts.find((d) => d.value === selectedDistrict)

  const filteredCities = TURKEY_CITIES.filter((city) => city.label.toLowerCase().includes(searchQuery.toLowerCase()))

  const filteredDistricts = districts.filter((district) =>
    district.label.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleCitySelect = (city: City) => {
    setTempCity(city.value)
    onCityChange(city.value)
    onDistrictChange("") // İl değiştiğinde ilçe sıfırla
    setSearchQuery("")
    setStep("district")
  }

  const handleDistrictSelect = (district: District) => {
    onDistrictChange(district.value)
    setOpen(false)
    setStep("city")
    setSearchQuery("")
  }

  const handleAllDistrictsSelect = () => {
    onDistrictChange("all")
    setOpen(false)
    setStep("city")
    setSearchQuery("")
  }

  const displayText = () => {
    if (selectedCityData && selectedDistrictData) {
      return `${selectedCityData.label}, ${selectedDistrictData.label}`
    }
    if (selectedCityData && selectedDistrict === "all") {
      return `${selectedCityData.label}, Tüm İlçeler`
    }
    if (selectedCityData) {
      return selectedCityData.label
    }
    return "Konum Seçin"
  }

  useEffect(() => {
    if (!open) {
      setStep("city")
      setSearchQuery("")
    }
  }, [open])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          className={cn(
            "flex items-center gap-2 px-4 py-3 rounded-xl border border-border bg-card hover:border-meradan-green/50 transition-all w-full text-left",
            className,
          )}
        >
          <MapPin className="h-5 w-5 text-meradan-green flex-shrink-0" />
          <span className="flex-1 text-sm font-medium truncate">{displayText()}</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[80vh] rounded-t-2xl flex flex-col p-0">
        <SheetHeader className="px-4 py-3 border-b border-border">
          <div className="flex items-center justify-between">
            <SheetTitle>{step === "city" ? "İl Seçin" : "İlçe Seçin"}</SheetTitle>
            {step === "district" && (
              <button
                onClick={() => {
                  setStep("city")
                  setSearchQuery("")
                }}
                className="text-sm text-meradan-orange font-medium"
              >
                İl Değiştir
              </button>
            )}
          </div>
        </SheetHeader>

        {/* Arama */}
        <div className="px-4 py-3 border-b border-border">
          <Input
            placeholder={step === "city" ? "İl ara..." : "İlçe ara..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-11"
          />
        </div>

        {/* Liste */}
        <div className="flex-1 overflow-y-auto">
          {step === "city" ? (
            <div className="p-2">
              {filteredCities.map((city) => (
                <button
                  key={city.value}
                  onClick={() => handleCitySelect(city)}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors",
                    selectedCity === city.value ? "bg-meradan-green/10 text-meradan-green" : "hover:bg-muted",
                  )}
                >
                  <span className="font-medium">{city.label}</span>
                  {selectedCity === city.value && <Check className="h-5 w-5 text-meradan-green" />}
                </button>
              ))}
              {filteredCities.length === 0 && (
                <p className="text-center text-muted-foreground py-8">Sonuç bulunamadı</p>
              )}
            </div>
          ) : (
            <div className="p-2">
              {/* Tüm İlçeler Seçeneği */}
              <button
                onClick={handleAllDistrictsSelect}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors mb-1",
                  selectedDistrict === "all" ? "bg-meradan-green/10 text-meradan-green" : "hover:bg-muted",
                )}
              >
                <span className="font-medium">Tüm İlçeler</span>
                {selectedDistrict === "all" && <Check className="h-5 w-5 text-meradan-green" />}
              </button>

              <div className="h-px bg-border my-2" />

              {filteredDistricts.map((district) => (
                <button
                  key={district.value}
                  onClick={() => handleDistrictSelect(district)}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors",
                    selectedDistrict === district.value ? "bg-meradan-green/10 text-meradan-green" : "hover:bg-muted",
                  )}
                >
                  <span className="font-medium">{district.label}</span>
                  {selectedDistrict === district.value && <Check className="h-5 w-5 text-meradan-green" />}
                </button>
              ))}
              {filteredDistricts.length === 0 && searchQuery && (
                <p className="text-center text-muted-foreground py-8">Sonuç bulunamadı</p>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
