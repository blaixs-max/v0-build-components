"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, PlusCircle, User } from "lucide-react"
import { useUser } from "@/contexts/user-context"

export function SiteHeader({ onCreateListing }: { onCreateListing?: () => void }) {
  const router = useRouter()
  const { isLoggedIn } = useUser()

  const handleAuthClick = () => {
    if (isLoggedIn) {
      router.push("/profil")
    } else {
      router.push("/giris")
    }
  }

  const handleCreateListing = () => {
    if (onCreateListing) {
      onCreateListing()
    } else {
      router.push("/?ilan-ver=1")
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-card border-b border-border/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:h-20 md:px-6 lg:px-10">
        {/* Logo */}
        <Link href="/" className="flex items-center" aria-label="Meradan ana sayfa">
          <MeradanLogo />
        </Link>

        {/* Sag Menu */}
        <nav className="flex items-center gap-2 md:gap-4">
          <Link
            href="/"
            className="hidden items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted md:inline-flex"
          >
            <Search className="h-4 w-4" />
            <span>Ilan Ara</span>
          </Link>
          <button
            onClick={handleCreateListing}
            className="hidden items-center gap-1.5 rounded-lg bg-meradan-green px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-meradan-green/90 md:inline-flex"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Ucretsiz Ilan Ver</span>
          </button>
          <button
            onClick={handleAuthClick}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-meradan-green focus-visible:ring-offset-2 md:px-4 md:py-2"
          >
            <User className="h-4 w-4" strokeWidth={2} />
            <span className="hidden sm:inline">{isLoggedIn ? "Profil" : "Giris Yap"}</span>
          </button>
        </nav>
      </div>
    </header>
  )
}

function MeradanLogo() {
  return (
    <Image
      src="/images/meradan-logo.png"
      alt="Meradan"
      width={340}
      height={100}
      priority
      className="h-9 w-auto md:h-11"
    />
  )
}
