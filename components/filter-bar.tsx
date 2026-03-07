"use client"

import { useState } from "react"
import { ChevronDown, X } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export const PRICE_OPTIONS = [
  { label: "Tümü", value: "all", min: 0, max: Number.POSITIVE_INFINITY },
  { label: "0 - 25k ₺", value: "0-25k", min: 0, max: 25000 },
  { label: "25k - 50k ₺", value: "25k-50k", min: 25000, max: 50000 },
  { label: "50k - 100k ₺", value: "50k-100k", min: 50000, max: 100000 },
  { label: "100k+ ₺", value: "100k+", min: 100000, max: Number.POSITIVE_INFINITY },
]

export const BREED_OPTIONS = [
  { label: "Tümü", value: "all" },
  { label: "Simental", value: "simental" },
  { label: "Holstein", value: "holstein" },
  { label: "Montofon", value: "montofon" },
  { label: "Angus", value: "angus" },
  { label: "Jersey", value: "jersey" },
  { label: "Merinos", value: "merinos" },
  { label: "Akkaraman", value: "akkaraman" },
  { label: "Kıvırcık", value: "kivircik" },
]

export const PRICE_TYPE_OPTIONS = [
  { label: "Tümü", value: "all" },
  { label: "Sabit", value: "sabit" },
  { label: "Pazarlık", value: "pazarlik" },
]

export const CITY_OPTIONS = [
  { label: "Tümü", value: "all" },
  { label: "Ankara", value: "ankara" },
  { label: "Balıkesir", value: "balikesir" },
  { label: "Bursa", value: "bursa" },
  { label: "İzmir", value: "izmir" },
  { label: "Konya", value: "konya" },
  { label: "Manisa", value: "manisa" },
  { label: "Samsun", value: "samsun" },
]

export interface FilterValues {
  price: string
  breed: string
  priceType: string
  city: string
}

interface FilterBarProps {
  filters: FilterValues
  onFilterChange: (key: keyof FilterValues, value: string) => void
  onClearFilters: () => void
}

function FilterSheet({
  label,
  value,
  options,
  onSelect,
}: {
  label: string
  value: string
  options: { label: string; value: string }[]
  onSelect: (value: string) => void
}) {
  const [open, setOpen] = useState(false)
  const selectedOption = options.find((opt) => opt.value === value)
  const displayValue = selectedOption?.label || "Tümü"
  const isFiltered = value !== "all"

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          className={cn(
            "flex items-center gap-1 px-3 py-1 text-white border-r border-white/20 last:border-r-0 transition-colors",
            isFiltered && "bg-white/10 rounded",
          )}
        >
          <div className="flex flex-col items-start">
            <span className="text-xs text-white/80">{label}:</span>
            <span className="text-sm font-medium">{displayValue}</span>
          </div>
          <ChevronDown className="h-4 w-4 text-white/60" />
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className="rounded-t-2xl">
        <SheetHeader>
          <SheetTitle>{label} Seç</SheetTitle>
        </SheetHeader>
        <div className="grid grid-cols-2 gap-2 py-4">
          {options.map((option) => (
            <Button
              key={option.value}
              variant={value === option.value ? "default" : "outline"}
              className={cn("justify-start", value === option.value && "bg-meradan-green hover:bg-meradan-green/90")}
              onClick={() => {
                onSelect(option.value)
                setOpen(false)
              }}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}

export function FilterBar({ filters, onFilterChange, onClearFilters }: FilterBarProps) {
  const hasActiveFilters =
    filters.price !== "all" || filters.breed !== "all" || filters.priceType !== "all" || filters.city !== "all"

  return (
    <div className="overflow-x-auto scrollbar-hide">
      <div className="flex items-center bg-meradan-green mx-4 rounded-lg px-1 py-2 min-w-max">
        <FilterSheet
          label="Fiyat"
          value={filters.price}
          options={PRICE_OPTIONS}
          onSelect={(v) => onFilterChange("price", v)}
        />
        <FilterSheet
          label="Cins"
          value={filters.breed}
          options={BREED_OPTIONS}
          onSelect={(v) => onFilterChange("breed", v)}
        />
        <FilterSheet
          label="Fiyat Tipi"
          value={filters.priceType}
          options={PRICE_TYPE_OPTIONS}
          onSelect={(v) => onFilterChange("priceType", v)}
        />
        <FilterSheet
          label="İl"
          value={filters.city}
          options={CITY_OPTIONS}
          onSelect={(v) => onFilterChange("city", v)}
        />
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-1 px-3 py-1 text-white/80 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
            <span className="text-xs">Temizle</span>
          </button>
        )}
      </div>
    </div>
  )
}
