"use client"

import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { cn } from "@/lib/utils"
import { LocationSelector } from "@/components/location-selector"
import { getCityByValue } from "@/lib/turkey-locations"
import type { FilterValues } from "@/components/filter-bar"
import { X } from "lucide-react"

const BUYUKBAS_BREEDS = [
  { value: "all", label: "Tümü" },
  { value: "simental", label: "Simental" },
  { value: "holstein", label: "Hoştayn" },
  { value: "montofon", label: "Montofon" },
  { value: "angus", label: "Angus" },
  { value: "jersey", label: "Jersey" },
  { value: "yerli", label: "Yerli" },
]

const KUCUKBAS_BREEDS = [
  { value: "all", label: "Tümü" },
  { value: "merinos", label: "Merinos" },
  { value: "kivircik", label: "Kıvırcık" },
  { value: "akkaraman", label: "Akkaraman" },
  { value: "kilkecisi", label: "Kıl Keçisi" },
]

const AGE_OPTIONS = [
  { value: "all", label: "Tümü" },
  { value: "0-6", label: "0-6 Ay" },
  { value: "6-12", label: "6-12 Ay" },
  { value: "1-2", label: "1-2 Yaş" },
  { value: "2+", label: "2+ Yaş" },
]

interface SearchFilterDrawerProps {
  filters: FilterValues
  category: "buyukbas" | "kucukbas"
  onFilterChange: (key: keyof FilterValues, value: string) => void
  onCategoryChange: (category: "buyukbas" | "kucukbas") => void
  onClearFilters: () => void
  onApply: () => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function SearchFilterDrawer({
  filters,
  category,
  onFilterChange,
  onCategoryChange,
  onClearFilters,
  onApply,
  open: controlledOpen,
  onOpenChange,
}: SearchFilterDrawerProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const [priceRange, setPriceRange] = useState([0, 100000])
  const [selectedCity, setSelectedCity] = useState("")
  const [selectedDistrict, setSelectedDistrict] = useState("")
  const [selectedBreed, setSelectedBreed] = useState(filters.breed)
  const [selectedAge, setSelectedAge] = useState("all")

  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setIsOpen = onOpenChange || setInternalOpen

  const breeds = category === "buyukbas" ? BUYUKBAS_BREEDS : KUCUKBAS_BREEDS

  useEffect(() => {
    setSelectedBreed(filters.breed)
  }, [filters.breed])

  const handleApply = () => {
    const locationValue = selectedCity
      ? selectedDistrict && selectedDistrict !== "all"
        ? `${selectedCity}:${selectedDistrict}`
        : selectedCity
      : "all"
    onFilterChange("city", locationValue)
    onFilterChange("breed", selectedBreed)
    onApply()
    setIsOpen(false)
  }

  const handleClear = () => {
    setSelectedCity("")
    setSelectedDistrict("")
    setSelectedBreed("all")
    setSelectedAge("all")
    setPriceRange([0, 100000])
    onClearFilters()
  }

  const getLocationDisplay = () => {
    if (!selectedCity) return "Tüm Türkiye"
    const city = getCityByValue(selectedCity)
    if (!city) return "Tüm Türkiye"
    if (selectedDistrict && selectedDistrict !== "all") {
      const district = city.districts.find((d) => d.value === selectedDistrict)
      return district ? `${city.label}, ${district.label}` : city.label
    }
    return `${city.label}, Tüm İlçeler`
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side="right" className="w-[85vw] sm:w-[400px] h-full flex flex-col p-0" hideClose>
        {/* Header */}
        <SheetHeader className="px-4 py-3 border-b border-border">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-lg font-semibold">Filtreler</SheetTitle>
            <div className="flex items-center gap-3">
              <button onClick={handleClear} className="text-sm text-meradan-orange font-medium">
                Temizle
              </button>
              <button onClick={() => setIsOpen(false)} className="p-1 rounded-full hover:bg-muted transition-colors">
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
          </div>
        </SheetHeader>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {/* Kategori Tabs */}
          <div className="mb-6">
            <label className="text-sm font-medium text-foreground mb-2 block">Kategori</label>
            <Tabs
              value={category}
              onValueChange={(v) => onCategoryChange(v as "buyukbas" | "kucukbas")}
              className="w-full"
            >
              <TabsList className="w-full grid grid-cols-2 h-12">
                <TabsTrigger value="buyukbas" className="text-sm">
                  Büyükbaş
                </TabsTrigger>
                <TabsTrigger value="kucukbas" className="text-sm">
                  Küçükbaş
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="mb-6">
            <label className="text-sm font-medium text-foreground mb-2 block">Konum</label>
            <LocationSelector
              selectedCity={selectedCity}
              selectedDistrict={selectedDistrict}
              onCityChange={setSelectedCity}
              onDistrictChange={setSelectedDistrict}
            />
            {selectedCity && <p className="text-xs text-muted-foreground mt-2">Seçilen: {getLocationDisplay()}</p>}
          </div>

          {/* Accordion Filters */}
          <Accordion type="multiple" defaultValue={["breed", "price"]} className="space-y-2">
            {/* Irk */}
            <AccordionItem value="breed" className="border rounded-lg px-4">
              <AccordionTrigger className="text-sm font-medium py-3 hover:no-underline">Irk</AccordionTrigger>
              <AccordionContent className="pb-4">
                <div className="flex flex-wrap gap-2">
                  {breeds.map((breed) => (
                    <button
                      key={breed.value}
                      onClick={() => setSelectedBreed(breed.value)}
                      className={cn(
                        "px-3 py-2 rounded-full text-sm font-medium transition-all",
                        selectedBreed === breed.value
                          ? "bg-meradan-green text-white"
                          : "bg-muted text-foreground hover:bg-muted/80",
                      )}
                    >
                      {breed.label}
                    </button>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Yaş */}
            <AccordionItem value="age" className="border rounded-lg px-4">
              <AccordionTrigger className="text-sm font-medium py-3 hover:no-underline">Yaş</AccordionTrigger>
              <AccordionContent className="pb-4">
                <div className="flex flex-wrap gap-2">
                  {AGE_OPTIONS.map((age) => (
                    <button
                      key={age.value}
                      onClick={() => setSelectedAge(age.value)}
                      className={cn(
                        "px-3 py-2 rounded-full text-sm font-medium transition-all",
                        selectedAge === age.value
                          ? "bg-meradan-green text-white"
                          : "bg-muted text-foreground hover:bg-muted/80",
                      )}
                    >
                      {age.label}
                    </button>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Fiyat Aralığı */}
            <AccordionItem value="price" className="border rounded-lg px-4">
              <AccordionTrigger className="text-sm font-medium py-3 hover:no-underline">Fiyat Aralığı</AccordionTrigger>
              <AccordionContent className="pb-4">
                <div className="space-y-4">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>₺{priceRange[0].toLocaleString("tr-TR")}</span>
                    <span>₺{priceRange[1].toLocaleString("tr-TR")}</span>
                  </div>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={200000}
                    step={5000}
                    className="[&_[role=slider]]:bg-meradan-green [&_[role=slider]]:border-meradan-green [&_.bg-primary]:bg-meradan-green"
                  />
                  <div className="grid grid-cols-4 gap-2">
                    {[25000, 50000, 100000, 200000].map((price) => (
                      <button
                        key={price}
                        onClick={() => setPriceRange([0, price])}
                        className="px-2 py-1.5 text-xs font-medium bg-muted rounded hover:bg-muted/80 transition-colors"
                      >
                        {price >= 1000 ? `${price / 1000}k` : price}₺
                      </button>
                    ))}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Footer - Sticky Button */}
        <div className="p-4 border-t border-border bg-card">
          <Button
            onClick={handleApply}
            className="w-full h-14 text-lg font-semibold bg-meradan-orange hover:bg-meradan-orange/90"
          >
            Filtrele
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
