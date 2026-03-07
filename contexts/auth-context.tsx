"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { onAuthStateChanged, signOut, type User as FirebaseUser } from "firebase/auth"
import { auth } from "@/lib/firebase"
import {
  getUserProfile,
  saveUserProfile,
  updateUserProfile,
  updateUserBadges,
} from "@/lib/firestore"

export interface UserBadges {
  phoneVerified: boolean
  identityVerified: boolean
  fastResponder: boolean
  successfulSales: number
}

export type UserLevel = "new" | "trusted" | "expert" | "premium"

export interface User {
  uid?: string
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
  firebaseUser: FirebaseUser | null
  login: (userData: User) => Promise<void>
  logout: () => Promise<void>
  updateUser: (userData: Partial<User>) => Promise<void>
  updateBadges: (badges: Partial<UserBadges>) => Promise<void>
  isLoggedIn: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser)
      if (fbUser) {
        const profile = await getUserProfile(fbUser.uid)
        if (profile) {
          profile.level = calculateUserLevel(profile.badges)
          setUser(profile)
        } else {
          // Firebase user var ama profil yok - giris sayfasi halledecek
          setUser(null)
        }
      } else {
        setUser(null)
      }
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = async (userData: User) => {
    if (!firebaseUser) return

    const newUser: User = {
      ...userData,
      uid: firebaseUser.uid,
      isVerified: true,
      badges: userData.badges || {
        phoneVerified: true,
        identityVerified: false,
        fastResponder: false,
        successfulSales: 0,
      },
      memberSince: userData.memberSince || new Date().toISOString(),
      responseRate: userData.responseRate || 0,
      favorites: userData.favorites || [],
      myListings: userData.myListings || [],
    }
    newUser.level = calculateUserLevel(newUser.badges)

    await saveUserProfile(firebaseUser.uid, newUser)
    setUser(newUser)
  }

  const logout = async () => {
    await signOut(auth)
    setUser(null)
    setFirebaseUser(null)
  }

  const updateUser = async (userData: Partial<User>) => {
    if (!user || !firebaseUser) return
    const updatedUser = { ...user, ...userData }
    if (userData.isVerified !== undefined && updatedUser.badges) {
      updatedUser.badges.phoneVerified = userData.isVerified
    }
    updatedUser.level = calculateUserLevel(updatedUser.badges)
    setUser(updatedUser)
    await updateUserProfile(firebaseUser.uid, userData)
  }

  const updateBadges = async (badgeUpdates: Partial<UserBadges>) => {
    if (!user?.badges || !firebaseUser) return
    const updatedBadges = { ...user.badges, ...badgeUpdates }
    const updatedUser = {
      ...user,
      badges: updatedBadges,
      level: calculateUserLevel(updatedBadges),
    }
    setUser(updatedUser)
    await updateUserBadges(firebaseUser.uid, badgeUpdates)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
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
