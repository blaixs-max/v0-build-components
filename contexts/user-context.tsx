"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Listing as DataListing } from "@/lib/listings-data"

export interface UserBadges {
  phoneVerified: boolean
  identityVerified: boolean
  fastResponder: boolean
  successfulSales: number
}

export type UserLevel = "new" | "trusted" | "expert" | "premium"

export interface Listing {
  id: string
  title: string
  location: string
  price: number
  imageUrl: string
  breed: string
  priceType: string
  category: "buyukbas" | "kucukbas"
}

export interface Offer {
  id: string
  listingId: string
  listingTitle: string
  offerAmount: number
  offererName: string
  offererId: string
  status: "pending" | "accepted" | "rejected" | "payment_pending" | "paid" | "delivered" | "completed"
  createdAt: string
  message?: string
  paymentDate?: string
  deliveryDate?: string
  completedDate?: string
}

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
  sentOffers?: Offer[]
  receivedOffers?: Offer[]
  myListings?: string[]
}

export function calculateUserLevel(badges?: UserBadges): UserLevel {
  if (!badges) return "new"

  const { phoneVerified, identityVerified, fastResponder, successfulSales } = badges

  // Premium: Tüm rozetler + 50+ satış
  if (phoneVerified && identityVerified && fastResponder && successfulSales >= 50) {
    return "premium"
  }

  // Uzman: Kimlik doğrulanmış + 10+ satış
  if (identityVerified && successfulSales >= 10) {
    return "expert"
  }

  // Güvenilir: Telefon doğrulanmış
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

interface UserContextType {
  user: User | null
  login: (userData: User) => void
  logout: () => void
  updateUser: (userData: Partial<User>) => void
  updateBadges: (badges: Partial<UserBadges>) => void
  isLoggedIn: boolean
  isLoading: boolean
  favorites: string[]
  toggleFavorite: (listingId: string) => void
  isFavorite: (listingId: string) => boolean
  sendOffer: (offer: Omit<Offer, "id" | "createdAt" | "status" | "offererName" | "offererId">) => boolean
  getOffersForListing: (listingId: string) => Offer[]
  getMyOffers: () => Offer[]
  getReceivedOffers: () => Offer[]
  updateOfferStatus: (offerId: string, status: Offer["status"]) => void
  isMyListing: (listingId: string) => boolean
  addMyListing: (listingId: string) => void
  userCreatedListings: DataListing[]
  addCreatedListing: (listing: DataListing) => void
  getCreatedListingById: (id: string) => DataListing | undefined
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [favorites, setFavorites] = useState<string[]>([])
  const [allOffers, setAllOffers] = useState<Offer[]>([])
  const [userCreatedListings, setUserCreatedListings] = useState<DataListing[]>([])

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("meradan_user")
      const savedFavorites = localStorage.getItem("meradan_favorites")
      const savedOffers = localStorage.getItem("meradan_offers")
      const savedCreatedListings = localStorage.getItem("meradan_created_listings")

      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites))
      }

      if (savedOffers) {
        setAllOffers(JSON.parse(savedOffers))
      }

      if (savedCreatedListings) {
        setUserCreatedListings(JSON.parse(savedCreatedListings))
      }

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
        if (parsed.favorites) {
          setFavorites(parsed.favorites)
        }
        parsed.level = calculateUserLevel(parsed.badges)
        setUser(parsed)
      }
    } catch {
      // localStorage verisi bozulmuşsa sıfırla
      localStorage.removeItem("meradan_user")
      localStorage.removeItem("meradan_favorites")
      localStorage.removeItem("meradan_offers")
      localStorage.removeItem("meradan_created_listings")
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
      favorites: favorites,
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

  const toggleFavorite = (listingId: string) => {
    setFavorites((prev) => {
      const newFavorites = prev.includes(listingId) ? prev.filter((id) => id !== listingId) : [...prev, listingId]

      localStorage.setItem("meradan_favorites", JSON.stringify(newFavorites))

      if (user) {
        const updatedUser = { ...user, favorites: newFavorites }
        setUser(updatedUser)
        localStorage.setItem("meradan_user", JSON.stringify(updatedUser))
      }

      return newFavorites
    })
  }

  const isFavorite = (listingId: string) => {
    return favorites.includes(listingId)
  }

  const sendOffer = (offerData: Omit<Offer, "id" | "createdAt" | "status" | "offererName" | "offererId">): boolean => {
    if (!user || !user.isVerified) {
      return false
    }

    const newOffer: Offer = {
      ...offerData,
      id: `offer_${Date.now()}`,
      offererName: `${user.firstName} ${user.lastName}`,
      offererId: user.phone,
      status: "pending",
      createdAt: new Date().toISOString(),
    }

    setAllOffers((prev) => {
      const updated = [...prev, newOffer]
      localStorage.setItem("meradan_offers", JSON.stringify(updated))
      return updated
    })

    return true
  }

  const getOffersForListing = (listingId: string): Offer[] => {
    return allOffers.filter((offer) => offer.listingId === listingId)
  }

  const getMyOffers = (): Offer[] => {
    if (!user) return []
    return allOffers.filter((offer) => offer.offererId === user.phone)
  }

  const getReceivedOffers = (): Offer[] => {
    if (!user || !user.myListings) return []
    return allOffers.filter((offer) => user.myListings?.includes(offer.listingId))
  }

  const updateOfferStatus = (offerId: string, status: Offer["status"]) => {
    setAllOffers((prev) => {
      const updated = prev.map((offer) => {
        if (offer.id === offerId) {
          const updates: Partial<Offer> = { status }
          if (status === "paid") {
            updates.paymentDate = new Date().toISOString()
          }
          if (status === "delivered") {
            updates.deliveryDate = new Date().toISOString()
          }
          if (status === "completed") {
            updates.completedDate = new Date().toISOString()
          }
          return { ...offer, ...updates }
        }
        return offer
      })
      localStorage.setItem("meradan_offers", JSON.stringify(updated))
      return updated
    })
  }

  const isMyListing = (listingId: string): boolean => {
    if (!user || !user.myListings) return false
    return user.myListings.includes(listingId)
  }

  const addMyListing = (listingId: string) => {
    if (user) {
      const updatedUser = {
        ...user,
        myListings: [...(user.myListings || []), listingId],
      }
      setUser(updatedUser)
      localStorage.setItem("meradan_user", JSON.stringify(updatedUser))
    }
  }

  const addCreatedListing = (listing: DataListing) => {
    setUserCreatedListings((prev) => {
      const updated = [listing, ...prev]
      localStorage.setItem("meradan_created_listings", JSON.stringify(updated))
      return updated
    })
  }

  const getCreatedListingById = (id: string): DataListing | undefined => {
    return userCreatedListings.find((l) => l.id === id)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-meradan-green rounded-full flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" className="w-10 h-10">
              <path d="M12 4c-1.5 0-3 .5-4 1.5C7 6.5 6 8 6 10c0 1.5.5 2.5 1 3.5.5 1 1 2 1 3.5v3h8v-3c0-1.5.5-2.5 1-3.5.5-1 1-2 1-3.5 0-2-1-3.5-2-4.5-1-1-2.5-1.5-4-1.5z" />
            </svg>
          </div>
          <p className="text-meradan-green font-medium">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <UserContext.Provider
      value={{
        user,
        login,
        logout,
        updateUser,
        updateBadges,
        isLoggedIn: !!user,
        isLoading,
        favorites,
        toggleFavorite,
        isFavorite,
        sendOffer,
        getOffersForListing,
        getMyOffers,
        getReceivedOffers,
        updateOfferStatus,
        isMyListing,
        addMyListing,
        userCreatedListings,
        addCreatedListing,
        getCreatedListingById,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
