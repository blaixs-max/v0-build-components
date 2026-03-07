"use client"

import Image from "next/image"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { Category } from "./wizard-types"

interface StepCategoryProps {
  selectedCategory: Category
  onSelect: (category: Category) => void
}

export function StepCategory({ selectedCategory, onSelect }: StepCategoryProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold text-foreground">Hayvan Türü Seçin</h2>
        <p className="text-sm text-muted-foreground mt-1">Hangi türde hayvan satmak istiyorsunuz?</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card
          className={cn(
            "p-6 cursor-pointer transition-all hover:shadow-lg border-2",
            selectedCategory === "buyukbas"
              ? "border-meradan-green bg-meradan-green/5"
              : "border-transparent hover:border-meradan-green/50",
          )}
          onClick={() => onSelect("buyukbas")}
        >
          <div className="flex flex-col items-center gap-3">
            <div className="w-20 h-20 relative">
              <Image src="/images/buyukbas.png" alt="Büyükbaş" fill className="object-contain" />
            </div>
            <span className="font-semibold text-foreground">Büyükbaş</span>
            <span className="text-xs text-muted-foreground">İnek, Boğa, Dana</span>
          </div>
        </Card>

        <Card
          className={cn(
            "p-6 cursor-pointer transition-all hover:shadow-lg border-2",
            selectedCategory === "kucukbas"
              ? "border-meradan-green bg-meradan-green/5"
              : "border-transparent hover:border-meradan-green/50",
          )}
          onClick={() => onSelect("kucukbas")}
        >
          <div className="flex flex-col items-center gap-3">
            <div className="w-20 h-20 relative">
              <Image src="/images/kucukbas.png" alt="Küçükbaş" fill className="object-contain" />
            </div>
            <span className="font-semibold text-foreground">Küçükbaş</span>
            <span className="text-xs text-muted-foreground">Koyun, Keçi, Kuzu</span>
          </div>
        </Card>
      </div>
    </div>
  )
}
