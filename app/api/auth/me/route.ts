import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { sql } from "@/lib/db"

export async function GET() {
  const session = await getSession()

  if (!session) {
    return NextResponse.json({ user: null })
  }

  try {
    const result = await sql`
      SELECT id, first_name, last_name, phone, location, is_verified, 
             phone_verified, identity_verified, fast_responder, 
             successful_sales, member_since, response_rate
      FROM users WHERE id = ${session.id}
    `

    if (result.length === 0) {
      return NextResponse.json({ user: null })
    }

    const user = result[0]
    return NextResponse.json({
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        location: user.location,
        isVerified: user.is_verified,
        phoneVerified: user.phone_verified,
        identityVerified: user.identity_verified,
        fastResponder: user.fast_responder,
        successfulSales: user.successful_sales,
        memberSince: user.member_since,
        responseRate: user.response_rate,
      },
    })
  } catch (error) {
    console.error("Me error:", error)
    return NextResponse.json({ user: null })
  }
}
