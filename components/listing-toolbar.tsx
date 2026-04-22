"use client"

import { useState } from "react"
import { SlidersHorizontal, ArrowUpDown, LayoutGrid, List, Check } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

export type SortOption = "newest" | "price-low" | "price-high" | "closest"
export type ViewMode = "grid" | "list"

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: "En Yeni", value: "newest" },
  { label: "Fiyat (Düşükten Yükseğe)", value: "price-low" },
  { label: "Fiyat (Yüksekten Düşüğe)", value: "price-high" },
  { label: "En Yakın", value: "closest" },
]

interface ListingToolbarProps {
  onFilterClick: () => void
  activeFilterCount?: number
  sortOption: SortOption
  onSortChange: (option: SortOption) => void
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
}

function ToolbarButton({
  children,
  onClick,
  active = false,
}: {
  children: React.ReactNode
  onClick?: () => void
  active?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-12 flex-1 items-center justify-center gap-2 rounded-full border border-border bg-card text-[15px] font-medium text-foreground shadow-sm transition-all hover:border-meradan-green/60 hover:text-meradan-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-meradan-green focus-visible:ring-offset-2",
        active && "border-meradan-green text-meradan-green ring-1 ring-meradan-green/40",
      )}
    >
      {children}
    </button>
  )
}

export function ListingToolbar({
  onFilterClick,
  activeFilterCount = 0,
  sortOption,
  onSortChange,
  viewMode,
  onViewModeChange,
}: ListingToolbarProps) {
  const [sortOpen, setSortOpen] = useState(false)
  const [viewOpen, setViewOpen] = useState(false)

  return (
    <div className="flex items-center gap-4">
      {/* Filtreler */}
      <ToolbarButton onClick={onFilterClick} active={activeFilterCount > 0}>
        <SlidersHorizontal className="h-[18px] w-[18px]" strokeWidth={2} />
        <span>Filtreler</span>
        {activeFilterCount > 0 && (
          <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-meradan-green px-1.5 text-xs font-semibold text-white">
            {activeFilterCount}
          </span>
        )}
      </ToolbarButton>

      {/* Sırala */}
      <Sheet open={sortOpen} onOpenChange={setSortOpen}>
        <SheetTrigger asChild>
          <ToolbarButton>
            <ArrowUpDown className="h-[18px] w-[18px]" strokeWidth={2} />
            <span>Sırala</span>
          </ToolbarButton>
        </SheetTrigger>
        <SheetContent side="bottom" className="rounded-t-2xl">
          <SheetHeader>
            <SheetTitle>Sıralama Seçin</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-2 py-4">
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onSortChange(option.value)
                  setSortOpen(false)
                }}
                className={cn(
                  "flex items-center justify-between rounded-lg px-4 py-3 text-left transition-colors",
                  sortOption === option.value
                    ? "bg-meradan-green text-white"
                    : "bg-muted text-foreground hover:bg-muted/80",
                )}
              >
                <span className="font-medium">{option.label}</span>
                {sortOption === option.value && <Check className="h-5 w-5" />}
              </button>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      {/* Görüntü */}
      <Sheet open={viewOpen} onOpenChange={setViewOpen}>
        <SheetTrigger asChild>
          <ToolbarButton>
            <LayoutGrid className="h-[18px] w-[18px]" strokeWidth={2} />
            <span>Görüntü</span>
          </ToolbarButton>
        </SheetTrigger>
        <SheetContent side="bottom" className="rounded-t-2xl">
          <SheetHeader>
            <SheetTitle>Görünümü Seçin</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-2 py-4">
            <button
              type="button"
              onClick={() => {
                onViewModeChange("grid")
                setViewOpen(false)
              }}
              className={cn(
                "flex items-center justify-between rounded-lg px-4 py-3 text-left transition-colors",
                viewMode === "grid" ? "bg-meradan-green text-white" : "bg-muted text-foreground hover:bg-muted/80",
              )}
            >
              <span className="flex items-center gap-3 font-medium">
                <LayoutGrid className="h-5 w-5" />
                Izgara Görünümü
              </span>
              {viewMode === "grid" && <Check className="h-5 w-5" />}
            </button>
            <button
              type="button"
              onClick={() => {
                onViewModeChange("list")
                setViewOpen(false)
              }}
              className={cn(
                "flex items-center justify-between rounded-lg px-4 py-3 text-left transition-colors",
                viewMode === "list" ? "bg-meradan-green text-white" : "bg-muted text-foreground hover:bg-muted/80",
              )}
            >
              <span className="flex items-center gap-3 font-medium">
                <List className="h-5 w-5" />
                Liste Görünümü
              </span>
              {viewMode === "list" && <Check className="h-5 w-5" />}
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
