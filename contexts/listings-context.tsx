"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Listing as DataListing } from "@/lib/listings-data"
import { useAuth } from "./auth-context"

export interface ListingsContextType {
  favorites: string[]
  toggleFavorite: (listingId: string) => void
  isFavorite: (listingId: string) => boolean
  isMyListing: (listingId: string) => boolean
  addMyListing: (listingId: string) => void
  userCreatedListings: DataListing[]
  addCreatedListing: (listing: DataListing) => void
  getCreatedListingById: (id: string) => DataListing | undefined
}

const ListingsContext = createContext<ListingsContextType | undefined>(undefined)

export function ListingsProvider({ children }: { children: ReactNode }) {
  const { user, updateUser } = useAuth()
  const [favorites, setFavorites] = useState<string[]>([])
  const [userCreatedListings, setUserCreatedListings] = useState<DataListing[]>([])

  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem("meradan_favorites")
      const savedCreatedListings = localStorage.getItem("meradan_created_listings")
      const savedUser = localStorage.getItem("meradan_user")

      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites))
      }

      if (savedCreatedListings) {
        setUserCreatedListings(JSON.parse(savedCreatedListings))
      }

      // Restore favorites from user data if available
      if (savedUser) {
        const parsed = JSON.parse(savedUser)
        if (parsed.favorites && !savedFavorites) {
          setFavorites(parsed.favorites)
        }
      }
    } catch {
      localStorage.removeItem("meradan_favorites")
      localStorage.removeItem("meradan_created_listings")
    }
  }, [])

  const toggleFavorite = (listingId: string) => {
    setFavorites((prev) => {
      const newFavorites = prev.includes(listingId) ? prev.filter((id) => id !== listingId) : [...prev, listingId]
      localStorage.setItem("meradan_favorites", JSON.stringify(newFavorites))

      if (user) {
        updateUser({ favorites: newFavorites })
      }

      return newFavorites
    })
  }

  const isFavorite = (listingId: string) => {
    return favorites.includes(listingId)
  }

  const isMyListing = (listingId: string): boolean => {
    if (!user || !user.myListings) return false
    return user.myListings.includes(listingId)
  }

  const addMyListing = (listingId: string) => {
    if (user) {
      updateUser({
        myListings: [...(user.myListings || []), listingId],
      })
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
