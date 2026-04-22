"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { User } from "lucide-react"
import { useUser } from "@/contexts/user-context"

export function SiteHeader() {
  const router = useRouter()
  const { isLoggedIn } = useUser()

  const handleAuthClick = () => {
    if (isLoggedIn) {
      router.push("/profil")
    } else {
      router.push("/giris")
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-card border-b border-border/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:h-20 md:px-6 lg:px-10">
        {/* Logo */}
        <Link href="/" className="flex items-center" aria-label="Meradan ana sayfa">
          <MeradanLogo />
        </Link>

        {/* Sağ Menü */}
        <nav className="flex items-center gap-3 md:gap-8">
          <Link
            href="/"
            className="hidden text-[15px] font-semibold text-foreground transition-colors hover:text-meradan-green md:inline-block"
          >
            İlan Ara
          </Link>
          <Link
            href="/ilan-ver"
            className="hidden text-[15px] font-medium text-meradan-green transition-colors hover:opacity-80 md:inline-block"
          >
            Ücretsiz İlan Ver
          </Link>
          <button
            onClick={handleAuthClick}
            className="inline-flex items-center gap-2 rounded-full border-2 border-meradan-green bg-card px-3.5 py-2 text-sm font-semibold text-meradan-green transition-colors hover:bg-meradan-green hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-meradan-green focus-visible:ring-offset-2 md:rounded-md md:px-5 md:py-2.5 md:text-[15px]"
          >
            <User className="h-[18px] w-[18px]" strokeWidth={2} />
            <span className="hidden sm:inline">Giriş Yap / Kayıt Ol</span>
            <span className="sm:hidden">Giriş</span>
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
