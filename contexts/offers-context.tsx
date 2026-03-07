"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useAuth } from "./auth-context"

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

export interface OffersContextType {
  sendOffer: (offer: Omit<Offer, "id" | "createdAt" | "status" | "offererName" | "offererId">) => boolean
  getOffersForListing: (listingId: string) => Offer[]
  getMyOffers: () => Offer[]
  getReceivedOffers: () => Offer[]
  updateOfferStatus: (offerId: string, status: Offer["status"]) => void
}

const OffersContext = createContext<OffersContextType | undefined>(undefined)

export function OffersProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [allOffers, setAllOffers] = useState<Offer[]>([])

  useEffect(() => {
    try {
      const savedOffers = localStorage.getItem("meradan_offers")
      if (savedOffers) {
        setAllOffers(JSON.parse(savedOffers))
      }
    } catch {
      localStorage.removeItem("meradan_offers")
    }
  }, [])

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

  return (
    <OffersContext.Provider
      value={{
        sendOffer,
        getOffersForListing,
        getMyOffers,
        getReceivedOffers,
        updateOfferStatus,
      }}
    >
      {children}
    </OffersContext.Provider>
  )
}

export function useOffers() {
  const context = useContext(OffersContext)
  if (context === undefined) {
    throw new Error("useOffers must be used within an OffersProvider")
  }
  return context
}
