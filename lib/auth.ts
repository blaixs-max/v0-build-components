import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "default-secret-change-in-production"
)

export interface SessionUser {
  id: string
  firstName: string
  lastName: string
  phone: string
  location: string | null
}

export async function createSession(user: SessionUser) {
  const token = await new SignJWT({
    userId: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    location: user.location,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(JWT_SECRET)

  const cookieStore = await cookies()
  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  })

  return token
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("session")?.value

  if (!token) return null

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return {
      id: payload.userId as string,
      firstName: payload.firstName as string,
      lastName: payload.lastName as string,
      phone: payload.phone as string,
      location: (payload.location as string) || null,
    }
  } catch {
    return null
  }
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete("session")
}
