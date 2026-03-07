"use client"

import type { ReactNode } from "react"
import { AuthProvider, useAuth } from "./auth-context"
import { ListingsProvider, useListings } from "./listings-context"
import { OffersProvider, useOffers } from "./offers-context"
import type { Listing as DataListing } from "@/lib/listings-data"

// Re-export types for backward compatibility
export type { User, UserBadges, UserLevel } from "./auth-context"
export { calculateUserLevel, getLevelInfo } from "./auth-context"
export type { Offer } from "./offers-context"

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

export function UserProvider({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ListingsProvider>
        <OffersProvider>
          <LoadingGate>{children}</LoadingGate>
        </OffersProvider>
      </ListingsProvider>
    </AuthProvider>
  )
}

function LoadingGate({ children }: { children: ReactNode }) {
  const { isLoading } = useAuth()

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

  return <>{children}</>
}

// Combined hook - backward compatible with original useUser API
export function useUser() {
  const auth = useAuth()
  const listings = useListings()
  const offers = useOffers()

  return {
    // Auth
    user: auth.user,
    login: auth.login,
    logout: auth.logout,
    updateUser: auth.updateUser,
    updateBadges: auth.updateBadges,
    isLoggedIn: auth.isLoggedIn,
    isLoading: auth.isLoading,
    // Listings
    favorites: listings.favorites,
    toggleFavorite: listings.toggleFavorite,
    isFavorite: listings.isFavorite,
    isMyListing: listings.isMyListing,
    addMyListing: listings.addMyListing,
    userCreatedListings: listings.userCreatedListings,
    addCreatedListing: listings.addCreatedListing,
    getCreatedListingById: listings.getCreatedListingById,
    // Offers
    sendOffer: offers.sendOffer,
    getOffersForListing: offers.getOffersForListing,
    getMyOffers: offers.getMyOffers,
    getReceivedOffers: offers.getReceivedOffers,
    updateOfferStatus: offers.updateOfferStatus,
  } as const
}
