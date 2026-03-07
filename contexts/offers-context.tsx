"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useAuth } from "./auth-context"
import {
  sendOfferToFirestore,
  subscribeToMyOffers,
  subscribeToReceivedOffers,
  updateOfferInFirestore,
} from "@/lib/firestore"

export interface Offer {
  id: string
  listingId: string
  listingTitle: string
  offerAmount: number
  offererName: string
  offererId: string   // Firebase UID
  sellerId?: string   // Firebase UID (ilan sahibi - Firestore'dan yuklenen ilanlarda mevcut)
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
  const { user, firebaseUser } = useAuth()
  const [myOffers, setMyOffers] = useState<Offer[]>([])
  const [receivedOffers, setReceivedOffers] = useState<Offer[]>([])

  // Gonderilen teklifleri dinle
  useEffect(() => {
    if (!firebaseUser) {
      setMyOffers([])
      return
    }
    const unsubscribe = subscribeToMyOffers(firebaseUser.uid, setMyOffers)
    return () => unsubscribe()
  }, [firebaseUser])

  // Alinan teklifleri dinle
  useEffect(() => {
    if (!firebaseUser) {
      setReceivedOffers([])
      return
    }
    const unsubscribe = subscribeToReceivedOffers(firebaseUser.uid, setReceivedOffers)
    return () => unsubscribe()
  }, [firebaseUser])

  const sendOffer = (offerData: Omit<Offer, "id" | "createdAt" | "status" | "offererName" | "offererId">): boolean => {
    if (!user || !firebaseUser || !user.isVerified) {
      return false
    }

    sendOfferToFirestore({
      ...offerData,
      offererName: `${user.firstName} ${user.lastName}`,
      offererId: firebaseUser.uid,
    } as Omit<Offer, "id" | "createdAt" | "status">)

    return true
  }

  const getOffersForListing = (listingId: string): Offer[] => {
    const all = [...myOffers, ...receivedOffers]
    const seen = new Set<string>()
    return all.filter((o) => {
      if (o.listingId !== listingId || seen.has(o.id)) return false
      seen.add(o.id)
      return true
    })
  }

  const getMyOffers = (): Offer[] => myOffers

  const getReceivedOffers = (): Offer[] => receivedOffers

  const updateOfferStatus = (offerId: string, status: Offer["status"]) => {
    const extraData: Partial<Offer> = {}
    if (status === "paid") extraData.paymentDate = new Date().toISOString()
    if (status === "delivered") extraData.deliveryDate = new Date().toISOString()
    if (status === "completed") extraData.completedDate = new Date().toISOString()

    // Optimistic update
    const update = (prev: Offer[]) =>
      prev.map((o) => (o.id === offerId ? { ...o, status, ...extraData } : o))
    setMyOffers(update)
    setReceivedOffers(update)

    updateOfferInFirestore(offerId, status, extraData)
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
