"use client"

import { useState } from "react"
import { SlidersHorizontal, ArrowUpDown, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

export type SortOption = "newest" | "price-low" | "price-high" | "closest"

const SORT_OPTIONS = [
  { label: "En Yeni", value: "newest" as SortOption },
  { label: "Fiyat (Düşükten Yükseğe)", value: "price-low" as SortOption },
  { label: "Fiyat (Yüksekten Düşüğe)", value: "price-high" as SortOption },
  { label: "En Yakın", value: "closest" as SortOption },
]

interface FilterSortBarProps {
  onFilterClick: () => void
  sortOption: SortOption
  onSortChange: (option: SortOption) => void
  activeFilterCount?: number
}

export function FilterSortBar({ onFilterClick, sortOption, onSortChange, activeFilterCount = 0 }: FilterSortBarProps) {
  const [sortOpen, setSortOpen] = useState(false)
  const _selectedSort = SORT_OPTIONS.find((opt) => opt.value === sortOption)

  return (
    <div className="flex items-center gap-3 px-4 py-3">
      {/* Filtreler Butonu */}
      <Button
        variant="outline"
        className="flex-1 h-12 justify-center gap-2 border-2 border-meradan-green text-meradan-green hover:bg-meradan-green hover:text-white transition-colors bg-transparent"
        onClick={onFilterClick}
      >
        <SlidersHorizontal className="h-5 w-5" />
        <span className="font-semibold">Filtreler</span>
        {activeFilterCount > 0 && (
          <span className="bg-meradan-orange text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {activeFilterCount}
          </span>
        )}
      </Button>

      {/* Sırala Butonu */}
      <Sheet open={sortOpen} onOpenChange={setSortOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            className="flex-1 h-12 justify-center gap-2 border-2 border-muted-foreground/30 hover:border-meradan-green hover:text-meradan-green transition-colors bg-transparent"
          >
            <ArrowUpDown className="h-5 w-5" />
            <span className="font-semibold">Sırala</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="rounded-t-2xl">
          <SheetHeader>
            <SheetTitle>Sıralama Seçin</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-2 py-4">
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.value}
                className={cn(
                  "flex items-center justify-between px-4 py-3 rounded-lg transition-colors text-left",
                  sortOption === option.value ? "bg-meradan-green text-white" : "bg-muted hover:bg-muted/80",
                )}
                onClick={() => {
                  onSortChange(option.value)
                  setSortOpen(false)
                }}
              >
                <span className="font-medium">{option.label}</span>
                {sortOption === option.value && <Check className="h-5 w-5" />}
              </button>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
