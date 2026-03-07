"use client"

import type { RefObject } from "react"
import { Search, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useUser } from "@/contexts/user-context"

interface SearchHeaderProps {
  searchQuery?: string
  onSearchChange?: (query: string) => void
  inputRef?: RefObject<HTMLInputElement | null>
}

export function SearchHeader({ searchQuery = "", onSearchChange, inputRef }: SearchHeaderProps) {
  const router = useRouter()
  const { user, isLoggedIn } = useUser()

  const getInitials = () => {
    if (!user) return ""
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
  }

  const handleAvatarClick = () => {
    if (isLoggedIn) {
      router.push("/profil")
    } else {
      router.push("/giris")
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-card px-4 py-3 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Hayvan, ırk, konum ara..."
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="h-11 rounded-full bg-muted pl-10 pr-4 text-sm border-0 focus-visible:ring-2 focus-visible:ring-[var(--meradan-green)]"
          />
        </div>
        <button
          onClick={handleAvatarClick}
          className="focus:outline-none focus:ring-2 focus:ring-[var(--meradan-green)] rounded-full"
        >
          <Avatar className={`h-10 w-10 border-2 ${isLoggedIn ? "border-[var(--meradan-green)]" : "border-muted"}`}>
            <AvatarFallback className={isLoggedIn ? "bg-meradan-green text-white font-medium" : "bg-muted"}>
              {isLoggedIn ? getInitials() : <User className="h-5 w-5 text-muted-foreground" />}
            </AvatarFallback>
          </Avatar>
        </button>
      </div>
    </header>
  )
}
