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
          icon={<CowIcon />}
        />
        <CategoryCircle
          label="Küçükbaş"
          selected={selectedCategory === "kucukbas"}
          onClick={() => onCategorySelect("kucukbas")}
          icon={<SheepIcon />}
        />
      </div>
    </section>
  )
}

function CategoryCircle({
  label,
  selected,
  onClick,
  icon,
}: {
  label: string
  selected: boolean
  onClick: () => void
  icon: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={selected}
      aria-label={label}
      className={cn(
        "group flex h-32 w-32 flex-col items-center justify-center rounded-full bg-card transition-all md:h-36 md:w-36",
        "border-2 shadow-lg hover:shadow-xl",
        selected ? "border-meradan-green ring-4 ring-meradan-green/15" : "border-meradan-green/70",
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center text-meradan-green md:h-14 md:w-14">
        {icon}
      </div>
      <span className="mt-1 text-[15px] font-semibold text-foreground md:text-base">{label}</span>
    </button>
  )
}

function CowIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="h-full w-full" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {/* Head */}
        <ellipse cx="20" cy="22" rx="8" ry="7" />
        {/* Ears */}
        <path d="M13 18 Q10 14 12 12 Q15 13 15 17" />
        <path d="M27 18 Q30 14 28 12 Q25 13 25 17" />
        {/* Horns */}
        <path d="M16 15 Q15 11 17 10" />
        <path d="M24 15 Q25 11 23 10" />
        {/* Nose/muzzle */}
        <ellipse cx="20" cy="25" rx="3" ry="2" />
        {/* Eyes */}
        <circle cx="17" cy="21" r="0.6" fill="currentColor" />
        <circle cx="23" cy="21" r="0.6" fill="currentColor" />
        {/* Body */}
        <path d="M28 26 Q34 22 44 24 Q52 25 54 32 L54 40 Q52 44 48 44 L44 44" />
        <path d="M28 30 Q30 34 32 38 L32 44" />
        {/* Legs */}
        <line x1="32" y1="44" x2="32" y2="52" />
        <line x1="38" y1="44" x2="38" y2="52" />
        <line x1="46" y1="44" x2="46" y2="52" />
        <line x1="52" y1="44" x2="52" y2="52" />
        {/* Tail */}
        <path d="M54 30 Q58 30 58 36" />
        {/* Udder hint */}
        <circle cx="42" cy="45" r="1.2" fill="currentColor" />
      </g>
    </svg>
  )
}

function SheepIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" className="h-full w-full" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {/* Woolly body - cloud-like */}
        <path d="M16 32 Q13 28 17 25 Q18 20 24 21 Q27 17 33 19 Q38 17 42 21 Q48 20 49 26 Q53 28 50 33 Q52 37 47 39 Q45 43 40 42 L26 42 Q21 43 19 39 Q14 37 16 32 Z" />
        {/* Head */}
        <ellipse cx="46" cy="30" rx="6" ry="7" />
        {/* Ears */}
        <path d="M41 25 Q38 23 39 27" />
        <path d="M51 25 Q54 23 53 27" />
        {/* Eye */}
        <circle cx="47" cy="29" r="0.7" fill="currentColor" />
        {/* Nose */}
        <path d="M49 33 L50 34" />
        {/* Legs */}
        <line x1="24" y1="42" x2="24" y2="52" />
        <line x1="30" y1="42" x2="30" y2="52" />
        <line x1="38" y1="42" x2="38" y2="52" />
        <line x1="44" y1="42" x2="44" y2="52" />
      </g>
    </svg>
  )
}
