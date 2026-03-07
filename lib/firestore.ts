import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  onSnapshot,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  type Unsubscribe,
} from "firebase/firestore"
import { db } from "./firebase"
import type { User, UserBadges } from "@/contexts/auth-context"
import type { Offer } from "@/contexts/offers-context"
import type { Listing } from "./listings-data"

// ─── Kullanici Profili ────────────────────────────────────────────────────────

export async function getUserProfile(uid: string): Promise<User | null> {
  try {
    const snap = await getDoc(doc(db, "users", uid))
    if (snap.exists()) {
      return snap.data() as User
    }
    return null
  } catch {
    return null
  }
}

export async function saveUserProfile(uid: string, user: User): Promise<void> {
  await setDoc(doc(db, "users", uid), { ...user, uid }, { merge: true })
}

export async function updateUserProfile(uid: string, data: Partial<User>): Promise<void> {
  await updateDoc(doc(db, "users", uid), data as Record<string, unknown>)
}

export async function updateUserBadges(uid: string, badges: Partial<UserBadges>): Promise<void> {
  const updates: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(badges)) {
    updates[`badges.${key}`] = value
  }
  await updateDoc(doc(db, "users", uid), updates)
}

// ─── Favoriler ────────────────────────────────────────────────────────────────

export async function getFavorites(uid: string): Promise<string[]> {
  try {
    const snap = await getDoc(doc(db, "users", uid))
    if (snap.exists()) {
      return snap.data().favorites || []
    }
    return []
  } catch {
    return []
  }
}

export async function addToFavorites(uid: string, listingId: string): Promise<void> {
  await updateDoc(doc(db, "users", uid), { favorites: arrayUnion(listingId) })
}

export async function removeFromFavorites(uid: string, listingId: string): Promise<void> {
  await updateDoc(doc(db, "users", uid), { favorites: arrayRemove(listingId) })
}

// ─── Ilanlar ─────────────────────────────────────────────────────────────────

export async function addListingToFirestore(listing: Listing, uid: string): Promise<string> {
  const ref = await addDoc(collection(db, "listings"), {
    ...listing,
    sellerId: uid,
    createdAt: serverTimestamp(),
  })
  return ref.id
}

export async function getUserListings(uid: string): Promise<Listing[]> {
  try {
    const q = query(collection(db, "listings"), where("sellerId", "==", uid), orderBy("createdAt", "desc"))
    const snap = await getDocs(q)
    return snap.docs.map((d) => ({ ...d.data(), id: d.id }) as Listing)
  } catch {
    return []
  }
}

export function subscribeToUserListings(uid: string, callback: (listings: Listing[]) => void): Unsubscribe {
  const q = query(collection(db, "listings"), where("sellerId", "==", uid), orderBy("createdAt", "desc"))
  return onSnapshot(q, (snap) => {
    const listings = snap.docs.map((d) => ({ ...d.data(), id: d.id }) as Listing)
    callback(listings)
  })
}

export async function addListingIdToUser(uid: string, listingId: string): Promise<void> {
  await updateDoc(doc(db, "users", uid), { myListings: arrayUnion(listingId) })
}

// ─── Teklifler ────────────────────────────────────────────────────────────────

export async function sendOfferToFirestore(offer: Omit<Offer, "id" | "createdAt" | "status">): Promise<string> {
  const ref = await addDoc(collection(db, "offers"), {
    ...offer,
    createdAt: new Date().toISOString(),
    status: "pending",
  })
  return ref.id
}

export function subscribeToMyOffers(uid: string, callback: (offers: Offer[]) => void): Unsubscribe {
  const q = query(collection(db, "offers"), where("offererId", "==", uid), orderBy("createdAt", "desc"))
  return onSnapshot(q, (snap) => {
    const offers = snap.docs.map((d) => ({ ...d.data(), id: d.id }) as Offer)
    callback(offers)
  })
}

export function subscribeToReceivedOffers(uid: string, callback: (offers: Offer[]) => void): Unsubscribe {
  const q = query(collection(db, "offers"), where("sellerId", "==", uid), orderBy("createdAt", "desc"))
  return onSnapshot(q, (snap) => {
    const offers = snap.docs.map((d) => ({ ...d.data(), id: d.id }) as Offer)
    callback(offers)
  })
}

export async function updateOfferInFirestore(
  offerId: string,
  status: Offer["status"],
  extraData?: Partial<Offer>,
): Promise<void> {
  await updateDoc(doc(db, "offers", offerId), { status, ...extraData })
}
