"use client"

import type React from "react"
import { useRouter, usePathname } from "next/navigation"
import { Home, Search, PlusSquare, User } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  icon: React.ReactNode
  label: string
  href: string
  path: string
}

interface BottomNavigationProps {
  activeTab: string
  onTabChange?: (tab: string) => void
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const router = useRouter()
  const pathname = usePathname()

  const navItems: NavItem[] = [
    { icon: <Home className="h-6 w-6" />, label: "Ana Sayfa", href: "home", path: "/" },
    { icon: <Search className="h-6 w-6" />, label: "Ara", href: "search", path: "/ara" },
    { icon: <PlusSquare className="h-6 w-6" />, label: "İlan Ver", href: "create", path: "/ilan-ver" },
    { icon: <User className="h-6 w-6" />, label: "Profil", href: "profile", path: "/profil" },
  ]

  const handleNavClick = (item: NavItem) => {
    if (item.href === "create") {
      // Ilan ver wizard acilacak
      onTabChange?.(item.href)
    } else if (item.href === "home") {
      router.push("/")
      onTabChange?.(item.href)
    } else if (item.href === "search") {
      // Ana sayfada arama alanina focus
      onTabChange?.(item.href)
      if (pathname !== "/") {
        router.push("/")
      }
    } else if (item.href === "profile") {
      router.push("/profil")
      onTabChange?.(item.href)
    }
  }

  const isActive = (item: NavItem) => {
    if (item.href === "home" && pathname === "/") return true
    if (item.href === "profile" && pathname === "/profil") return true
    if (item.href === "search" && activeTab === "search") return true
    return activeTab === item.href
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border safe-area-inset-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const active = isActive(item)
          return (
            <button
              key={item.href}
              onClick={() => handleNavClick(item)}
              className="flex flex-col items-center justify-center min-w-[64px] py-1 text-meradan-green transition-colors"
              aria-label={item.label}
              aria-current={active ? "page" : undefined}
            >
              {item.icon}
              <span className="text-[11px] mt-0.5 font-medium">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
