"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface UserBadges {
  phoneVerified: boolean
  identityVerified: boolean
  fastResponder: boolean
  successfulSales: number
}

export type UserLevel = "new" | "trusted" | "expert" | "premium"

export interface User {
  firstName: string
  lastName: string
  phone: string
  location?: string
  isVerified?: boolean
  badges?: UserBadges
  level?: UserLevel
  memberSince?: string
  responseRate?: number
  favorites?: string[]
  sentOffers?: never[]
  receivedOffers?: never[]
  myListings?: string[]
}

export function calculateUserLevel(badges?: UserBadges): UserLevel {
  if (!badges) return "new"

  const { phoneVerified, identityVerified, fastResponder, successfulSales } = badges

  if (phoneVerified && identityVerified && fastResponder && successfulSales >= 50) {
    return "premium"
  }

  if (identityVerified && successfulSales >= 10) {
    return "expert"
  }

  if (phoneVerified) {
    return "trusted"
  }

  return "new"
}

export function getLevelInfo(level: UserLevel) {
  const levels = {
    new: {
      name: "Yeni Üye",
      color: "bg-gray-500",
      textColor: "text-gray-600",
      bgLight: "bg-gray-100",
      borderColor: "border-gray-300",
      icon: "user",
    },
    trusted: {
      name: "Güvenilir Satıcı",
      color: "bg-blue-500",
      textColor: "text-blue-600",
      bgLight: "bg-blue-50",
      borderColor: "border-blue-300",
      icon: "shield-check",
    },
    expert: {
      name: "Uzman Satıcı",
      color: "bg-meradan-green",
      textColor: "text-meradan-green",
      bgLight: "bg-green-50",
      borderColor: "border-green-300",
      icon: "award",
    },
    premium: {
      name: "Premium Satıcı",
      color: "bg-meradan-orange",
      textColor: "text-meradan-orange",
      bgLight: "bg-orange-50",
      borderColor: "border-orange-300",
      icon: "crown",
    },
  }
  return levels[level]
}

export interface AuthContextType {
  user: User | null
  login: (userData: User) => void
  logout: () => void
  updateUser: (userData: Partial<User>) => void
  updateBadges: (badges: Partial<UserBadges>) => void
  isLoggedIn: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("meradan_user")
      if (savedUser) {
        const parsed = JSON.parse(savedUser)
        if (!parsed.badges) {
          parsed.badges = {
            phoneVerified: parsed.isVerified || false,
            identityVerified: false,
            fastResponder: false,
            successfulSales: 0,
          }
        }
        if (!parsed.memberSince) {
          parsed.memberSince = new Date().toISOString()
        }
        if (!parsed.myListings) {
          parsed.myListings = []
        }
        parsed.level = calculateUserLevel(parsed.badges)
        setUser(parsed)
      }
    } catch {
      localStorage.removeItem("meradan_user")
    }
    setIsLoading(false)
  }, [])

  const login = (userData: User) => {
    const newUser = {
      ...userData,
      badges: userData.badges || {
        phoneVerified: false,
        identityVerified: false,
        fastResponder: false,
        successfulSales: 0,
      },
      memberSince: userData.memberSince || new Date().toISOString(),
      responseRate: userData.responseRate || 0,
    }
    newUser.level = calculateUserLevel(newUser.badges)
    setUser(newUser)
    localStorage.setItem("meradan_user", JSON.stringify(newUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("meradan_user")
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      if (userData.isVerified !== undefined && updatedUser.badges) {
        updatedUser.badges.phoneVerified = userData.isVerified
      }
      updatedUser.level = calculateUserLevel(updatedUser.badges)
      setUser(updatedUser)
      localStorage.setItem("meradan_user", JSON.stringify(updatedUser))
    }
  }

  const updateBadges = (badgeUpdates: Partial<UserBadges>) => {
    if (user && user.badges) {
      const updatedBadges = { ...user.badges, ...badgeUpdates }
      const updatedUser = {
        ...user,
        badges: updatedBadges,
        level: calculateUserLevel(updatedBadges),
      }
      setUser(updatedUser)
      localStorage.setItem("meradan_user", JSON.stringify(updatedUser))
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        updateUser,
        updateBadges,
        isLoggedIn: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
