"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"

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

export interface EnterpriseNumber {
  id: string
  enterpriseNo: string
  label: string | null
  createdAt: string
}

export interface User {
  id: string
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

interface UserContextType {
  user: User | null
  login: (phone: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (data: { firstName: string; lastName: string; phone: string; password: string; location?: string }) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  updateUser: (userData: Partial<User>) => void
  updateBadges: (badges: Partial<UserBadges>) => void
  isLoggedIn: boolean
  isLoading: boolean
  favorites: string[]
  toggleFavorite: (listingId: string) => Promise<void>
  isFavorite: (listingId: string) => boolean
  sendOffer: (offer: { listingId: string; listingTitle: string; offerAmount: number; message?: string }) => Promise<boolean>
  getOffersForListing: (listingId: string) => Offer[]
  getMyOffers: () => Offer[]
  getReceivedOffers: () => Offer[]
  updateOfferStatus: (offerId: string, status: Offer["status"]) => void
  isMyListing: (listingId: string) => boolean
  addMyListing: (listingId: string) => void
  userCreatedListings: Listing[]
  addCreatedListing: (listing: Listing) => void
  getCreatedListingById: (id: string) => Listing | undefined
  // Enterprise numbers
  enterpriseNumbers: EnterpriseNumber[]
  loadEnterpriseNumbers: () => Promise<void>
  addEnterpriseNumber: (enterpriseNo: string, label?: string) => Promise<{ success: boolean; error?: string }>
  deleteEnterpriseNumber: (id: string) => Promise<{ success: boolean; error?: string }>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [favorites, setFavorites] = useState<string[]>([])
  const [allOffers, setAllOffers] = useState<Offer[]>([])
  const [userCreatedListings, setUserCreatedListings] = useState<Listing[]>([])
  const [enterpriseNumbers, setEnterpriseNumbers] = useState<EnterpriseNumber[]>([])

  // Check session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/auth/me")
        const data = await res.json()
        if (data.user) {
          const badges: UserBadges = {
            phoneVerified: data.user.phoneVerified || false,
            identityVerified: data.user.identityVerified || false,
            fastResponder: data.user.fastResponder || false,
            successfulSales: data.user.successfulSales || 0,
          }
          setUser({
            id: data.user.id,
            firstName: data.user.firstName,
            lastName: data.user.lastName,
            phone: data.user.phone,
            location: data.user.location,
            isVerified: data.user.isVerified,
            badges,
            level: calculateUserLevel(badges),
            memberSince: data.user.memberSince,
            responseRate: data.user.responseRate,
            myListings: [],
          })
        }
      } catch {
        // Session invalid or server error
      }
      setIsLoading(false)
    }
    checkSession()
  }, [])

  // Load favorites when user changes
  useEffect(() => {
    if (user) {
      fetch("/api/favorites")
        .then((res) => res.json())
        .then((data) => {
          if (data.favorites) {
            setFavorites(data.favorites.map((f: { id: string }) => f.id))
          }
        })
        .catch(() => {})
    } else {
      setFavorites([])
    }
  }, [user?.id])

  // Load offers when user changes
  useEffect(() => {
    if (user) {
      fetch("/api/offers")
        .then((res) => res.json())
        .then((data) => {
          const offers: Offer[] = []
          if (data.received) {
            for (const o of data.received) {
              offers.push({
                id: o.id,
                listingId: o.listingId,
                listingTitle: o.listingTitle,
                offerAmount: o.amount,
                offererName: o.buyerName,
                offererId: o.buyerPhone || "",
                status: o.status,
                createdAt: o.createdAt,
                message: o.message,
              })
            }
          }
          if (data.sent) {
            for (const o of data.sent) {
              offers.push({
                id: o.id,
                listingId: o.listingId,
                listingTitle: o.listingTitle,
                offerAmount: o.amount,
                offererName: user.firstName + " " + user.lastName,
                offererId: user.phone,
                status: o.status,
                createdAt: o.createdAt,
                message: o.message,
              })
            }
          }
          setAllOffers(offers)
        })
        .catch(() => {})
    } else {
      setAllOffers([])
    }
  }, [user?.id, user?.firstName, user?.lastName, user?.phone])

  const login = async (phone: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password }),
      })
      const data = await res.json()

      if (!res.ok) {
        return { success: false, error: data.error }
      }

      const u = data.user
      const badges: UserBadges = {
        phoneVerified: false,
        identityVerified: false,
        fastResponder: false,
        successfulSales: 0,
      }
      setUser({
        id: u.id,
        firstName: u.firstName,
        lastName: u.lastName,
        phone: u.phone,
        location: u.location,
        badges,
        level: calculateUserLevel(badges),
        memberSince: new Date().toISOString(),
        responseRate: 0,
        myListings: [],
      })

      return { success: true }
    } catch {
      return { success: false, error: "Bağlantı hatası oluştu." }
    }
  }

  const register = async (data: {
    firstName: string
    lastName: string
    phone: string
    password: string
    location?: string
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const result = await res.json()

      if (!res.ok) {
        return { success: false, error: result.error }
      }

      const u = result.user
      const badges: UserBadges = {
        phoneVerified: false,
        identityVerified: false,
        fastResponder: false,
        successfulSales: 0,
      }
      setUser({
        id: u.id,
        firstName: u.firstName,
        lastName: u.lastName,
        phone: u.phone,
        location: u.location,
        badges,
        level: calculateUserLevel(badges),
        memberSince: new Date().toISOString(),
        responseRate: 0,
        myListings: [],
      })

      return { success: true }
    } catch {
      return { success: false, error: "Bağlantı hatası oluştu." }
    }
  }

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
    } catch {
      // ignore
    }
    setUser(null)
    setFavorites([])
    setAllOffers([])
    setEnterpriseNumbers([])
    setUserCreatedListings([])
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      if (userData.isVerified !== undefined && updatedUser.badges) {
        updatedUser.badges.phoneVerified = userData.isVerified
      }
      updatedUser.level = calculateUserLevel(updatedUser.badges)
      setUser(updatedUser)
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
    }
  }

  const toggleFavorite = async (listingId: string) => {
    if (!user) return

    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId }),
      })
      const data = await res.json()

      if (data.isFavorite) {
        setFavorites((prev) => [...prev, listingId])
      } else {
        setFavorites((prev) => prev.filter((id) => id !== listingId))
      }
    } catch {
      // Silently fail
    }
  }

  const isFavorite = (listingId: string) => {
    return favorites.includes(listingId)
  }

  const sendOffer = async (offerData: {
    listingId: string
    listingTitle: string
    offerAmount: number
    message?: string
  }): Promise<boolean> => {
    if (!user) return false

    try {
      const res = await fetch("/api/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId: offerData.listingId,
          amount: offerData.offerAmount,
          message: offerData.message,
        }),
      })

      if (!res.ok) return false

      // Add to local state
      const result = await res.json()
      const newOffer: Offer = {
        id: result.id,
        listingId: offerData.listingId,
        listingTitle: offerData.listingTitle,
        offerAmount: offerData.offerAmount,
        offererName: `${user.firstName} ${user.lastName}`,
        offererId: user.phone,
        status: "pending",
        createdAt: new Date().toISOString(),
        message: offerData.message,
      }
      setAllOffers((prev) => [...prev, newOffer])
      return true
    } catch {
      return false
    }
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
    setAllOffers((prev) =>
      prev.map((offer) => {
        if (offer.id === offerId) {
          const updates: Partial<Offer> = { status }
          if (status === "paid") updates.paymentDate = new Date().toISOString()
          if (status === "delivered") updates.deliveryDate = new Date().toISOString()
          if (status === "completed") updates.completedDate = new Date().toISOString()
          return { ...offer, ...updates }
        }
        return offer
      })
    )
  }

  const isMyListing = (listingId: string): boolean => {
    if (!user || !user.myListings) return false
    return user.myListings.includes(listingId)
  }

  const addMyListing = (listingId: string) => {
    if (user) {
      setUser({
        ...user,
        myListings: [...(user.myListings || []), listingId],
      })
    }
  }

  const addCreatedListing = (listing: Listing) => {
    setUserCreatedListings((prev) => [listing, ...prev])
  }

  const getCreatedListingById = (id: string): Listing | undefined => {
    return userCreatedListings.find((l) => l.id === id)
  }

  // Enterprise number functions
  const loadEnterpriseNumbers = useCallback(async () => {
    if (!user) return
    try {
      const res = await fetch("/api/enterprise-numbers")
      const data = await res.json()
      if (data.enterpriseNumbers) {
        setEnterpriseNumbers(data.enterpriseNumbers)
      }
    } catch {
      // Silently fail
    }
  }, [user])

  const addEnterpriseNumber = async (
    enterpriseNo: string,
    label?: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch("/api/enterprise-numbers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enterpriseNo, label }),
      })
      const data = await res.json()

      if (!res.ok) {
        return { success: false, error: data.error }
      }

      setEnterpriseNumbers((prev) => [data.enterpriseNumber, ...prev])
      return { success: true }
    } catch {
      return { success: false, error: "Bağlantı hatası oluştu." }
    }
  }

  const deleteEnterpriseNumber = async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch(`/api/enterprise-numbers/${id}`, { method: "DELETE" })

      if (!res.ok) {
        const data = await res.json()
        return { success: false, error: data.error }
      }

      setEnterpriseNumbers((prev) => prev.filter((en) => en.id !== id))
      return { success: true }
    } catch {
      return { success: false, error: "Bağlantı hatası oluştu." }
    }
  }

  // Load enterprise numbers when user changes
  useEffect(() => {
    if (user) {
      loadEnterpriseNumbers()
    }
  }, [user, loadEnterpriseNumbers])

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
        register,
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
        enterpriseNumbers,
        loadEnterpriseNumbers,
        addEnterpriseNumber,
        deleteEnterpriseNumber,
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
