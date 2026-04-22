"use client"

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
    <header className="sticky top-0 z-50 w-full bg-card">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1" aria-label="Meradan ana sayfa">
          <MeradanLogo />
        </Link>

        {/* Sağ Menü */}
        <nav className="flex items-center gap-8">
          <Link
            href="/"
            className="text-[15px] font-semibold text-foreground transition-colors hover:text-meradan-green"
          >
            İlan Ara
          </Link>
          <Link
            href="/ilan-ver"
            className="text-[15px] font-medium text-meradan-green transition-colors hover:opacity-80"
          >
            Ücretsiz İlan Ver
          </Link>
          <button
            onClick={handleAuthClick}
            className="inline-flex items-center gap-2 rounded-md border-2 border-meradan-green bg-card px-5 py-2.5 text-[15px] font-semibold text-meradan-green transition-colors hover:bg-meradan-green hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-meradan-green focus-visible:ring-offset-2"
          >
            <User className="h-[18px] w-[18px]" strokeWidth={2} />
            <span>Giriş Yap / Kayıt Ol</span>
          </button>
        </nav>
      </div>
    </header>
  )
}

function MeradanLogo() {
  return (
    <div className="flex items-baseline">
      {/* Leaf-shaped stylized M */}
      <svg
        viewBox="0 0 48 40"
        className="h-8 w-auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Left leaf upstroke */}
        <path
          d="M4 36 C 4 18, 10 8, 18 6 C 16 18, 14 28, 12 36 Z"
          fill="#2E7D32"
        />
        {/* Middle V */}
        <path
          d="M14 14 L 24 30 L 34 14"
          stroke="#2E7D32"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Right leaf upstroke */}
        <path
          d="M44 36 C 44 18, 38 8, 30 6 C 32 18, 34 28, 36 36 Z"
          fill="#2E7D32"
        />
      </svg>
      <span className="ml-0.5 text-2xl font-bold tracking-tight text-foreground">eradan</span>
    </div>
  )
}
