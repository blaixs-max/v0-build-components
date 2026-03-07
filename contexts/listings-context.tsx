"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Listing as DataListing } from "@/lib/listings-data"
import { useAuth } from "./auth-context"
import {
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  addListingToFirestore,
  addListingIdToUser,
  subscribeToUserListings,
} from "@/lib/firestore"

export interface ListingsContextType {
  favorites: string[]
  toggleFavorite: (listingId: string) => void
  isFavorite: (listingId: string) => boolean
  isMyListing: (listingId: string) => boolean
  addMyListing: (listingId: string) => void
  userCreatedListings: DataListing[]
  addCreatedListing: (listing: DataListing) => Promise<void>
  getCreatedListingById: (id: string) => DataListing | undefined
}

const ListingsContext = createContext<ListingsContextType | undefined>(undefined)

export function ListingsProvider({ children }: { children: ReactNode }) {
  const { user, firebaseUser, updateUser } = useAuth()
  const [favorites, setFavorites] = useState<string[]>([])
  const [userCreatedListings, setUserCreatedListings] = useState<DataListing[]>([])

  // Favorileri Firestore'dan yukle
  useEffect(() => {
    if (!firebaseUser) {
      setFavorites([])
      return
    }

    getFavorites(firebaseUser.uid).then((favs) => {
      setFavorites(favs)
    })
  }, [firebaseUser])

  // Kullanicinin ilanlarini Firestore'dan dinle (realtime)
  useEffect(() => {
    if (!firebaseUser) {
      setUserCreatedListings([])
      return
    }

    const unsubscribe = subscribeToUserListings(firebaseUser.uid, (listings) => {
      setUserCreatedListings(listings)
    })

    return () => unsubscribe()
  }, [firebaseUser])

  const toggleFavorite = (listingId: string) => {
    const isCurrentlyFavorite = favorites.includes(listingId)
    const newFavorites = isCurrentlyFavorite
      ? favorites.filter((id) => id !== listingId)
      : [...favorites, listingId]

    setFavorites(newFavorites)

    if (firebaseUser) {
      if (isCurrentlyFavorite) {
        removeFromFavorites(firebaseUser.uid, listingId)
      } else {
        addToFavorites(firebaseUser.uid, listingId)
      }
    }
  }

  const isFavorite = (listingId: string) => {
    return favorites.includes(listingId)
  }

  const isMyListing = (listingId: string): boolean => {
    if (!user?.myListings) return false
    return user.myListings.includes(listingId)
  }

  const addMyListing = (listingId: string) => {
    if (user && firebaseUser) {
      updateUser({ myListings: [...(user.myListings || []), listingId] })
      addListingIdToUser(firebaseUser.uid, listingId)
    }
  }

  const addCreatedListing = async (listing: DataListing) => {
    if (firebaseUser) {
      const firestoreId = await addListingToFirestore(listing, firebaseUser.uid)
      // Firestore'da olusturulan ilan otomatik subscribeToUserListings ile gelecek
      // Ama local state'e de ekle (aninda gosterim icin)
      setUserCreatedListings((prev) => [{ ...listing, id: firestoreId }, ...prev])
      addListingIdToUser(firebaseUser.uid, firestoreId)
      updateUser({ myListings: [...(user?.myListings || []), firestoreId] })
    } else {
      // Misafir kullanici - localStorage fallback
      setUserCreatedListings((prev) => {
        const updated = [listing, ...prev]
        try {
          localStorage.setItem("meradan_created_listings", JSON.stringify(updated))
        } catch {}
        return updated
      })
    }
  }

  const getCreatedListingById = (id: string): DataListing | undefined => {
    return userCreatedListings.find((l) => l.id === id)
  }

  return (
    <ListingsContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorite,
        isMyListing,
        addMyListing,
        userCreatedListings,
        addCreatedListing,
        getCreatedListingById,
      }}
    >
      {children}
    </ListingsContext.Provider>
  )
}

export function useListings() {
  const context = useContext(ListingsContext)
  if (context === undefined) {
    throw new Error("useListings must be used within a ListingsProvider")
  }
  return context
}
