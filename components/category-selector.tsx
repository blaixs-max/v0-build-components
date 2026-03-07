"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"

interface CategorySelectorProps {
  selected: "buyukbas" | "kucukbas"
  onSelect: (category: "buyukbas" | "kucukbas") => void
}

export function CategorySelector({ selected, onSelect }: CategorySelectorProps) {
  return (
    <div className="flex items-center gap-4 px-4 py-3">
      {/* Büyükbaş */}
      <button
        onClick={() => onSelect("buyukbas")}
        className={cn(
          "flex h-20 w-20 items-center justify-center rounded-xl border-2 transition-all overflow-hidden",
          selected === "buyukbas" ? "border-meradan-orange bg-card shadow-md" : "border-muted bg-card",
        )}
        aria-label="Büyükbaş hayvanlar"
      >
        <Image src="/images/buyukbas.png" alt="Büyükbaş" width={55} height={55} className="object-contain" />
      </button>

      {/* Küçükbaş */}
      <button
        onClick={() => onSelect("kucukbas")}
        className={cn(
          "flex h-20 w-20 items-center justify-center rounded-xl border-2 transition-all overflow-hidden",
          selected === "kucukbas" ? "border-meradan-orange bg-card shadow-md" : "border-muted bg-card",
        )}
        aria-label="Küçükbaş hayvanlar"
      >
        <Image src="/images/kucukbas.png" alt="Küçükbaş" width={55} height={55} className="object-contain" />
      </button>
    </div>
  )
}
