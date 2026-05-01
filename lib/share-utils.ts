export function getBaseUrl(): string {
  // Production/deployed URL varsa onu kullan
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "")
  }
  // Vercel deploy URL (preview & production)
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  }
  // Fallback: browser origin
  if (typeof window !== "undefined") {
    return window.location.origin
  }
  return ""
}

export function getListingShareUrl(listingId: string): string {
  return `${getBaseUrl()}/ilan/${listingId}`
}

export function buildWhatsAppShareText(params: {
  title: string
  price: string
  location: string
  listingId: string
}): string {
  const url = getListingShareUrl(params.listingId)
  return `${params.title}\n${params.price} TL\n${params.location}\n\n${url}`
}
