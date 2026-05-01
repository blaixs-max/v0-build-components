"use client"

import type { RefObject } from "react"
import Image from "next/image"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"

interface HeroSectionProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedCategory: "buyukbas" | "kucukbas"
  onCategorySelect: (category: "buyukbas" | "kucukbas") => void
  inputRef?: RefObject<HTMLInputElement | null>
}

export function HeroSection({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategorySelect,
  inputRef,
}: HeroSectionProps) {
  return (
    <section className="relative">
      {/* Arkaplan Hero Resmi */}
      <div className="relative h-[420px] w-full overflow-hidden md:h-[460px]">
        <Image
          src="/images/hero-pasture.jpg"
          alt="Türkiye'de geniş yeşil meralar ve hayvanlar"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Hafif karartma overlay */}
        <div className="absolute inset-0 bg-black/15" />

        {/* İçerik */}
        <div className="relative z-10 mx-auto flex h-full max-w-4xl flex-col items-center justify-center px-6 text-center">
          <h1 className="text-balance text-4xl font-bold leading-tight text-white drop-shadow-md md:text-5xl lg:text-6xl">
            Türkiye&apos;nin En Büyük Hayvan Pazarı
          </h1>

          {/* Arama Çubuğu */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="mt-8 flex w-full max-w-2xl items-center gap-2 rounded-full bg-card p-1.5 shadow-xl"
          >
            <div className="relative flex-1">
              <Search
                className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground"
                strokeWidth={2}
              />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Irk, hayvan türü, konum ara..."
                className="h-11 w-full rounded-full border-0 bg-transparent pl-12 pr-4 text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>
            <button
              type="submit"
              aria-label="Ara"
              className="flex h-11 w-16 flex-shrink-0 items-center justify-center rounded-full bg-meradan-green text-white transition-colors hover:bg-meradan-green/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-meradan-green focus-visible:ring-offset-2"
            >
              <Search className="h-5 w-5" strokeWidth={2.4} />
            </button>
          </form>
        </div>
      </div>

      {/* Kategori Yuvarlakları - Hero'nun altına taşıyor */}
      <div className="relative z-20 -mt-16 flex justify-center gap-6 md:-mt-20 md:gap-8">
        <CategoryCircle
          label="Büyükbaş"
          selected={selectedCategory === "buyukbas"}
          onClick={() => onCategorySelect("buyukbas")}
          iconSrc="/images/icon-buyukbas.png"
        />
        <CategoryCircle
          label="Küçükbaş"
          selected={selectedCategory === "kucukbas"}
          onClick={() => onCategorySelect("kucukbas")}
          iconSrc="/images/icon-kucukbas.png"
        />
      </div>
    </section>
  )
}

function CategoryCircle({
  label,
  selected,
  onClick,
  iconSrc,
}: {
  label: string
  selected: boolean
  onClick: () => void
  iconSrc: string
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={selected}
      aria-label={label}
      className={cn(
        "group flex h-32 w-32 flex-col items-center justify-center rounded-full bg-card transition-all md:h-36 md:w-36",
        "shadow-lg hover:shadow-xl",
        selected ? "border-[3px] border-meradan-green ring-4 ring-meradan-green/20" : "border-2 border-border",
      )}
    >
      <div className="relative h-14 w-14 md:h-16 md:w-16">
        <Image
          src={iconSrc}
          alt=""
          fill
          sizes="64px"
          className="object-contain"
        />
      </div>
      <span className="mt-1 text-[15px] font-semibold text-foreground md:text-base">{label}</span>
    </button>
  )
}
