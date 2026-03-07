"use client"

import { useState } from "react"
import Image from "next/image"
import { SlidersHorizontal, ArrowUpDown, Check, LayoutGrid, List, Rows3 } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

export type SortOption = "newest" | "price-low" | "price-high" | "closest"
export type ViewMode = "grid" | "list" | "compact"

const SORT_OPTIONS = [
  { label: "En Yeni", value: "newest" as SortOption },
  { label: "Fiyat (Düşükten Yükseğe)", value: "price-low" as SortOption },
  { label: "Fiyat (Yüksekten Düşüğe)", value: "price-high" as SortOption },
  { label: "En Yakın", value: "closest" as SortOption },
]

const VIEW_OPTIONS = [
  { label: "Kart Görünüm", value: "grid" as ViewMode, icon: LayoutGrid, description: "Büyük kartlar halinde" },
  { label: "Geniş Liste", value: "list" as ViewMode, icon: List, description: "Detaylı yatay liste" },
  { label: "Kısa Liste", value: "compact" as ViewMode, icon: Rows3, description: "Sıkışık satır görünümü" },
]

interface CategoryFilterBarProps {
  selectedCategory: "buyukbas" | "kucukbas"
  onCategorySelect: (category: "buyukbas" | "kucukbas") => void
  onFilterClick: () => void
  sortOption: SortOption
  onSortChange: (option: SortOption) => void
  activeFilterCount?: number
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
}

export function CategoryFilterBar({
  selectedCategory,
  onCategorySelect,
  onFilterClick,
  sortOption,
  onSortChange,
  activeFilterCount = 0,
  viewMode,
  onViewModeChange,
}: CategoryFilterBarProps) {
  const [sortOpen, setSortOpen] = useState(false)
  const [viewOpen, setViewOpen] = useState(false)

  const buttonBase = "flex h-12 items-center justify-center rounded-xl border-2 transition-all bg-card font-medium"
  const actionButtonClass = "flex-1 gap-2 border-muted hover:border-meradan-green/50"

  const CurrentViewIcon = VIEW_OPTIONS.find((v) => v.value === viewMode)?.icon || LayoutGrid

  return (
    <div className="flex items-center gap-2 px-4 py-3">
      {/* Büyükbaş */}
      <button
        onClick={() => onCategorySelect("buyukbas")}
        className={cn(
          buttonBase,
          "w-12 p-1.5",
          selectedCategory === "buyukbas"
            ? "border-meradan-orange shadow-md"
            : "border-muted hover:border-meradan-green/50",
        )}
        aria-label="Büyükbaş hayvanlar"
      >
        <Image src="/images/buyukbas.png" alt="Büyükbaş" width={36} height={36} className="object-contain" />
      </button>

      {/* Küçükbaş */}
      <button
        onClick={() => onCategorySelect("kucukbas")}
        className={cn(
          buttonBase,
          "w-12 p-1.5",
          selectedCategory === "kucukbas"
            ? "border-meradan-orange shadow-md"
            : "border-muted hover:border-meradan-green/50",
        )}
        aria-label="Küçükbaş hayvanlar"
      >
        <Image src="/images/kucukbas.png" alt="Küçükbaş" width={36} height={36} className="object-contain" />
      </button>

      {/* Filtreler Butonu */}
      <button
        onClick={onFilterClick}
        className={cn(
          buttonBase,
          actionButtonClass,
          activeFilterCount > 0 && "border-meradan-green text-meradan-green",
        )}
      >
        <SlidersHorizontal className="h-4 w-4" />
        <span className="text-sm">Filtreler</span>
        {activeFilterCount > 0 && (
          <span className="bg-meradan-orange text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Sırala Butonu */}
      <Sheet open={sortOpen} onOpenChange={setSortOpen}>
        <SheetTrigger asChild>
          <button className={cn(buttonBase, actionButtonClass)}>
            <ArrowUpDown className="h-4 w-4" />
            <span className="text-sm">Sırala</span>
          </button>
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

      {/* Görüntü Butonu */}
      <Sheet open={viewOpen} onOpenChange={setViewOpen}>
        <SheetTrigger asChild>
          <button className={cn(buttonBase, actionButtonClass)}>
            <CurrentViewIcon className="h-4 w-4" />
            <span className="text-sm">Görüntü</span>
          </button>
        </SheetTrigger>
        <SheetContent side="bottom" className="rounded-t-2xl">
          <SheetHeader>
            <SheetTitle>Görüntüleme Seçin</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-2 py-4">
            {VIEW_OPTIONS.map((option) => {
              const Icon = option.icon
              return (
                <button
                  key={option.value}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left",
                    viewMode === option.value ? "bg-meradan-green text-white" : "bg-muted hover:bg-muted/80",
                  )}
                  onClick={() => {
                    onViewModeChange(option.value)
                    setViewOpen(false)
                  }}
                >
                  <Icon className="h-5 w-5" />
                  <div className="flex flex-col">
                    <span className="font-medium">{option.label}</span>
                    <span
                      className={cn("text-xs", viewMode === option.value ? "text-white/70" : "text-muted-foreground")}
                    >
                      {option.description}
                    </span>
                  </div>
                  {viewMode === option.value && <Check className="h-5 w-5 ml-auto" />}
                </button>
              )
            })}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
